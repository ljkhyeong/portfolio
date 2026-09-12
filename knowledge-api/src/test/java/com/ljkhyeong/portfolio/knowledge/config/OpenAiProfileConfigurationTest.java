package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.ai.model.openai.autoconfigure.OpenAiChatProperties;
import org.springframework.ai.model.openai.autoconfigure.OpenAiCommonProperties;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.env.MockEnvironment;

class OpenAiProfileConfigurationTest {

    @Test
    void 기본_호출_시간과_출력량을_제한하고_SDK_중복_재시도를_끈다() throws Exception {
        MockEnvironment environment = loadProfile(new MockEnvironment());
        Binder binder = Binder.get(environment);

        OpenAiCommonProperties common = bindCommon(binder);
        OpenAiChatProperties chat = bindChat(binder);

        assertThat(common.getTimeout()).isEqualTo(Duration.ofSeconds(30));
        assertThat(common.getMaxRetries()).isZero();
        assertThat(chat.getMaxCompletionTokens()).isEqualTo(2_000);
        assertThat(environment.getProperty("spring.ai.retry.max-attempts", Integer.class)).isEqualTo(2);
    }

    @Test
    void 운영_환경변수로_OpenAI_호출_제한을_덮어쓴다() throws Exception {
        var environment = new MockEnvironment()
                .withProperty("OPENAI_REQUEST_TIMEOUT", "17s")
                .withProperty("OPENAI_SDK_MAX_RETRIES", "0")
                .withProperty("AI_RETRY_MAX_ATTEMPTS", "2")
                .withProperty("OPENAI_MAX_COMPLETION_TOKENS", "321");
        loadProfile(environment);
        Binder binder = Binder.get(environment);

        OpenAiCommonProperties common = bindCommon(binder);
        OpenAiChatProperties chat = bindChat(binder);

        assertThat(common.getTimeout()).isEqualTo(Duration.ofSeconds(17));
        assertThat(common.getMaxRetries()).isZero();
        assertThat(chat.getMaxCompletionTokens()).isEqualTo(321);
        assertThat(environment.getProperty("spring.ai.retry.max-attempts", Integer.class)).isEqualTo(2);
    }

    private MockEnvironment loadProfile(MockEnvironment environment) throws Exception {
        new YamlPropertySourceLoader()
                .load("openai", new ClassPathResource("application-openai.yml"))
                .forEach(environment.getPropertySources()::addLast);
        return environment;
    }

    private OpenAiCommonProperties bindCommon(Binder binder) {
        return binder
                .bind("spring.ai.openai", Bindable.of(OpenAiCommonProperties.class))
                .get();
    }

    private OpenAiChatProperties bindChat(Binder binder) {
        return binder
                .bind("spring.ai.openai.chat", Bindable.of(OpenAiChatProperties.class))
                .get();
    }
}
