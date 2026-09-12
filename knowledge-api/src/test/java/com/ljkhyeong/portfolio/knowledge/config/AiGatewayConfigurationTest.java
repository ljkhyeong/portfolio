package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

class AiGatewayConfigurationTest {

    private final ApplicationContextRunner runner = new ApplicationContextRunner()
            .withInitializer(context -> context.getEnvironment().setActiveProfiles("ai-gateway"))
            .withUserConfiguration(PropertiesConfiguration.class, AiGatewayConfiguration.class)
            .withPropertyValues("knowledge.ai.provider=openai", "knowledge.ai-gateway.account-id=account",
                    "knowledge.ai-gateway.gateway-id=portfolio", "knowledge.ai-gateway.token=test-only");

    @Test
    void OpenAI와_필수_연동값이_있으면_설정을_허용한다() {
        runner.run(context -> assertThat(context).hasNotFailed());
    }

    @ParameterizedTest
    @ValueSource(strings = {"knowledge.ai.provider=disabled", "knowledge.ai-gateway.account-id=",
            "knowledge.ai-gateway.gateway-id=../other", "knowledge.ai-gateway.token="})
    void 잘못된_연동_설정은_시작할_때_거부한다(String property) {
        runner.withPropertyValues(property).run(context -> assertThat(context).hasFailed());
    }

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties(KnowledgeProperties.class)
    static class PropertiesConfiguration {
    }
}
