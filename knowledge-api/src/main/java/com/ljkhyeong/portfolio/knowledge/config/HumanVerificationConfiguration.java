package com.ljkhyeong.portfolio.knowledge.config;

import java.time.Duration;

import com.ljkhyeong.portfolio.knowledge.adapter.verification.CloudflareTurnstileVerificationAdapter;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.HttpClientSettings;
import org.springframework.boot.http.client.HttpRedirects;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class HumanVerificationConfiguration {

    private static final String CLOUDFLARE_BASE_URL = "https://challenges.cloudflare.com";

    @Bean
    HumanVerificationPort humanVerificationPort(
            RestClient.Builder restClientBuilder,
            KnowledgeProperties properties
    ) {
        KnowledgeProperties.HumanVerification configuration = properties.humanVerification();
        // 비밀 키가 담긴 요청이 다른 주소로 전달되지 않도록 리다이렉트를 따르지 않는다.
        HttpClientSettings settings = HttpClientSettings.defaults()
                .withTimeouts(
                        Duration.ofSeconds(configuration.connectTimeoutSeconds()),
                        Duration.ofSeconds(configuration.readTimeoutSeconds())
                )
                .withRedirects(HttpRedirects.DONT_FOLLOW);
        RestClient restClient = restClientBuilder
                .baseUrl(CLOUDFLARE_BASE_URL)
                // 자동 감지 팩토리(Reactor, 전역 설정에 시간 제한 없음)를 쓰지 않도록 고정한다.
                .requestFactory(ClientHttpRequestFactoryBuilder.simple().build(settings))
                .build();
        return new CloudflareTurnstileVerificationAdapter(restClient, configuration.secretKey());
    }
}
