package com.ljkhyeong.portfolio.knowledge.api;

import java.time.Clock;
import java.util.HashMap;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeRateLimiter {

    private static final RateLimitDecision ALLOWED = new RateLimitDecision(true, 0);

    private final Clock clock;
    private final MinuteWindow answers;
    private final MinuteWindow searches;

    @Autowired
    public KnowledgeRateLimiter(KnowledgeProperties properties) {
        this(properties, Clock.systemUTC());
    }

    KnowledgeRateLimiter(KnowledgeProperties properties, Clock clock) {
        KnowledgeProperties.RateLimit limits = properties.rateLimit();
        this.clock = clock;
        this.answers = new MinuteWindow(
                limits.globalAnswersPerMinute(),
                limits.clientAnswersPerMinute(),
                limits.maxClientsPerMinute()
        );
        this.searches = new MinuteWindow(
                limits.globalSearchesPerMinute(),
                limits.clientSearchesPerMinute(),
                limits.maxClientsPerMinute()
        );
    }

    // UTC 분 경계마다 전역·클라이언트 횟수를 초기화한다. 거절하면 다음 분까지 남은 초(1~60)를 반환한다.
    public synchronized RateLimitDecision tryAcquire(RequestKind kind, String clientId) {
        long second = clock.instant().getEpochSecond();
        MinuteWindow window = kind == RequestKind.ANSWER ? answers : searches;
        if (window.tryAcquire(Math.floorDiv(second, 60), clientId)) {
            return ALLOWED;
        }
        return new RateLimitDecision(false, 60 - Math.floorMod(second, 60));
    }

    public enum RequestKind {
        SEARCH,
        ANSWER
    }

    public record RateLimitDecision(boolean allowed, long retryAfterSeconds) {
    }

    private static final class MinuteWindow {

        private final int globalLimit;
        private final int clientLimit;
        private final int maxClients;
        private final Map<String, Integer> clientCounts = new HashMap<>();
        private long minute = Long.MIN_VALUE;
        private int globalCount;

        private MinuteWindow(int globalLimit, int clientLimit, int maxClients) {
            this.globalLimit = globalLimit;
            this.clientLimit = clientLimit;
            this.maxClients = maxClients;
        }

        private boolean tryAcquire(long currentMinute, String clientId) {
            if (globalLimit <= 0 && clientLimit <= 0) {
                return true;
            }
            if (currentMinute != minute) {
                minute = currentMinute;
                globalCount = 0;
                clientCounts.clear();
            }
            if (globalLimit > 0 && globalCount >= globalLimit) {
                return false;
            }
            if (clientLimit > 0) {
                Integer used = clientCounts.get(clientId);
                // 새 클라이언트는 분당 클라이언트 수 상한을, 기록된 클라이언트는 클라이언트 한도를 확인한다.
                boolean rejected = used == null
                        ? maxClients > 0 && clientCounts.size() >= maxClients
                        : used >= clientLimit;
                if (rejected) {
                    return false;
                }
                clientCounts.merge(clientId, 1, Integer::sum);
            }
            globalCount++;
            return true;
        }
    }
}
