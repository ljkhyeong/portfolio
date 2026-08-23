package com.ljkhyeong.portfolio.knowledge.search;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.junit.jupiter.api.Test;

class KnowledgeSearchServiceTest {

    @Test
    void 임베딩에_실패해도_BM25_검색_결과를_반환한다() {
        KnowledgeProperties properties = new KnowledgeProperties();
        EmbeddingPort embeddingPort = mock(EmbeddingPort.class);
        KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
        KnowledgeSearchService service = new KnowledgeSearchService(
                properties,
                embeddingPort,
                indexPort,
                new RrfRanker()
        );
        SearchHit bm25Hit = new SearchHit(chunk("bm25-result"), 5);
        when(embeddingPort.modelId()).thenReturn("test-model");
        when(embeddingPort.dimensions()).thenReturn(2);
        when(embeddingPort.available()).thenReturn(true);
        when(indexPort.searchBm25(anyString(), any(), anyInt())).thenReturn(List.of(bm25Hit));
        when(embeddingPort.embed(anyList())).thenThrow(new IllegalStateException("provider error"));

        var result = service.search("알림 재처리", List.of(), List.of(), 10);

        assertThat(result.hits()).extracting(hit -> hit.chunk().chunkId()).containsExactly("bm25-result");
        assertThat(result.hasBm25Evidence()).isTrue();
        verify(indexPort, never()).searchKnn(anyList(), any(), anyInt(), anyInt());
    }
}
