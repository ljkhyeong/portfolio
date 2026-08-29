package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimitInterceptor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

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

    @Test
    void 브라우저에서_Retry_After_응답_헤더를_읽을_수_있게_노출한다() {
        KnowledgeProperties properties = new KnowledgeProperties();
        WebConfiguration configuration = new WebConfiguration(
                properties,
                mock(KnowledgeRateLimitInterceptor.class)
        );
        InspectableCorsRegistry registry = new InspectableCorsRegistry();

        configuration.addCorsMappings(registry);

        CorsConfiguration cors = registry.configurations().get("/api/v1/knowledge/**");
        assertThat(cors.getExposedHeaders()).contains(HttpHeaders.RETRY_AFTER);
    }

    @Test
    void 청크_길이나_겹침_범위가_바뀌면_호환성_지문도_바뀐다() {
        KnowledgeProperties properties = new KnowledgeProperties();
        String defaultFingerprint = properties.getSource().chunkingFingerprint();

        properties.getSource().setOverlapCharacters(200);

        assertThat(properties.getSource().chunkingFingerprint()).isNotEqualTo(defaultFingerprint);
    }

    @Test
    void 지원하지_않는_AI_profile은_설정_단계에서_거부한다() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("knowledge.ai.provider", "opneai");

        assertThatThrownBy(() -> Binder.get(environment)
                .bind("knowledge", Bindable.of(KnowledgeProperties.class))
                .get())
                .hasRootCauseInstanceOf(IllegalArgumentException.class)
                .hasStackTraceContaining("disabled, openai, ollama");
    }

    private static final class InspectableCorsRegistry extends CorsRegistry {

        private Map<String, CorsConfiguration> configurations() {
            return getCorsConfigurations();
        }
    }
}
