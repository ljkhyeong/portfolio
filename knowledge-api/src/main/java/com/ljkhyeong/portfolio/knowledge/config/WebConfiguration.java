package com.ljkhyeong.portfolio.knowledge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tools.jackson.databind.ObjectMapper;

import com.ljkhyeong.portfolio.knowledge.api.KnowledgeHumanVerificationInterceptor;
import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimitInterceptor;
import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimiter;
import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimiter.RequestKind;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    private static final String SEARCH_PATH = "/api/v1/knowledge/search";
    private static final String ANSWER_PATH = "/api/v1/knowledge/answers";

    private final KnowledgeProperties properties;
    private final KnowledgeRateLimiter rateLimiter;
    private final KnowledgeHumanVerificationInterceptor knowledgeHumanVerificationInterceptor;
    private final ObjectMapper objectMapper;

    public WebConfiguration(
            KnowledgeProperties properties,
            KnowledgeRateLimiter rateLimiter,
            KnowledgeHumanVerificationInterceptor knowledgeHumanVerificationInterceptor,
            ObjectMapper objectMapper
    ) {
        this.properties = properties;
        this.rateLimiter = rateLimiter;
        this.knowledgeHumanVerificationInterceptor = knowledgeHumanVerificationInterceptor;
        this.objectMapper = objectMapper;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/knowledge/**")
                .allowedOrigins(properties.cors().allowedOrigins().toArray(String[]::new))
                .allowedMethods("POST", "OPTIONS")
                .allowedHeaders("Content-Type", KnowledgeHumanVerificationInterceptor.TOKEN_HEADER)
                .exposedHeaders(HttpHeaders.RETRY_AFTER)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 경로는 핸들러 매핑과 같은 PathPattern으로 판정해 인코딩한 경로도 같은 한도로 계산한다.
        // 호출 제한을 Turnstile 검증보다 먼저 적용하고 CORS 사전 요청은 제외한다.
        registry.addInterceptor(new KnowledgeRateLimitInterceptor(rateLimiter, RequestKind.SEARCH, objectMapper))
                .addPathPatterns(SEARCH_PATH)
                .includeHttpMethods(HttpMethod.POST);
        registry.addInterceptor(new KnowledgeRateLimitInterceptor(rateLimiter, RequestKind.ANSWER, objectMapper))
                .addPathPatterns(ANSWER_PATH)
                .includeHttpMethods(HttpMethod.POST);
        registry.addInterceptor(knowledgeHumanVerificationInterceptor)
                .addPathPatterns(ANSWER_PATH)
                .includeHttpMethods(HttpMethod.POST);
    }
}
