package com.ljkhyeong.portfolio.knowledge.api;

import java.io.IOException;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;

@Component
public class KnowledgeRateLimitInterceptor implements HandlerInterceptor {

    private final KnowledgeRateLimiter rateLimiter;
    private final KnowledgeProperties properties;
    private final ObjectMapper objectMapper;

    public KnowledgeRateLimitInterceptor(
            KnowledgeRateLimiter rateLimiter,
            KnowledgeProperties properties,
            ObjectMapper objectMapper
    ) {
        this.rateLimiter = rateLimiter;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        KnowledgeRateLimiter.RequestKind kind = request.getRequestURI().endsWith("/answers")
                ? KnowledgeRateLimiter.RequestKind.ANSWER
                : KnowledgeRateLimiter.RequestKind.SEARCH;
        KnowledgeRateLimiter.RateLimitDecision decision = rateLimiter.tryAcquire(kind, resolveClientId(request));
        if (decision.allowed()) {
            return true;
        }

        response.setStatus(429);
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(decision.retryAfterSeconds()));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(java.nio.charset.StandardCharsets.UTF_8.name());
        String code = kind == KnowledgeRateLimiter.RequestKind.ANSWER
                ? "ANSWER_RATE_LIMITED"
                : "SEARCH_RATE_LIMITED";
        objectMapper.writeValue(response.getWriter(), new ApiErrorResponse(
                code,
                "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
                java.util.Map.of()
        ));
        return false;
    }

    private String resolveClientId(HttpServletRequest request) {
        if (properties.ai().trustProxyHeaders()) {
            String forwardedFor = request.getHeader("X-Forwarded-For");
            if (StringUtils.hasText(forwardedFor)) {
                return forwardedFor.split(",", 2)[0].strip();
            }
        }
        return StringUtils.hasText(request.getRemoteAddr()) ? request.getRemoteAddr() : "unknown";
    }
}
