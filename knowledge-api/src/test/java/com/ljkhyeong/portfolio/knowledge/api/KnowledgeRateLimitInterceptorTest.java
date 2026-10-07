package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import com.ljkhyeong.portfolio.knowledge.api.KnowledgeRateLimiter.RequestKind;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import tools.jackson.databind.json.JsonMapper;

class KnowledgeRateLimitInterceptorTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-08-23T12:00:30Z"), ZoneOffset.UTC);

    @Test
    void 상한_이후에는_신규_클라이언트만_429로_거절한다() throws Exception {
        KnowledgeRateLimitInterceptor interceptor = interceptor(
                RequestKind.SEARCH,
                "ai.global-searches-per-minute", "0",
                "ai.client-searches-per-minute", "2",
                "ai.max-client-buckets-per-minute", "1"
        );

        assertThat(interceptor.preHandle(request("client-b"), new MockHttpServletResponse(), new Object())).isTrue();
        assertThat(interceptor.preHandle(request("client-b"), new MockHttpServletResponse(), new Object())).isTrue();

        MockHttpServletResponse rejected = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(request("client-c"), rejected, new Object())).isFalse();
        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isEqualTo("30");
        assertThat(rejected.getContentAsString()).contains("SEARCH_RATE_LIMITED");
    }

    @Test
    void 등록한_요청_종류의_한도와_오류_코드를_사용한다() throws Exception {
        KnowledgeRateLimitInterceptor interceptor = interceptor(
                RequestKind.ANSWER,
                "ai.client-answers-per-minute", "1",
                "ai.client-searches-per-minute", "5"
        );

        assertThat(interceptor.preHandle(request("client-a"), new MockHttpServletResponse(), new Object())).isTrue();

        MockHttpServletResponse rejected = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(request("client-a"), rejected, new Object())).isFalse();
        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getContentAsString()).contains("ANSWER_RATE_LIMITED");
    }

    @Test
    void X_Forwarded_For_헤더를_직접_해석하지_않는다() throws Exception {
        KnowledgeRateLimitInterceptor interceptor = interceptor(
                RequestKind.SEARCH,
                "ai.client-searches-per-minute", "1"
        );
        MockHttpServletRequest first = request("203.0.113.7");
        first.addHeader("X-Forwarded-For", "1.1.1.1");
        MockHttpServletRequest spoofed = request("203.0.113.7");
        spoofed.addHeader("X-Forwarded-For", "2.2.2.2");

        assertThat(interceptor.preHandle(first, new MockHttpServletResponse(), new Object())).isTrue();
        assertThat(interceptor.preHandle(spoofed, new MockHttpServletResponse(), new Object())).isFalse();
    }

    private KnowledgeRateLimitInterceptor interceptor(RequestKind kind, String... properties) {
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(knowledgeProperties(properties), CLOCK);
        return new KnowledgeRateLimitInterceptor(limiter, kind, new JsonMapper());
    }

    private MockHttpServletRequest request(String remoteAddress) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/knowledge/search");
        request.setRemoteAddr(remoteAddress);
        return request;
    }
}
