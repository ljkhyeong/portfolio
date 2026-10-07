package com.ljkhyeong.portfolio.knowledge.search;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.cache.CaffeineCacheMetrics;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeSearchService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeSearchService.class);

    private final KnowledgeProperties properties;
    private final EmbeddingPort embeddingPort;
    private final KnowledgeIndexPort indexPort;
    private final RrfRanker rrfRanker;
    private final MeterRegistry meters;
    private final Cache<String, List<Float>> queryVectors;

    public KnowledgeSearchService(
            KnowledgeProperties properties,
            EmbeddingPort embeddingPort,
            KnowledgeIndexPort indexPort,
            RrfRanker rrfRanker,
            MeterRegistry meters
    ) {
        this.properties = properties;
        this.embeddingPort = embeddingPort;
        this.indexPort = indexPort;
        this.rrfRanker = rrfRanker;
        this.meters = meters;
        // 질문 벡터만 재사용하고 문서 검색은 매번 실행해 색인 변경을 바로 반영한다.
        this.queryVectors = CaffeineCacheMetrics.monitor(meters, Caffeine.newBuilder()
                .maximumSize(256)
                .expireAfterWrite(Duration.ofMinutes(2))
                .recordStats()
                .build(), "query_embedding");
    }

    public KnowledgeSearchResult search(String query, KnowledgeFilter filter, Integer requestedLimit) {
        String normalizedQuery = query.strip();
        int limit = requestedLimit == null ? properties.search().defaultLimit() : requestedLimit;
        int candidateLimit = Math.max(limit, properties.search().candidateLimit());

        List<SearchHit> bm25 = indexPort.searchBm25(normalizedQuery, filter, candidateLimit);
        List<List<SearchHit>> rankings = new ArrayList<>();
        rankings.add(bm25);

        if (!embeddingPort.available()) {
            meters.counter("knowledge.searches", "mode", "keyword").increment();
            return result(rankings, bm25, limit);
        }

        String mode = "hybrid";
        try {
            List<Float> queryVector = queryVectors.get(normalizedQuery,
                    key -> List.copyOf(embeddingPort.embed(List.of(key)).getFirst()));
            rankings.add(indexPort.searchKnn(queryVector, filter, candidateLimit, candidateLimit * 2));
        } catch (EmbeddingUnavailableException | KnowledgeIndexAccessException exception) {
            mode = "fallback";
            log.warn("임베딩 또는 벡터 검색에 실패해 BM25 결과만 반환합니다.", exception);
        }

        meters.counter("knowledge.searches", "mode", mode).increment();
        return result(rankings, bm25, limit);
    }

    private KnowledgeSearchResult result(List<List<SearchHit>> rankings, List<SearchHit> bm25, int limit) {
        List<SearchHit> candidates = rrfRanker.merge(rankings, properties.search().rrfK());
        Map<String, SearchHit> documents = new LinkedHashMap<>();
        candidates.forEach(hit -> documents.putIfAbsent(hit.chunk().documentId(), hit));
        List<SearchHit> hits = documents.values().stream().limit(limit).toList();
        Set<String> bm25ChunkIds = bm25.stream()
                .map(hit -> hit.chunk().chunkId())
                .collect(Collectors.toUnmodifiableSet());
        return new KnowledgeSearchResult(hits, candidates, bm25ChunkIds);
    }
}
