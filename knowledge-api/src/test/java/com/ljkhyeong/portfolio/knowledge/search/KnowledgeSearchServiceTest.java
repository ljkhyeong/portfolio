package com.ljkhyeong.portfolio.knowledge.search;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.stream.Stream;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.index.KnowledgeIndexInitializer;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class KnowledgeSearchServiceTest {

    @Test
    void 같은_질문의_벡터는_재사용하고_필터별_문서는_다시_검색한다() {
        var properties = knowledgeProperties();
        EmbeddingPort embedding = mock(EmbeddingPort.class);
        KnowledgeIndexPort index = mock(KnowledgeIndexPort.class);
        when(embedding.available()).thenReturn(true);
        when(embedding.embed(List.of("결제 재처리"))).thenReturn(List.of(List.of(1.0f, 0.0f)));
        var service = new KnowledgeSearchService(properties, embedding,
                mock(KnowledgeIndexInitializer.class), index, new RrfRanker());

        service.search("결제 재처리", List.of(), List.of(), 10);
        service.search("결제 재처리", List.of("happygallery"), List.of(), 6);

        verify(embedding).embed(List.of("결제 재처리"));
        verify(index, times(2)).searchBm25(anyString(), any(), anyInt());
        verify(index).searchKnn(eq(List.of(1.0f, 0.0f)),
                eq(new KnowledgeFilter(List.of("happygallery"), List.of())), anyInt(), anyInt());
    }

    @Test
    void 임베딩에_실패해도_BM25_검색_결과를_반환한다() {
        KnowledgeProperties properties = knowledgeProperties();
        EmbeddingPort embeddingPort = mock(EmbeddingPort.class);
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        KnowledgeSearchService service = new KnowledgeSearchService(
                properties,
                embeddingPort,
                new KnowledgeIndexInitializer(properties, embeddingPort, indexPort),
                indexPort,
                new RrfRanker()
        );
        SearchHit bm25Hit = new SearchHit(chunk("bm25-result"), 5);
        when(embeddingPort.modelId()).thenReturn("test-model");
        when(embeddingPort.dimensions()).thenReturn(2);
        when(embeddingPort.available()).thenReturn(true);
        when(indexPort.searchBm25(anyString(), any(), anyInt())).thenReturn(List.of(bm25Hit));
        when(embeddingPort.embed(anyList())).thenThrow(new EmbeddingUnavailableException(
                "provider error",
                new IllegalStateException("provider error")
        ));

        var result = service.search("알림 재처리", List.of(), List.of(), 10);

        service.search("알림 재처리", List.of(), List.of(), 10);
        verify(indexPort).ensureIndex("test-model", 2, properties.source().chunkingFingerprint());
        verify(indexPort, times(2)).searchBm25(anyString(), any(), anyInt());

        assertThat(result.hits()).extracting(hit -> hit.chunk().chunkId()).containsExactly("bm25-result");
        assertThat(result.hasBm25Evidence()).isTrue();
        verify(indexPort, never()).searchKnn(anyList(), any(), anyInt(), anyInt());
    }

    @Test
    void 임의의_코드_오류는_BM25_결과로_대체하지_않고_전파한다() {
        KnowledgeProperties properties = knowledgeProperties();
        EmbeddingPort embeddingPort = mock(EmbeddingPort.class);
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        KnowledgeSearchService service = new KnowledgeSearchService(
                properties,
                embeddingPort,
                new KnowledgeIndexInitializer(properties, embeddingPort, indexPort),
                indexPort,
                new RrfRanker()
        );
        when(embeddingPort.modelId()).thenReturn("test-model");
        when(embeddingPort.dimensions()).thenReturn(2);
        when(embeddingPort.available()).thenReturn(true);
        when(indexPort.searchBm25(anyString(), any(), anyInt()))
                .thenReturn(List.of(new SearchHit(chunk("bm25-result"), 5)));
        IllegalStateException programmingError = new IllegalStateException("programming error");
        when(embeddingPort.embed(anyList())).thenThrow(programmingError);

        assertThatThrownBy(() -> service.search("알림 재처리", List.of(), List.of(), 10))
                .isSameAs(programmingError);
    }

    @ParameterizedTest
    @MethodSource("filters")
    void 프로젝트와_문서_종류에_같은_정규화_규칙을_적용한다(
            List<String> projectIds, List<String> documentTypes, KnowledgeFilter expected
    ) {
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        var service = new KnowledgeSearchService(
                knowledgeProperties(), mock(EmbeddingPort.class), mock(KnowledgeIndexInitializer.class),
                indexPort, new RrfRanker()
        );

        service.search("알림", projectIds, documentTypes, 10);

        verify(indexPort).searchBm25(eq("알림"), eq(expected), anyInt());
    }

    @Test
    void 정규화_후에도_지원하지_않는_문서_종류는_검색하지_않는다() {
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        var service = new KnowledgeSearchService(
                knowledgeProperties(), mock(EmbeddingPort.class), mock(KnowledgeIndexInitializer.class),
                indexPort, new RrfRanker()
        );

        assertThatThrownBy(() -> service.search("알림", List.of(), List.of(" PRIVATE "), 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("지원하지 않는 문서 종류입니다: private");
        verify(indexPort, never()).searchBm25(anyString(), any(), anyInt());
    }

    private static Stream<Arguments> filters() {
        return Stream.of(
                Arguments.of(null, null, new KnowledgeFilter(List.of(), List.of())),
                Arguments.of(
                        List.of(" BATON ", "baton", ""),
                        List.of(" PROJECT_OVERVIEW ", "project_overview", " "),
                        new KnowledgeFilter(List.of("baton"), List.of("project_overview"))
                )
        );
    }

}
