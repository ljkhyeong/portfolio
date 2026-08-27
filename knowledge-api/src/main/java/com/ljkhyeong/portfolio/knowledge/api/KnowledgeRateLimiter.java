package com.ljkhyeong.portfolio.knowledge.api;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.EstimationProbe;
import io.github.bucket4j.TimeMeter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeRateLimiter {

    private static final Duration REFILL_PERIOD = Duration.ofMinutes(1);

    private final Clock clock;
    private final TimeMeter timeMeter;
    private final LimitState answerState;
    private final LimitState searchState;

    @Autowired
    public KnowledgeRateLimiter(KnowledgeProperties properties) {
        this(properties, Clock.systemUTC());
    }

    KnowledgeRateLimiter(KnowledgeProperties properties, Clock clock) {
        this.clock = clock;
        this.timeMeter = new ClockTimeMeter(clock);
        this.answerState = new LimitState(
                properties.getAi().getGlobalAnswersPerMinute(),
                properties.getAi().getClientAnswersPerMinute()
        );
        this.searchState = new LimitState(
                properties.getAi().getGlobalSearchesPerMinute(),
                properties.getAi().getClientSearchesPerMinute()
        );
    }

    public synchronized RateLimitDecision tryAcquire(RequestKind kind, String clientId) {
        LimitState state = kind == RequestKind.ANSWER ? answerState : searchState;
        if (state.globalBucket == null && state.clientBuckets == null) {
            return new RateLimitDecision(true, 0);
        }

        long currentWindow = clock.instant().getEpochSecond() / 60;
        if (state.clientBuckets != null && state.clientWindow != currentWindow) {
            state.clientBuckets.clear();
            state.clientWindow = currentWindow;
        }

        if (state.globalBucket != null) {
            EstimationProbe globalProbe = state.globalBucket.estimateAbilityToConsume(1);
            if (!globalProbe.canBeConsumed()) {
                return denied(globalProbe);
            }
        }

        Bucket clientBucket = state.clientBuckets != null
                ? state.clientBuckets.computeIfAbsent(clientId, ignored -> newBucket(state.clientLimit))
                : null;
        if (clientBucket != null) {
            EstimationProbe clientProbe = clientBucket.estimateAbilityToConsume(1);
            if (!clientProbe.canBeConsumed()) {
                return denied(clientProbe);
            }
        }

        consume(state.globalBucket);
        consume(clientBucket);
        return new RateLimitDecision(true, 0);
    }

    private void consume(Bucket bucket) {
        if (bucket != null) {
            bucket.tryConsume(1);
        }
    }

    private RateLimitDecision denied(EstimationProbe probe) {
        long nanosToWait = probe.getNanosToWaitForRefill();
        long retryAfter = TimeUnit.NANOSECONDS.toSeconds(nanosToWait);
        if (nanosToWait % TimeUnit.SECONDS.toNanos(1) != 0) {
            retryAfter++;
        }
        return new RateLimitDecision(false, Math.max(1, retryAfter));
    }

    private Bucket newBucket(int limit) {
        Instant nextMinute = clock.instant().truncatedTo(ChronoUnit.MINUTES).plus(REFILL_PERIOD);
        return Bucket.builder()
                .addLimit(bandwidth -> bandwidth
                        .capacity(limit)
                        .refillIntervallyAligned(limit, REFILL_PERIOD, nextMinute))
                .withCustomTimePrecision(timeMeter)
                .build();
    }

    public enum RequestKind {
        SEARCH,
        ANSWER
    }

    private final class LimitState {

        private final int clientLimit;
        private final Bucket globalBucket;
        private final Map<String, Bucket> clientBuckets;
        private long clientWindow = Long.MIN_VALUE;

        private LimitState(int globalLimit, int clientLimit) {
            this.clientLimit = clientLimit;
            this.globalBucket = globalLimit > 0 ? newBucket(globalLimit) : null;
            this.clientBuckets = clientLimit > 0 ? new HashMap<>() : null;
        }
    }

    private record ClockTimeMeter(Clock clock) implements TimeMeter {

        @Override
        public long currentTimeNanos() {
            Instant now = clock.instant();
            return now.getEpochSecond() * TimeUnit.SECONDS.toNanos(1) + now.getNano();
        }

        @Override
        public boolean isWallClockBased() {
            return true;
        }
    }

    public record RateLimitDecision(boolean allowed, long retryAfterSeconds) {
    }
}
