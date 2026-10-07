package com.ljkhyeong.portfolio.knowledge.config;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.api.KnowledgeHumanVerificationInterceptor;
import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimiter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;
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

        assertThat(properties.cors().allowedOrigins()).containsExactly(
                "https://portfolio.example.com",
                "https://preview.example.com"
        );
    }

    @Test
    void 브라우저에서_Retry_After_응답_헤더를_읽을_수_있게_노출한다() {
        KnowledgeProperties properties = knowledgeProperties();
        WebConfiguration configuration = new WebConfiguration(
                properties,
                mock(KnowledgeRateLimiter.class),
                mock(KnowledgeHumanVerificationInterceptor.class)
        );
        InspectableCorsRegistry registry = new InspectableCorsRegistry();

        configuration.addCorsMappings(registry);

        CorsConfiguration cors = registry.configurations().get("/api/v1/knowledge/**");
        assertThat(cors.getExposedHeaders()).contains(HttpHeaders.RETRY_AFTER);
        assertThat(cors.getAllowedHeaders()).contains(KnowledgeHumanVerificationInterceptor.TOKEN_HEADER);
    }

    @Test
    void 청크_길이나_겹침_범위가_바뀌면_호환성_지문도_바뀐다() {
        KnowledgeProperties properties = knowledgeProperties();
        assertThat(properties.source().chunkingFingerprint()).isEqualTo("chunking-v1|max=1200|overlap=150");

        properties = knowledgeProperties("source.overlap-characters", "200");

        assertThat(properties.source().chunkingFingerprint()).isEqualTo("chunking-v1|max=1200|overlap=200");
    }

    @Test
    void 지원하지_않는_AI_profile은_설정_단계에서_거부한다() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("knowledge.ai.provider", "opneai");

        assertThatThrownBy(() -> Binder.get(environment)
                .bind("knowledge", Bindable.of(KnowledgeProperties.class))
                .get())
                .hasRootCauseInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void Turnstile을_켜고_비밀키를_누락하면_기동을_거부한다() {
        new ApplicationContextRunner().withUserConfiguration(PropertiesConfiguration.class)
                .withPropertyValues("knowledge.human-verification.enabled=true")
                .run(context -> assertThat(context).hasFailed());
    }

    @Test
    void 설정이_없으면_기존_기본값으로_기동한다() {
        new ApplicationContextRunner().withUserConfiguration(PropertiesConfiguration.class).run(context -> {
            assertThat(context).hasNotFailed();
            KnowledgeProperties properties = context.getBean(KnowledgeProperties.class);
            assertThat(properties).isEqualTo(knowledgeProperties());
            assertThat(properties.source().syncOnStartup()).isFalse();
            assertThat(properties.ai().provider()).isEqualTo(KnowledgeProperties.AiProvider.DISABLED);
            assertThat(properties.source().maxChunkCharacters()).isEqualTo(1200);
            assertThat(properties.source().maxBytes()).isEqualTo(8 * 1024 * 1024);
            assertThat(properties.elasticsearch().indexName()).isEqualTo("portfolio-knowledge");
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "knowledge.source.max-chunk-characters=199",
            "knowledge.source.overlap-characters=-1",
            "knowledge.source.overlap-characters=1200",
            "knowledge.source.location=https://example.com/portfolio.json",
            "knowledge.source.location=file://127.0.0.1/portfolio.json",
            "knowledge.source.location=classpath:",
            "knowledge.elasticsearch.index-name=*",
            "knowledge.elasticsearch.index-name=Portfolio",
            "knowledge.source.max-bytes=0",
            "knowledge.source.max-bytes=67108865",
            "knowledge.ai.embedding-dimensions=0",
            "knowledge.ai.answer-cache-ttl-seconds=-1",
            "knowledge.ai.answer-cache-max-entries=-1",
            "knowledge.ai.provider=opneai",
            "knowledge.search.default-limit=0",
            "knowledge.search.rrf-k=-1",
            "knowledge.human-verification.connect-timeout-seconds=0"
    })
    void 사용할_수_없는_설정은_기동할_때_거부한다(String property) {
        new ApplicationContextRunner().withUserConfiguration(PropertiesConfiguration.class)
                .withPropertyValues(property).run(context -> assertThat(context).hasFailed());
    }

    @Test
    void 제공자_이름을_바인딩하고_0_이하의_호출_제한을_허용한다() {
        new ApplicationContextRunner().withUserConfiguration(PropertiesConfiguration.class)
                .withPropertyValues(
                        "knowledge.ai.provider= OpenAI ",
                        "knowledge.search.rrf-k=0",
                        "knowledge.rate-limit.global-answers-per-minute=-1",
                        "knowledge.rate-limit.client-answers-per-minute=0",
                        "knowledge.rate-limit.max-clients-per-minute=-1"
                ).run(context -> {
                    assertThat(context).hasNotFailed();
                    KnowledgeProperties properties = context.getBean(KnowledgeProperties.class);
                    var rateLimit = properties.rateLimit();
                    assertThat(properties.search().rrfK()).isZero();
                    assertThat(properties.ai().provider()).isEqualTo(KnowledgeProperties.AiProvider.OPENAI);
                    assertThat(rateLimit.globalAnswersPerMinute()).isEqualTo(-1);
                    assertThat(rateLimit.clientAnswersPerMinute()).isZero();
                    assertThat(rateLimit.maxClientsPerMinute()).isEqualTo(-1);
                    assertThat(rateLimit.clientSearchesPerMinute()).isEqualTo(30);
                });
    }

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties(KnowledgeProperties.class)
    static class PropertiesConfiguration {
    }

    private static final class InspectableCorsRegistry extends CorsRegistry {

        private Map<String, CorsConfiguration> configurations() {
            return getCorsConfigurations();
        }
    }
}
