package com.ljkhyeong.portfolio.knowledge.api;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;

// 요청 종류는 WebConfiguration에 등록한 경로로 정한다.
public class KnowledgeRateLimitInterceptor implements HandlerInterceptor {

    private final KnowledgeRateLimiter rateLimiter;
    private final KnowledgeRateLimiter.RequestKind kind;
    private final ObjectMapper objectMapper;

    public KnowledgeRateLimitInterceptor(
            KnowledgeRateLimiter rateLimiter,
            KnowledgeRateLimiter.RequestKind kind,
            ObjectMapper objectMapper
    ) {
        this.rateLimiter = rateLimiter;
        this.kind = kind;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        // 프록시 뒤에서는 Tomcat RemoteIpValve(server.forward-headers-strategy=native)가
        // X-Forwarded-For를 오른쪽부터 확인해 remoteAddr를 클라이언트 주소로 바꾼다.
        KnowledgeRateLimiter.RateLimitDecision decision = rateLimiter.tryAcquire(kind, request.getRemoteAddr());
        if (decision.allowed()) {
            return true;
        }

        response.setStatus(429);
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(decision.retryAfterSeconds()));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), new ApiErrorResponse(
                kind.name() + "_RATE_LIMITED",
                "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
                Map.of()
        ));
        return false;
    }
}
