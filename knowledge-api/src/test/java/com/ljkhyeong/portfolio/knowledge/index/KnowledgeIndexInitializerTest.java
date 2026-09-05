package com.ljkhyeong.portfolio.knowledge.index;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

import com.ljkhyeong.portfolio.knowledge.adapter.ai.UnavailableEmbeddingAdapter;
import com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch.ElasticsearchAccessException;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.junit.jupiter.api.Test;

class KnowledgeIndexInitializerTest {

    private final KnowledgeProperties properties = knowledgeProperties();
    private final KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
    private final KnowledgeIndexInitializer initializer = new KnowledgeIndexInitializer(
            properties, new UnavailableEmbeddingAdapter(1024), indexPort
    );
    private final String fingerprint = properties.source().chunkingFingerprint();

    @Test
    void 동시_검색은_한_번_초기화하고_동기화할_때_다시_검사한다() throws Exception {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            var calls = IntStream.range(0, 8).mapToObj(index -> (Callable<Void>) () -> {
                initializer.ensureInitialized();
                return null;
            }).toList();
            for (var result : executor.invokeAll(calls)) {
                result.get();
            }
        }
        verify(indexPort).ensureIndex("disabled", 1024, fingerprint);

        initializer.refresh();
        initializer.ensureInitialized();

        verify(indexPort, times(2)).ensureIndex("disabled", 1024, fingerprint);
    }

    @Test
    void 최초_초기화_실패는_다음_검색에서_재시도한다() {
        doThrow(new ElasticsearchAccessException("connection refused")).doNothing()
                .when(indexPort).ensureIndex("disabled", 1024, fingerprint);

        assertThatThrownBy(initializer::ensureInitialized).isInstanceOf(ElasticsearchAccessException.class);
        initializer.ensureInitialized();
        initializer.ensureInitialized();

        verify(indexPort, times(2)).ensureIndex("disabled", 1024, fingerprint);
    }

    @Test
    void 재검사_실패_후에는_이전_초기화_결과를_재사용하지_않는다() {
        doNothing().doThrow(new ElasticsearchAccessException("incompatible index")).doNothing()
                .when(indexPort).ensureIndex("disabled", 1024, fingerprint);
        initializer.ensureInitialized();

        assertThatThrownBy(initializer::refresh).isInstanceOf(ElasticsearchAccessException.class);
        initializer.ensureInitialized();

        verify(indexPort, times(3)).ensureIndex("disabled", 1024, fingerprint);
    }
}
