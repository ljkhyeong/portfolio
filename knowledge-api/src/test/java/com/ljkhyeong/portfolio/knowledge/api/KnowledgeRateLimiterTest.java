package com.ljkhyeong.portfolio.knowledge.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.junit.jupiter.api.Test;

class KnowledgeRateLimiterTest {

    @Test
    void 답변과_검색의_클라이언트별_한도를_각각_적용한다() {
        KnowledgeProperties properties = properties(10, 1, 10, 2);
        Clock clock = Clock.fixed(Instant.parse("2026-08-23T12:00:30.250Z"), ZoneOffset.UTC);
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(properties, clock);

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "127.0.0.1").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "127.0.0.1").allowed()).isFalse();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.SEARCH, "127.0.0.1").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.SEARCH, "127.0.0.1").allowed()).isTrue();
        var denied = limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.SEARCH, "127.0.0.1");

        assertThat(denied.allowed()).isFalse();
        assertThat(denied.retryAfterSeconds()).isEqualTo(30);
    }

    @Test
    void 전역_한도를_모든_클라이언트가_공유한다() {
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(
                properties(2, 5, 0, 0),
                Clock.fixed(Instant.parse("2026-08-23T12:00:00Z"), ZoneOffset.UTC)
        );

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-b").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-c").allowed()).isFalse();
    }

    @Test
    void 클라이언트_거절은_전역_토큰을_소모하지_않는다() {
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(
                properties(2, 1, 0, 0),
                Clock.fixed(Instant.parse("2026-08-23T12:00:00Z"), ZoneOffset.UTC)
        );

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isFalse();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-b").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-c").allowed()).isFalse();
    }

    @Test
    void 전역과_클라이언트_한도를_개별적으로_비활성화한다() {
        Clock clock = Clock.fixed(Instant.parse("2026-08-23T12:00:00Z"), ZoneOffset.UTC);
        KnowledgeRateLimiter clientOnlyLimiter = new KnowledgeRateLimiter(properties(0, 1, 0, 0), clock);
        KnowledgeRateLimiter globalOnlyLimiter = new KnowledgeRateLimiter(properties(1, 0, 0, 0), clock);

        assertThat(clientOnlyLimiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
        assertThat(clientOnlyLimiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isFalse();
        assertThat(clientOnlyLimiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-b").allowed()).isTrue();
        assertThat(globalOnlyLimiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
        assertThat(globalOnlyLimiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-b").allowed()).isFalse();
    }

    @Test
    void UTC_고정_분_경계에서_전체_용량을_리필한다() {
        MutableClock clock = new MutableClock(Instant.parse("2026-08-23T12:00:59.900Z"));
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(properties(1, 1, 0, 0), clock);

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
        var denied = limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a");
        assertThat(denied.allowed()).isFalse();
        assertThat(denied.retryAfterSeconds()).isEqualTo(1);

        clock.advance(Duration.ofMillis(100));

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
    }

    @Test
    void 클라이언트_버킷_상한을_넘으면_새_클라이언트를_다음_분까지_거절한다() {
        MutableClock clock = new MutableClock(Instant.parse("2026-08-23T12:00:30Z"));
        KnowledgeProperties properties = properties(0, 2, 0, 0);
        properties.getAi().setMaxClientBucketsPerMinute(2);
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(properties, clock);

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-b").allowed()).isTrue();
        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-a").allowed()).isTrue();

        var denied = limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-c");
        assertThat(denied.allowed()).isFalse();
        assertThat(denied.retryAfterSeconds()).isEqualTo(30);

        clock.advance(Duration.ofSeconds(30));

        assertThat(limiter.tryAcquire(KnowledgeRateLimiter.RequestKind.ANSWER, "client-c").allowed()).isTrue();
    }

    private KnowledgeProperties properties(
            int globalAnswers,
            int clientAnswers,
            int globalSearches,
            int clientSearches
    ) {
        KnowledgeProperties properties = new KnowledgeProperties();
        properties.getAi().setGlobalAnswersPerMinute(globalAnswers);
        properties.getAi().setClientAnswersPerMinute(clientAnswers);
        properties.getAi().setGlobalSearchesPerMinute(globalSearches);
        properties.getAi().setClientSearchesPerMinute(clientSearches);
        return properties;
    }

    private static final class MutableClock extends Clock {

        private Instant instant;

        private MutableClock(Instant instant) {
            this.instant = instant;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return instant;
        }

        private void advance(Duration duration) {
            instant = instant.plus(duration);
        }
    }
}
