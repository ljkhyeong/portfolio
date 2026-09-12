package com.ljkhyeong.portfolio.knowledge.config;

import java.time.Duration;

import com.ljkhyeong.portfolio.knowledge.adapter.verification.CloudflareTurnstileVerificationAdapter;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class HumanVerificationConfiguration {

    private static final String CLOUDFLARE_BASE_URL = "https://challenges.cloudflare.com";

    @Bean
    HumanVerificationPort humanVerificationPort(KnowledgeProperties properties) {
        KnowledgeProperties.HumanVerification configuration = properties.humanVerification();
        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(configuration.connectTimeoutSeconds()));
        requestFactory.setReadTimeout(Duration.ofSeconds(configuration.readTimeoutSeconds()));
        RestClient restClient = RestClient.builder()
                .baseUrl(CLOUDFLARE_BASE_URL)
                .requestFactory(requestFactory)
                .build();
        return new CloudflareTurnstileVerificationAdapter(restClient, configuration.secretKey());
    }
}
