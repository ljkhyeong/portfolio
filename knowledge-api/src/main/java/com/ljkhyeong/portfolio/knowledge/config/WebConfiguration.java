package com.ljkhyeong.portfolio.knowledge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimitInterceptor;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    private final KnowledgeProperties properties;
    private final KnowledgeRateLimitInterceptor knowledgeRateLimitInterceptor;

    public WebConfiguration(
            KnowledgeProperties properties,
            KnowledgeRateLimitInterceptor knowledgeRateLimitInterceptor
    ) {
        this.properties = properties;
        this.knowledgeRateLimitInterceptor = knowledgeRateLimitInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/knowledge/**")
                .allowedOrigins(properties.getCors().getAllowedOrigins().toArray(String[]::new))
                .allowedMethods("POST", "OPTIONS")
                .allowedHeaders("Content-Type")
                .exposedHeaders(HttpHeaders.RETRY_AFTER)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(knowledgeRateLimitInterceptor)
                .addPathPatterns(
                        "/api/v1/knowledge/search",
                        "/api/v1/knowledge/answers"
                );
    }
}
