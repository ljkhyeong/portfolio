package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.util.ObjectBuilder;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.ErrorResponse;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import org.mockito.ArgumentMatchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

class ElasticsearchExceptionTranslationTest {

    private final ElasticsearchClient client = mock(ElasticsearchClient.class);
    private final ElasticsearchKnowledgeRepository repository =
            new ElasticsearchKnowledgeRepository(knowledgeProperties(), client);
    private final KnowledgeFilter filter = new KnowledgeFilter(List.of(), List.of());

    @ParameterizedTest
    @MethodSource("storageFailures")
    void 통신과_서버_오류만_저장소_예외로_변환한다(Exception failure) throws IOException {
        when(client.search(
                ArgumentMatchers.<Function<SearchRequest.Builder, ObjectBuilder<SearchRequest>>>any(),
                ArgumentMatchers.<Class<Object>>any()
        )).thenThrow(failure);

        assertThatThrownBy(() -> repository.searchKnn(List.of(1.0f), filter, 5, 10))
                .isInstanceOf(KnowledgeIndexAccessException.class)
                .hasCause(failure);
    }

    @Test
    void 서버_오류의_상태_코드를_메시지에_남긴다() throws IOException {
        when(client.search(
                ArgumentMatchers.<Function<SearchRequest.Builder, ObjectBuilder<SearchRequest>>>any(),
                ArgumentMatchers.<Class<Object>>any()
        )).thenThrow(unavailable());

        assertThatThrownBy(() -> repository.searchKnn(List.of(1.0f), filter, 5, 10))
                .hasMessageContaining("상태 코드: 503");
    }

    @Test
    void SDK_요청_생성_오류를_저장소_장애로_바꾸지_않는다() throws IOException {
        try (var unreachableClient = ElasticsearchClient.of(config -> config.host("http://127.0.0.1:9"))) {
            var unreachable = new ElasticsearchKnowledgeRepository(knowledgeProperties(), unreachableClient);
            assertThatThrownBy(() -> unreachable.searchKnn(null, filter, 5, 10))
                    .isNotInstanceOf(KnowledgeIndexAccessException.class)
                    .isInstanceOf(RuntimeException.class);
        }
    }

    private static Stream<Exception> storageFailures() {
        return Stream.of(new IOException("connection refused"), unavailable());
    }

    private static ElasticsearchException unavailable() {
        return new ElasticsearchException("search", ErrorResponse.of(response -> response
                .status(503)
                .error(error -> error.type("unavailable_shards_exception").reason("unavailable"))));
    }
}
