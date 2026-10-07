package com.ljkhyeong.portfolio.knowledge.api;

import com.ljkhyeong.portfolio.knowledge.verification.KnowledgeHumanVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class KnowledgeHumanVerificationInterceptor implements HandlerInterceptor {

    public static final String TOKEN_HEADER = "X-Turnstile-Token";
    public static final String OPERATOR_KEY_HEADER = "X-Knowledge-Sync-Key";

    private final KnowledgeHumanVerificationService verificationService;

    public KnowledgeHumanVerificationInterceptor(KnowledgeHumanVerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        return switch (verificationService.verify(
                request.getHeader(TOKEN_HEADER),
                request.getHeader(OPERATOR_KEY_HEADER)
        )) {
            case NOT_REQUIRED, VERIFIED -> true;
            case REJECTED -> throw new KnowledgeApiException(
                    HttpStatus.FORBIDDEN,
                    "HUMAN_VERIFICATION_FAILED",
                    "자동 요청 방지 확인을 다시 진행해 주세요."
            );
            case UNAVAILABLE -> throw new KnowledgeApiException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "HUMAN_VERIFICATION_UNAVAILABLE",
                    "자동 요청 방지 확인을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요."
            );
        };
    }
}
