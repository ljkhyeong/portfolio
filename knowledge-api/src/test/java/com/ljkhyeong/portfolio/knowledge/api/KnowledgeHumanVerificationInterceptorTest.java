package com.ljkhyeong.portfolio.knowledge.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ljkhyeong.portfolio.knowledge.verification.KnowledgeHumanVerificationService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import tools.jackson.databind.json.JsonMapper;

class KnowledgeHumanVerificationInterceptorTest {

    private final KnowledgeHumanVerificationService service = mock(KnowledgeHumanVerificationService.class);
    private final KnowledgeHumanVerificationInterceptor interceptor =
            new KnowledgeHumanVerificationInterceptor(service, new JsonMapper());

    @Test
    void 검증된_답변_요청은_통과시킨다() throws Exception {
        when(service.verify("verified-token", null))
                .thenReturn(KnowledgeHumanVerificationService.Decision.VERIFIED);
        MockHttpServletRequest request = request("POST");
        request.addHeader(KnowledgeHumanVerificationInterceptor.TOKEN_HEADER, "verified-token");

        assertThat(interceptor.preHandle(request, new MockHttpServletResponse(), new Object())).isTrue();
        verify(service).verify("verified-token", null);
    }

    @Test
    void 검증에_실패한_답변_요청은_403을_반환한다() throws Exception {
        when(service.verify(null, null)).thenReturn(KnowledgeHumanVerificationService.Decision.REJECTED);
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertThat(interceptor.preHandle(request("POST"), response, new Object())).isFalse();
        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(response.getContentAsString()).contains("HUMAN_VERIFICATION_FAILED");
    }

    @Test
    void 외부_검증_API_장애는_503으로_구분한다() throws Exception {
        when(service.verify("token", null)).thenReturn(KnowledgeHumanVerificationService.Decision.UNAVAILABLE);
        MockHttpServletRequest request = request("POST");
        request.addHeader(KnowledgeHumanVerificationInterceptor.TOKEN_HEADER, "token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertThat(interceptor.preHandle(request, response, new Object())).isFalse();
        assertThat(response.getStatus()).isEqualTo(503);
        assertThat(response.getContentAsString()).contains("HUMAN_VERIFICATION_UNAVAILABLE");
    }

    @Test
    void CORS_사전_요청은_검증하지_않는다() throws Exception {
        assertThat(interceptor.preHandle(
                request("OPTIONS"),
                new MockHttpServletResponse(),
                new Object()
        )).isTrue();
    }

    private MockHttpServletRequest request(String method) {
        return new MockHttpServletRequest(method, "/api/v1/knowledge/answers");
    }
}
