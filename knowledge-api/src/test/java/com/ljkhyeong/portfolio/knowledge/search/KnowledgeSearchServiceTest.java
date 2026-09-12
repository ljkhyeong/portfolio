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
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.stream.Stream;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.adapter.ai.SpringAiEmbeddingAdapter;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.index.KnowledgeIndexInitializer;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingResponse;

class KnowledgeSearchServiceTest {

    private final SimpleMeterRegistry meters = new SimpleMeterRegistry();

    @Test
    void 키워드_조회가_불완전하면_검색을_중단하고_임베딩을_호출하지_않는다() {
        var embedding = mock(EmbeddingPort.class);
        var index = mock(KnowledgeIndexPort.class);
        var failure = new KnowledgeIndexAccessException("Elasticsearch 조회가 완료되지 않았습니다.");
        when(index.searchBm25(anyString(), any(), anyInt())).thenThrow(failure);
        var service = new KnowledgeSearchService(knowledgeProperties(), embedding,
                mock(KnowledgeIndexInitializer.class), index, new RrfRanker(), meters);

        assertThatThrownBy(() -> service.search("알림", List.of(), List.of(), 6)).isSameAs(failure);
        verifyNoInteractions(embedding);
        verify(index, never()).searchKnn(anyList(), any(), anyInt(), anyInt());
    }

    @Test
    void 벡터_조회만_불완전하면_정상_키워드_결과를_유지한다() {
        var embedding = mock(EmbeddingPort.class);
        when(embedding.available()).thenReturn(true);
        when(embedding.embed(anyList())).thenReturn(List.of(List.of(1f, 0f)));
        var index = mock(KnowledgeIndexPort.class);
        when(index.searchBm25(anyString(), any(), anyInt()))
                .thenReturn(List.of(new SearchHit(chunk("bm25-result"), 1)));
        when(index.searchKnn(anyList(), any(), anyInt(), anyInt()))
                .thenThrow(new KnowledgeIndexAccessException("Elasticsearch 조회가 완료되지 않았습니다."));
        var service = new KnowledgeSearchService(knowledgeProperties(), embedding,
                mock(KnowledgeIndexInitializer.class), index, new RrfRanker(), meters);

        assertThat(service.search("알림", List.of(), List.of(), 6).hits())
                .extracting(hit -> hit.chunk().chunkId()).containsExactly("bm25-result");
        assertThat(meters.get("knowledge.searches").tag("mode", "fallback").counter().count()).isEqualTo(1);
    }

    @ParameterizedTest
    @MethodSource("invalidEmbeddingResponses")
    void 잘못된_임베딩은_키워드로_대체하고_캐시하지_않아_다음_요청에서_복구한다(EmbeddingResponse response) {
        var model = mock(org.springframework.ai.embedding.EmbeddingModel.class);
        when(model.embedForResponse(anyList())).thenReturn(response)
                .thenReturn(new EmbeddingResponse(List.of(new Embedding(new float[]{1, 0}, 0))));
        var embedding = new SpringAiEmbeddingAdapter(model, "test-model", 2);
        var index = mock(KnowledgeIndexPort.class);
        when(index.searchBm25(anyString(), any(), anyInt()))
                .thenReturn(List.of(new SearchHit(chunk("bm25-result"), 1)));
        var service = new KnowledgeSearchService(knowledgeProperties(), embedding,
                mock(KnowledgeIndexInitializer.class), index, new RrfRanker(), meters);

        assertThat(service.search("알림 재처리", List.of(), List.of(), 6).hits())
                .extracting(hit -> hit.chunk().chunkId()).containsExactly("bm25-result");
        verify(index, never()).searchKnn(anyList(), any(), anyInt(), anyInt());
        service.search("알림 재처리", List.of(), List.of(), 6);
        service.search("알림 재처리", List.of(), List.of(), 6);

        verify(model, times(2)).embedForResponse(anyList());
        verify(index, times(2)).searchKnn(eq(List.of(1f, 0f)), any(), anyInt(), anyInt());
        assertThat(meters.get("knowledge.searches").tag("mode", "fallback").counter().count()).isEqualTo(1);
        assertThat(meters.get("knowledge.searches").tag("mode", "hybrid").counter().count()).isEqualTo(2);
        assertThat(cacheLookups("query_embedding", "hit")).isEqualTo(1);
    }

    private static Stream<EmbeddingResponse> invalidEmbeddingResponses() {
        return Stream.of(new EmbeddingResponse(List.of()),
                new EmbeddingResponse(List.of(new Embedding(new float[]{1, 0}, 1))));
    }

    @Test
    void 검색_목록은_문서별로_제한하고_답변용_문단은_유지한다() {
        KnowledgeIndexPort index = mock(KnowledgeIndexPort.class);
        var service = new KnowledgeSearchService(knowledgeProperties(), mock(EmbeddingPort.class),
                mock(KnowledgeIndexInitializer.class), index, new RrfRanker(), meters);
        when(index.searchBm25(anyString(), any(), anyInt())).thenReturn(List.of(
                new SearchHit(chunk("a#0", "a"), 10), new SearchHit(chunk("a#1", "a"), 9),
                new SearchHit(chunk("b#0", "b"), 8), new SearchHit(chunk("c#0", "c"), 7)));

        var result = service.search("알림 복구", List.of(), List.of(), 2);

        assertThat(result.hits()).extracting(hit -> hit.chunk().documentId()).containsExactly("a", "b");
        assertThat(result.candidates()).extracting(hit -> hit.chunk().chunkId())
                .containsExactly("a#0", "a#1", "b#0", "c#0");
    }

    @Test
    void 같은_질문의_벡터는_재사용하고_필터별_문서는_다시_검색한다() {
        var properties = knowledgeProperties();
        EmbeddingPort embedding = mock(EmbeddingPort.class);
        KnowledgeIndexPort index = mock(KnowledgeIndexPort.class);
        when(embedding.available()).thenReturn(true);
        when(embedding.embed(List.of("결제 재처리"))).thenReturn(List.of(List.of(1.0f, 0.0f)));
        var service = new KnowledgeSearchService(properties, embedding,
                mock(KnowledgeIndexInitializer.class), index, new RrfRanker(), meters);

        service.search("결제 재처리", List.of(), List.of(), 10);
        service.search("결제 재처리", List.of("happygallery"), List.of(), 6);

        assertThat(meters.get("knowledge.searches").tag("mode", "hybrid").counter().count()).isEqualTo(2);
        assertThat(cacheLookups("query_embedding", "miss")).isEqualTo(1);
        assertThat(cacheLookups("query_embedding", "hit")).isEqualTo(1);
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
                new RrfRanker(), meters
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
        assertThat(result.hasBm25Evidence(result.candidates())).isTrue();
        assertThat(meters.get("knowledge.searches").tag("mode", "fallback").counter().count()).isEqualTo(2);
        assertThat(meters.find("knowledge.searches").tag("mode", "keyword").counter()).isNull();
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
                new RrfRanker(), meters
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
    void 프로젝트와_서비스와_문서_종류에_같은_정규화_규칙을_적용한다(
            List<String> projectIds,
            List<String> serviceIds,
            List<String> documentTypes,
            KnowledgeFilter expected
    ) {
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        var service = new KnowledgeSearchService(
                knowledgeProperties(), mock(EmbeddingPort.class), mock(KnowledgeIndexInitializer.class),
                indexPort, new RrfRanker(), meters
        );

        service.search("알림", projectIds, serviceIds, documentTypes, 10);

        verify(indexPort).searchBm25(eq("알림"), eq(expected), anyInt());
        assertThat(meters.get("knowledge.searches").tag("mode", "keyword").counter().count()).isEqualTo(1);
    }

    @Test
    void 정규화_후에도_지원하지_않는_문서_종류는_검색하지_않는다() {
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        var service = new KnowledgeSearchService(
                knowledgeProperties(), mock(EmbeddingPort.class), mock(KnowledgeIndexInitializer.class),
                indexPort, new RrfRanker(), meters
        );

        assertThatThrownBy(() -> service.search("알림", List.of(), List.of(" PRIVATE "), 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("지원하지 않는 문서 종류입니다: private");
        verify(indexPort, never()).searchBm25(anyString(), any(), anyInt());
    }

    private static Stream<Arguments> filters() {
        return Stream.of(
                Arguments.of(
                        null,
                        null,
                        null,
                        new KnowledgeFilter(List.of(), List.of(), List.of())
                ),
                Arguments.of(
                        List.of(" BATON ", "baton", ""),
                        List.of(" GO ", "go", " "),
                        List.of(" PROJECT_OVERVIEW ", "project_overview", " "),
                        new KnowledgeFilter(
                                List.of("baton"),
                                List.of("go"),
                                List.of("project_overview")
                        )
                )
        );
    }

    private double cacheLookups(String cache, String result) {
        return meters.get("knowledge.cache.lookups")
                .tag("cache", cache)
                .tag("result", result)
                .counter()
                .count();
    }

}
