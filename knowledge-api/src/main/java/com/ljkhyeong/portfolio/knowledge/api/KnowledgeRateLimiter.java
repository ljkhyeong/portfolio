package com.ljkhyeong.portfolio.knowledge.api;

import java.time.Clock;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeRateLimiter {

    private final Clock clock;
    private final LimitState answerState;
    private final LimitState searchState;

    @Autowired
    public KnowledgeRateLimiter(KnowledgeProperties properties) {
        this(properties, Clock.systemUTC());
    }

    KnowledgeRateLimiter(KnowledgeProperties properties, Clock clock) {
        this.clock = clock;
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
        if (state.globalLimit <= 0 && state.clientLimit <= 0) {
            return new RateLimitDecision(true, 0);
        }

        long currentWindow = clock.instant().getEpochSecond() / 60;
        state.globalCounter = current(state.globalCounter, currentWindow);
        WindowCounter clientCounter = current(state.clientCounters.get(clientId), currentWindow);

        if (state.globalLimit > 0 && state.globalCounter.count() >= state.globalLimit) {
            return denied(currentWindow);
        }
        if (state.clientLimit > 0 && clientCounter.count() >= state.clientLimit) {
            return denied(currentWindow);
        }

        state.globalCounter = new WindowCounter(currentWindow, state.globalCounter.count() + 1);
        state.clientCounters.put(clientId, new WindowCounter(currentWindow, clientCounter.count() + 1));
        if (state.clientCounters.size() > 1_000) {
            removeExpiredClients(state.clientCounters, currentWindow);
        }
        return new RateLimitDecision(true, 0);
    }

    private WindowCounter current(WindowCounter counter, long currentWindow) {
        if (counter == null || counter.window() != currentWindow) {
            return new WindowCounter(currentWindow, 0);
        }
        return counter;
    }

    private RateLimitDecision denied(long currentWindow) {
        long nextWindowEpochSecond = (currentWindow + 1) * 60;
        long retryAfter = Math.max(1, nextWindowEpochSecond - clock.instant().getEpochSecond());
        return new RateLimitDecision(false, retryAfter);
    }

    private void removeExpiredClients(Map<String, WindowCounter> counters, long currentWindow) {
        Iterator<Map.Entry<String, WindowCounter>> iterator = counters.entrySet().iterator();
        while (iterator.hasNext()) {
            if (iterator.next().getValue().window() < currentWindow) {
                iterator.remove();
            }
        }
    }

    public enum RequestKind {
        SEARCH,
        ANSWER
    }

    private static final class LimitState {

        private final int globalLimit;
        private final int clientLimit;
        private final Map<String, WindowCounter> clientCounters = new HashMap<>();
        private WindowCounter globalCounter = new WindowCounter(-1, 0);

        private LimitState(int globalLimit, int clientLimit) {
            this.globalLimit = globalLimit;
            this.clientLimit = clientLimit;
        }
    }

    private record WindowCounter(long window, int count) {
    }

    public record RateLimitDecision(boolean allowed, long retryAfterSeconds) {
    }
}
