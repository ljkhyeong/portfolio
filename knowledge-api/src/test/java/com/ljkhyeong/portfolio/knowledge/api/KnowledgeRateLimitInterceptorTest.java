package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimiter.RequestKind;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class KnowledgeRateLimitInterceptorTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-08-23T12:00:30Z"), ZoneOffset.UTC);

    @Test
    void 상한_이후에는_신규_클라이언트만_429로_거절한다() {
        KnowledgeRateLimitInterceptor interceptor = interceptor(
                RequestKind.SEARCH,
                "rate-limit.global-searches-per-minute", "0",
                "rate-limit.client-searches-per-minute", "2",
                "rate-limit.max-clients-per-minute", "1"
        );

        assertThat(preHandle(interceptor, "client-b")).isTrue();
        assertThat(preHandle(interceptor, "client-b")).isTrue();

        assertRateLimited(interceptor, "client-c", "SEARCH_RATE_LIMITED");
    }

    @Test
    void 등록한_요청_종류의_한도와_오류_코드를_사용한다() {
        KnowledgeRateLimitInterceptor interceptor = interceptor(
                RequestKind.ANSWER,
                "rate-limit.client-answers-per-minute", "1",
                "rate-limit.client-searches-per-minute", "5"
        );

        assertThat(preHandle(interceptor, "client-a")).isTrue();

        assertRateLimited(interceptor, "client-a", "ANSWER_RATE_LIMITED");
    }

    @Test
    void X_Forwarded_For_헤더를_직접_해석하지_않는다() {
        KnowledgeRateLimitInterceptor interceptor = interceptor(
                RequestKind.SEARCH,
                "rate-limit.client-searches-per-minute", "1"
        );
        MockHttpServletRequest first = request("203.0.113.7");
        first.addHeader("X-Forwarded-For", "1.1.1.1");
        MockHttpServletRequest spoofed = request("203.0.113.7");
        spoofed.addHeader("X-Forwarded-For", "2.2.2.2");

        assertThat(interceptor.preHandle(first, new MockHttpServletResponse(), new Object())).isTrue();
        assertThatThrownBy(() -> interceptor.preHandle(spoofed, new MockHttpServletResponse(), new Object()))
                .isInstanceOf(KnowledgeApiException.class);
    }

    private void assertRateLimited(KnowledgeRateLimitInterceptor interceptor, String clientAddress, String code) {
        assertThatThrownBy(() -> preHandle(interceptor, clientAddress))
                .isInstanceOfSatisfying(KnowledgeApiException.class, exception -> {
                    assertThat(exception.getStatusCode().value()).isEqualTo(429);
                    assertThat(exception.getHeaders().getFirst(HttpHeaders.RETRY_AFTER)).isEqualTo("30");
                    assertThat(exception.getBody().getProperties()).containsEntry("code", code);
                });
    }

    private boolean preHandle(KnowledgeRateLimitInterceptor interceptor, String clientAddress) {
        return interceptor.preHandle(request(clientAddress), new MockHttpServletResponse(), new Object());
    }

    private KnowledgeRateLimitInterceptor interceptor(RequestKind kind, String... properties) {
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(knowledgeProperties(properties), CLOCK);
        return new KnowledgeRateLimitInterceptor(limiter, kind);
    }

    private MockHttpServletRequest request(String remoteAddress) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/knowledge/search");
        request.setRemoteAddr(remoteAddress);
        return request;
    }
}
