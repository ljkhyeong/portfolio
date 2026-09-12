package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

import com.openai.errors.OpenAIException;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.ai.retry.TransientAiException;
import org.springframework.web.client.ResourceAccessException;

class SpringAiEmbeddingAdapterTest {

    @ParameterizedTest
    @MethodSource("invalidVectors")
    void 잘못된_API_벡터를_검색과_색인에_전달하지_않는다(List<float[]> vectors) {
        EmbeddingModel model = mock(EmbeddingModel.class);
        when(model.embed(anyList())).thenReturn(vectors);
        var adapter = new SpringAiEmbeddingAdapter(model, "test-model", 2);

        assertThatThrownBy(() -> adapter.embed(List.of("알림 재처리")))
                .isInstanceOf(EmbeddingUnavailableException.class);
    }

    @Test
    void 유효한_벡터는_순서와_값을_유지한다() {
        EmbeddingModel model = mock(EmbeddingModel.class);
        when(model.embed(anyList())).thenReturn(List.of(new float[]{1, 0}, new float[]{0, -1}));
        var adapter = new SpringAiEmbeddingAdapter(model, "test-model", 2);

        assertThat(adapter.embed(List.of("첫 질문", "두 번째 질문")))
                .containsExactly(List.of(1f, 0f), List.of(0f, -1f));
    }

    private static Stream<List<float[]>> invalidVectors() {
        return Stream.of(
                null,
                List.of(),
                List.of(new float[]{1, 0}, new float[]{0, 1}),
                java.util.Collections.singletonList(null),
                List.of(new float[]{1}),
                List.of(new float[]{Float.NaN, 1}),
                List.of(new float[]{Float.POSITIVE_INFINITY, 1}),
                List.of(new float[]{0, -0f})
        );
    }

    @ParameterizedTest
    @MethodSource("providerFailures")
    void 제공자_장애를_임베딩_생성_불가_예외로_변환한다(RuntimeException providerFailure) {
        EmbeddingModel embeddingModel = mock(EmbeddingModel.class);
        when(embeddingModel.embed(anyList())).thenThrow(providerFailure);
        var adapter = new SpringAiEmbeddingAdapter(embeddingModel, "test-model", 2);

        assertThatThrownBy(() -> adapter.embed(List.of("알림 재처리")))
                .isInstanceOf(EmbeddingUnavailableException.class)
                .hasCause(providerFailure);
    }

    @Test
    void 임의의_코드_오류는_임베딩_생성_불가_예외로_바꾸지_않는다() {
        EmbeddingModel embeddingModel = mock(EmbeddingModel.class);
        IllegalStateException programmingError = new IllegalStateException("programming error");
        when(embeddingModel.embed(anyList())).thenThrow(programmingError);
        var adapter = new SpringAiEmbeddingAdapter(embeddingModel, "test-model", 2);

        assertThatThrownBy(() -> adapter.embed(List.of("알림 재처리"))).isSameAs(programmingError);
    }

    private static Stream<RuntimeException> providerFailures() {
        return Stream.of(
                new TransientAiException("transient provider error"),
                new NonTransientAiException("non-transient provider error"),
                new OpenAIException("openai provider error"),
                new ResourceAccessException("ollama connection error", new IOException("connection refused"))
        );
    }
}
