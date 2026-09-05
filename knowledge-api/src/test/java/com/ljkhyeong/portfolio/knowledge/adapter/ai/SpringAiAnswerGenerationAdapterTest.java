package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort.AnswerContext;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;
import com.openai.errors.OpenAIException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.ai.retry.TransientAiException;
import org.springframework.web.client.ResourceAccessException;

class SpringAiAnswerGenerationAdapterTest {

    @Test
    void 시스템_지침과_공개_근거를_전달하고_답변을_정리한다() {
        ChatModel chatModel = mock(ChatModel.class);
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());
        when(chatModel.call(any(Prompt.class))).thenReturn(new ChatResponse(List.of(
                new Generation(new AssistantMessage("""
                        {"answerable":true,"paragraphs":[
                          {"text":"알림 이벤트를 다시 처리합니다.","citationIds":["1"]}
                        ]}
                        """))
        )));
        var adapter = new SpringAiAnswerGenerationAdapter(ChatClient.builder(chatModel));

        var answer = adapter.generate(
                "알림은 어떻게 복구하나요?",
                List.of(new AnswerContext("1", "BATON", "알림 복구", "{재처리} 근거"))
        );

        ArgumentCaptor<Prompt> prompt = ArgumentCaptor.forClass(Prompt.class);
        verify(chatModel).call(prompt.capture());
        assertThat(prompt.getValue().getSystemMessage().getText()).contains("제공된 근거만 사용해");
        assertThat(prompt.getValue().getUserMessage().getText())
                .contains("알림은 어떻게 복구하나요?", "[1] BATON / 알림 복구", "{재처리} 근거");
        assertThat(answer.answerable()).isTrue();
        assertThat(answer.paragraphs().getFirst().text()).isEqualTo("알림 이벤트를 다시 처리합니다.");
        assertThat(answer.paragraphs().getFirst().citationIds()).containsExactly("1");
    }

    @ParameterizedTest
    @MethodSource("providerFailures")
    void 제공자_장애를_답변_생성_불가_예외로_변환한다(RuntimeException providerFailure) {
        ChatModel chatModel = mock(ChatModel.class);
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());
        when(chatModel.call(any(Prompt.class))).thenThrow(providerFailure);
        var adapter = new SpringAiAnswerGenerationAdapter(ChatClient.builder(chatModel));

        assertThatThrownBy(() -> adapter.generate("질문", List.of()))
                .isInstanceOf(AnswerGenerationUnavailableException.class)
                .hasCause(providerFailure);
    }

    @Test
    void 임의의_코드_오류는_답변_생성_불가_예외로_바꾸지_않는다() {
        ChatModel chatModel = mock(ChatModel.class);
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());
        IllegalStateException programmingError = new IllegalStateException("programming error");
        when(chatModel.call(any(Prompt.class))).thenThrow(programmingError);
        var adapter = new SpringAiAnswerGenerationAdapter(ChatClient.builder(chatModel));

        assertThatThrownBy(() -> adapter.generate("질문", List.of())).isSameAs(programmingError);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "JSON 형식이 아닌 답변", "{\"answerable\":true,\"paragraphs\":{}}"})
    void 잘못된_JSON은_추가_AI_호출_없이_생성_불가로_처리한다(String response) {
        ChatModel chatModel = mock(ChatModel.class);
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());
        when(chatModel.call(any(Prompt.class))).thenReturn(new ChatResponse(List.of(
                new Generation(new AssistantMessage(response))
        )));
        var adapter = new SpringAiAnswerGenerationAdapter(ChatClient.builder(chatModel));

        assertThatThrownBy(() -> adapter.generate("질문", List.of()))
                .isInstanceOf(AnswerGenerationUnavailableException.class);
        verify(chatModel).call(any(Prompt.class));
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
