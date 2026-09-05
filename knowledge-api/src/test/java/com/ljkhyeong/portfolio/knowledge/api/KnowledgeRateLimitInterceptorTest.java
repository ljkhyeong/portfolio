package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import tools.jackson.databind.json.JsonMapper;

class KnowledgeRateLimitInterceptorTest {

    @Test
    void OPTIONS는_버킷을_만들지_않고_상한_이후에는_신규_클라이언트만_429로_거절한다() throws Exception {
        KnowledgeProperties properties = knowledgeProperties(
                "ai.global-searches-per-minute", "0",
                "ai.client-searches-per-minute", "2",
                "ai.max-client-buckets-per-minute", "1"
        );
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(
                properties,
                Clock.fixed(Instant.parse("2026-08-23T12:00:30Z"), ZoneOffset.UTC)
        );
        KnowledgeRateLimitInterceptor interceptor = new KnowledgeRateLimitInterceptor(
                limiter,
                properties,
                new JsonMapper()
        );

        assertThat(interceptor.preHandle(
                request("OPTIONS", "client-a"),
                new MockHttpServletResponse(),
                new Object()
        )).isTrue();
        assertThat(interceptor.preHandle(
                request("POST", "client-b"),
                new MockHttpServletResponse(),
                new Object()
        )).isTrue();
        assertThat(interceptor.preHandle(
                request("POST", "client-b"),
                new MockHttpServletResponse(),
                new Object()
        )).isTrue();

        MockHttpServletResponse rejected = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(request("POST", "client-c"), rejected, new Object())).isFalse();
        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isEqualTo("30");
    }

    private MockHttpServletRequest request(String method, String remoteAddress) {
        MockHttpServletRequest request = new MockHttpServletRequest(
                method,
                "/api/v1/knowledge/search"
        );
        request.setRemoteAddr(remoteAddress);
        return request;
    }
}
