package com.ljkhyeong.portfolio.knowledge.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ljkhyeong.portfolio.knowledge.verification.KnowledgeHumanVerificationService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class KnowledgeHumanVerificationInterceptorTest {

    private final KnowledgeHumanVerificationService service = mock(KnowledgeHumanVerificationService.class);
    private final KnowledgeHumanVerificationInterceptor interceptor = new KnowledgeHumanVerificationInterceptor(service);

    @Test
    void 검증된_답변_요청은_통과시킨다() {
        when(service.verify("verified-token", null))
                .thenReturn(KnowledgeHumanVerificationService.Decision.VERIFIED);
        MockHttpServletRequest request = request();
        request.addHeader(KnowledgeHumanVerificationInterceptor.TOKEN_HEADER, "verified-token");

        assertThat(interceptor.preHandle(request, new MockHttpServletResponse(), new Object())).isTrue();
        verify(service).verify("verified-token", null);
    }

    @Test
    void 검증에_실패한_답변_요청은_403을_반환한다() {
        when(service.verify(null, null)).thenReturn(KnowledgeHumanVerificationService.Decision.REJECTED);

        assertRejected(request(), 403, "HUMAN_VERIFICATION_FAILED");
    }

    @Test
    void 외부_검증_API_장애는_503으로_구분한다() {
        when(service.verify("token", null)).thenReturn(KnowledgeHumanVerificationService.Decision.UNAVAILABLE);
        MockHttpServletRequest request = request();
        request.addHeader(KnowledgeHumanVerificationInterceptor.TOKEN_HEADER, "token");

        assertRejected(request, 503, "HUMAN_VERIFICATION_UNAVAILABLE");
    }

    private void assertRejected(MockHttpServletRequest request, int status, String code) {
        assertThatThrownBy(() -> interceptor.preHandle(request, new MockHttpServletResponse(), new Object()))
                .isInstanceOfSatisfying(KnowledgeApiException.class, exception -> {
                    assertThat(exception.getStatusCode().value()).isEqualTo(status);
                    assertThat(exception.getBody().getProperties()).containsEntry("code", code);
                });
    }

    private MockHttpServletRequest request() {
        return new MockHttpServletRequest("POST", "/api/v1/knowledge/answers");
    }
}
