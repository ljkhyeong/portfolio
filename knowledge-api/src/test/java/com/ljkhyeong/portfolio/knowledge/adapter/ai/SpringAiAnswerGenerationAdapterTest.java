package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort.AnswerContext;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;

class SpringAiAnswerGenerationAdapterTest {

    @Test
    void 시스템_지침과_공개_근거를_전달하고_답변을_정리한다() {
        ChatModel chatModel = mock(ChatModel.class);
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());
        when(chatModel.call(any(Prompt.class))).thenReturn(new ChatResponse(List.of(
                new Generation(new AssistantMessage("  알림 이벤트를 다시 처리합니다. [1]  "))
        )));
        var adapter = new SpringAiAnswerGenerationAdapter(chatModel);

        String answer = adapter.generate(
                "알림은 어떻게 복구하나요?",
                List.of(new AnswerContext("1", "BATON", "알림 복구", "{재처리} 근거"))
        );

        ArgumentCaptor<Prompt> prompt = ArgumentCaptor.forClass(Prompt.class);
        verify(chatModel).call(prompt.capture());
        assertThat(prompt.getValue().getSystemMessage().getText()).contains("제공된 근거만 사용해");
        assertThat(prompt.getValue().getUserMessage().getText())
                .contains("알림은 어떻게 복구하나요?", "[1] BATON / 알림 복구", "{재처리} 근거");
        assertThat(answer).isEqualTo("알림 이벤트를 다시 처리합니다. [1]");
    }
}
