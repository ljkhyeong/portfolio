package com.ljkhyeong.portfolio.knowledge.adapter.verification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class CloudflareTurnstileVerificationAdapterTest {

    @Test
    void 비밀키와_브라우저_토큰을_Siteverify에_전송한다() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(content().string(containsString("secret=server-secret")))
                .andExpect(content().string(containsString("response=browser-token")))
                .andExpect(content().string(containsString("idempotency_key=")))
                .andRespond(withSuccess(
                        """
                        {
                          "success": true,
                          "hostname": "ljkportfolio.netlify.app",
                          "action": "knowledge_answer"
                        }
                        """,
                        MediaType.APPLICATION_JSON
                ));

        var result = adapter.verify("browser-token");

        assertThat(result.successful()).isTrue();
        assertThat(result.hostname()).isEqualTo("ljkportfolio.netlify.app");
        assertThat(result.action()).isEqualTo("knowledge_answer");
        server.verify();
    }

    @Test
    void Siteverify_장애는_검증_불가로_변환한다() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andRespond(withServerError());

        assertThatThrownBy(() -> adapter.verify("browser-token"))
                .isInstanceOf(HumanVerificationUnavailableException.class)
                .hasMessage("Turnstile 검증 요청에 실패했습니다.");
    }
}
