package com.ljkhyeong.portfolio.knowledge.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.junit.jupiter.api.Test;

class KnowledgeRateLimiterTest {

    @Test
    void 답변과_검색의_클라이언트별_한도를_각각_적용한다() {
        KnowledgeProperties properties = new KnowledgeProperties();
        properties.getAi().setGlobalAnswersPerMinute(10);
        properties.getAi().setClientAnswersPerMinute(1);
        properties.getAi().setGlobalSearchesPerMinute(10);
        properties.getAi().setClientSearchesPerMinute(2);
        Clock clock = Clock.fixed(Instant.parse("2026-08-23T12:00:30Z"), ZoneOffset.UTC);
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(properties, clock);

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "127.0.0.1").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "127.0.0.1").allowed()).isFalse();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.SEARCH, "127.0.0.1").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.SEARCH, "127.0.0.1").allowed()).isTrue();
        var denied = limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.SEARCH, "127.0.0.1");

        assertThat(denied.allowed()).isFalse();
        assertThat(denied.retryAfterSeconds()).isEqualTo(30);
    }
}
