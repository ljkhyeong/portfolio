package com.ljkhyeong.portfolio.knowledge.config;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import com.ljkhyeong.portfolio.knowledge.adapter.ai.UnavailableAnswerGenerationAdapter;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationHandler;
import io.micrometer.observation.ObservationRegistry;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.ai.chat.client.ChatClientBuilderCustomizer;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.model.chat.client.autoconfigure.ChatClientAutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

class AiPortConfigurationTest {

    @Test
    void AI를_끄면_ChatClient_빌더_없이_기동한다() {
        contextRunner("disabled").run(context -> {
            assertThat(context).hasNotFailed();
            assertThat(context.getBean(AnswerGenerationPort.class))
                    .isInstanceOf(UnavailableAnswerGenerationAdapter.class);
            assertThat(context.getBean(EmbeddingPort.class).available()).isFalse();
        });
    }

    @Test
    void AI를_켰는데_빌더가_없으면_설정_오류로_기동을_중단한다() {
        contextRunner("openai").run(context -> {
            assertThat(context).hasFailed();
            assertThat(context.getStartupFailure()).hasRootCauseMessage(
                    "AI provider가 설정되었지만 ChatClient.Builder를 찾을 수 없습니다."
            );
        });
    }

    @Test
    void 자동_설정된_빌더의_공통_옵션과_관측_설정을_답변_호출에_적용한다() {
        ChatModel chatModel = mock(ChatModel.class);
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());
        when(chatModel.call(any(Prompt.class))).thenReturn(new ChatResponse(List.of(
                new Generation(new AssistantMessage("{\"answerable\":false,\"paragraphs\":[]}"))
        )));
        List<String> observations = new ArrayList<>();
        ObservationRegistry registry = ObservationRegistry.create();
        registry.observationConfig().observationHandler(new ObservationHandler<Observation.Context>() {
            @Override
            public boolean supportsContext(Observation.Context context) {
                return true;
            }

            @Override
            public void onStop(Observation.Context context) {
                observations.add(context.getName());
            }
        });

        contextRunner("openai")
                .withConfiguration(AutoConfigurations.of(ChatClientAutoConfiguration.class))
                .withBean(ChatModel.class, () -> chatModel)
                .withBean(ObservationRegistry.class, () -> registry)
                .withBean(ChatClientBuilderCustomizer.class, () -> builder -> builder.defaultOptions(
                        ChatOptions.builder().temperature(0.25)
                ))
                .run(context -> {
                    assertThat(context).hasNotFailed();

                    var answer = context.getBean(AnswerGenerationPort.class).generate("질문", List.of());

                    assertThat(answer.answerable()).isFalse();
                    ArgumentCaptor<Prompt> prompt = ArgumentCaptor.forClass(Prompt.class);
                    verify(chatModel).call(prompt.capture());
                    assertThat(prompt.getValue().getOptions().getTemperature()).isEqualTo(0.25);
                    assertThat(prompt.getValue().getSystemMessage().getText()).contains("제공된 근거만 사용해");
                    assertThat(observations).contains("spring.ai.chat.client");
                });
    }

    private ApplicationContextRunner contextRunner(String provider) {
        return new ApplicationContextRunner()
                .withUserConfiguration(AiPortConfiguration.class)
                .withBean(KnowledgeProperties.class, () -> knowledgeProperties("ai.provider", provider))
                .withBean(EmbeddingModel.class, () -> mock(EmbeddingModel.class));
    }
}
