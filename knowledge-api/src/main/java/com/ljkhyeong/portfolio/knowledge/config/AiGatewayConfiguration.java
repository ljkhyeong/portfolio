package com.ljkhyeong.portfolio.knowledge.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.validation.annotation.Validated;

@Configuration(proxyBeanMethods = false)
@Profile("ai-gateway")
@EnableConfigurationProperties(AiGatewayConfiguration.Settings.class)
public class AiGatewayConfiguration {

    public AiGatewayConfiguration(Settings settings, KnowledgeProperties properties) {
        if (properties.ai().provider() != KnowledgeProperties.AiProvider.OPENAI) {
            throw new IllegalArgumentException("ai-gateway 프로필은 openai 프로필과 함께 사용해야 합니다.");
        }
    }

    @Validated
    @ConfigurationProperties("knowledge.ai-gateway")
    public record Settings(
            @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]+") String accountId,
            @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]+") String gatewayId,
            @NotBlank String token
    ) {
    }
}
