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
import org.junit.jupiter.api.AfterEach;
import org.mockito.ArgumentMatchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.test.util.ReflectionTestUtils;

class ElasticsearchExceptionTranslationTest {

    private final ElasticsearchKnowledgeRepository repository = new ElasticsearchKnowledgeRepository(knowledgeProperties());
    private final ElasticsearchClient client = mock(ElasticsearchClient.class);
    private final KnowledgeFilter filter = new KnowledgeFilter(List.of(), List.of());

    @AfterEach
    void close() {
        repository.close();
    }

    @ParameterizedTest
    @MethodSource("storageFailures")
    void 통신과_서버_오류만_저장소_예외로_변환한다(Exception failure) throws IOException {
        ReflectionTestUtils.setField(repository, "client", client);
        when(client.search(
                ArgumentMatchers.<Function<SearchRequest.Builder, ObjectBuilder<SearchRequest>>>any(),
                ArgumentMatchers.<Class<Object>>any()
        )).thenThrow(failure);

        assertThatThrownBy(() -> repository.searchKnn(List.of(1.0f), filter, 5, 10))
                .isInstanceOf(ElasticsearchAccessException.class)
                .hasCause(failure);
    }

    @Test
    void SDK_요청_생성_오류를_저장소_장애로_바꾸지_않는다() {
        assertThatThrownBy(() -> repository.searchKnn(null, filter, 5, 10))
                .isNotInstanceOf(ElasticsearchAccessException.class)
                .isInstanceOf(RuntimeException.class);
    }

    private static Stream<Exception> storageFailures() {
        return Stream.of(
                new IOException("connection refused"),
                new ElasticsearchException("search", ErrorResponse.of(response -> response
                        .status(503)
                        .error(error -> error.type("unavailable_shards_exception").reason("unavailable"))))
        );
    }
}
