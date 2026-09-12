package com.ljkhyeong.portfolio.knowledge.api;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.verification.KnowledgeHumanVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;

@Component
public class KnowledgeHumanVerificationInterceptor implements HandlerInterceptor {

    public static final String TOKEN_HEADER = "X-Turnstile-Token";
    public static final String OPERATOR_KEY_HEADER = "X-Knowledge-Sync-Key";

    private final KnowledgeHumanVerificationService verificationService;
    private final ObjectMapper objectMapper;

    public KnowledgeHumanVerificationInterceptor(
            KnowledgeHumanVerificationService verificationService,
            ObjectMapper objectMapper
    ) {
        this.verificationService = verificationService;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        return switch (verificationService.verify(
                request.getHeader(TOKEN_HEADER),
                request.getHeader(OPERATOR_KEY_HEADER)
        )) {
            case NOT_REQUIRED, VERIFIED -> true;
            case REJECTED -> reject(
                    response,
                    403,
                    "HUMAN_VERIFICATION_FAILED",
                    "자동 요청 방지 확인을 다시 진행해 주세요."
            );
            case UNAVAILABLE -> reject(
                    response,
                    503,
                    "HUMAN_VERIFICATION_UNAVAILABLE",
                    "자동 요청 방지 확인을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요."
            );
        };
    }

    private boolean reject(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), new ApiErrorResponse(code, message, Map.of()));
        return false;
    }
}
