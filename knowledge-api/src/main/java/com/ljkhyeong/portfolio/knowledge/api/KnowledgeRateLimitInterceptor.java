package com.ljkhyeong.portfolio.knowledge.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

// 요청 종류는 WebConfiguration에 등록한 경로로 정한다.
public class KnowledgeRateLimitInterceptor implements HandlerInterceptor {

    private final KnowledgeRateLimiter rateLimiter;
    private final KnowledgeRateLimiter.RequestKind kind;

    public KnowledgeRateLimitInterceptor(KnowledgeRateLimiter rateLimiter, KnowledgeRateLimiter.RequestKind kind) {
        this.rateLimiter = rateLimiter;
        this.kind = kind;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 프록시 뒤에서는 Tomcat RemoteIpValve(server.forward-headers-strategy=native)가
        // X-Forwarded-For를 오른쪽부터 확인해 remoteAddr를 클라이언트 주소로 바꾼다.
        KnowledgeRateLimiter.RateLimitDecision decision = rateLimiter.tryAcquire(kind, request.getRemoteAddr());
        if (decision.allowed()) {
            return true;
        }
        throw new KnowledgeApiException(
                HttpStatus.TOO_MANY_REQUESTS,
                kind.name() + "_RATE_LIMITED",
                "요청이 많습니다. 잠시 후 다시 시도해 주세요."
        ).retryAfter(decision.retryAfterSeconds());
    }
}
