package com.ljkhyeong.portfolio.knowledge.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.validation.annotation.Validated;

// Gateway 연동값을 기동 단계에서 검증한다. openai 프로필은 application.yml의 프로필 그룹으로 함께 켜진다.
@Configuration(proxyBeanMethods = false)
@Profile("ai-gateway")
@EnableConfigurationProperties(AiGatewayConfiguration.Settings.class)
public class AiGatewayConfiguration {

    @Validated
    @ConfigurationProperties("knowledge.ai-gateway")
    public record Settings(
            @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]+") String accountId,
            @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]+") String gatewayId,
            @NotBlank String token
    ) {
    }
}
