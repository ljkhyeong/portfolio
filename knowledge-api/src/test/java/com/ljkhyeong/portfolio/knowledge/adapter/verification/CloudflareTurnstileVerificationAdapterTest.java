package com.ljkhyeong.portfolio.knowledge.adapter.verification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Stream;

import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.http.client.MockClientHttpRequest;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.client.ResponseCreator;
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
        server.expect(ExpectedCount.twice(), requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andRespond(withServerError());

        assertThatThrownBy(() -> adapter.verify("browser-token"))
                .isInstanceOf(HumanVerificationUnavailableException.class)
                .hasMessage("Turnstile 검증 요청에 실패했습니다.");
        server.verify();
    }

    @ParameterizedTest
    @MethodSource("transientResponses")
    void 일시_오류는_같은_토큰과_멱등키로_한_번_재시도한다(ResponseCreator firstResponse) {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        var bodies = new ArrayList<String>();
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andExpect(request -> bodies.add(((MockClientHttpRequest) request).getBodyAsString()))
                .andRespond(firstResponse);
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andExpect(request -> bodies.add(((MockClientHttpRequest) request).getBodyAsString()))
                .andRespond(withSuccess("""
                        {"success":true,"hostname":"ljkportfolio.netlify.app","action":"knowledge_answer"}
                        """, MediaType.APPLICATION_JSON));

        assertThat(adapter.verify("browser-token").successful()).isTrue();

        assertThat(bodies).hasSize(2);
        assertThat(bodies.getFirst()).isEqualTo(bodies.getLast())
                .contains("secret=server-secret", "response=browser-token");
        assertThat(UUID.fromString(bodies.getFirst().split("idempotency_key=")[1])).isNotNull();
        server.verify();
    }

    @ParameterizedTest
    @MethodSource("transientResponses")
    void 재시도에도_일시_오류가_나면_검증_불가로_종료한다(ResponseCreator response) {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        server.expect(ExpectedCount.twice(), requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andRespond(response);

        assertThatThrownBy(() -> adapter.verify("browser-token"))
                .isInstanceOf(HumanVerificationUnavailableException.class);
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"missing-input-response", "invalid-input-response", "timeout-or-duplicate"})
    void 토큰_오류는_재시도하지_않고_인증_실패로_반환한다(String error) {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andRespond(withSuccess("""
                        {"success":false,"error-codes":["%s"]}
                        """.formatted(error), MediaType.APPLICATION_JSON));

        assertThat(adapter.verify("browser-token").successful()).isFalse();
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{\"success\":false,\"error-codes\":[\"invalid-input-secret\"]}",
            "{\"success\":false,\"error-codes\":[\"missing-input-secret\"]}",
            "{\"success\":false,\"error-codes\":[\"bad-request\"]}",
            "{\"success\":false,\"error-codes\":[\"unknown-error\"]}",
            "{\"success\":false,\"error-codes\":[\"invalid-input-response\",\"internal-error\"]}",
            "{\"success\":false,\"error-codes\":[null]}",
            "{\"success\":false,\"error-codes\":[]}",
            "{\"success\":false}", "{}", "null", "invalid-json"
    })
    void 설정_오류와_잘못된_응답은_재시도하지_않고_검증_불가로_종료한다(String response) {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andRespond(withSuccess(response, MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> adapter.verify("browser-token"))
                .isInstanceOf(HumanVerificationUnavailableException.class);
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(ints = {400, 401, 429})
    void HTTP_클라이언트_오류와_호출_제한은_즉시_재시도하지_않는다(int status) {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://challenges.cloudflare.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var adapter = new CloudflareTurnstileVerificationAdapter(builder.build(), "server-secret");
        server.expect(requestTo("https://challenges.cloudflare.com/turnstile/v0/siteverify"))
                .andRespond(withStatus(HttpStatus.valueOf(status)));

        assertThatThrownBy(() -> adapter.verify("browser-token"))
                .isInstanceOf(HumanVerificationUnavailableException.class);
        server.verify();
    }

    private static Stream<ResponseCreator> transientResponses() {
        return Stream.of(
                withServerError(),
                withException(new SocketTimeoutException("검증 서버 응답 지연")),
                withSuccess("{\"success\":false,\"error-codes\":[\"internal-error\"]}", MediaType.APPLICATION_JSON)
        );
    }
}
