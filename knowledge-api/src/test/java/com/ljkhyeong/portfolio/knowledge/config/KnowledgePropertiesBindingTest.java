package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.mock.env.MockEnvironment;

class KnowledgePropertiesBindingTest {

    @Test
    void 운영_CORS_주소를_쉼표로_구분해_덮어쓴다() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty(
                        "knowledge.cors.allowed-origins",
                        "https://portfolio.example.com,https://preview.example.com"
                );

        KnowledgeProperties properties = Binder.get(environment)
                .bind("knowledge", Bindable.of(KnowledgeProperties.class))
                .get();

        assertThat(properties.getCors().getAllowedOrigins()).containsExactly(
                "https://portfolio.example.com",
                "https://preview.example.com"
        );
    }
}
