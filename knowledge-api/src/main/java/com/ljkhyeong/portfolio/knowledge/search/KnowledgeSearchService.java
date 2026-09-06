package com.ljkhyeong.portfolio.knowledge.search;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.time.Duration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch.ElasticsearchAccessException;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.index.KnowledgeIndexInitializer;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeSearchService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeSearchService.class);
    private static final Set<String> DOCUMENT_TYPES = Set.of(
            "project_overview",
            "service_overview",
            "architecture_decision",
            "problem_solution",
            "implementation_evidence",
            "representative_document"
    );

    private final KnowledgeProperties properties;
    private final EmbeddingPort embeddingPort;
    private final KnowledgeIndexPort indexPort;
    private final KnowledgeIndexInitializer indexInitializer;
    private final RrfRanker rrfRanker;
    // 질문 벡터만 재사용하고 문서 검색은 매번 실행해 색인 변경을 바로 반영한다.
    private final Cache<String, List<Float>> queryVectors = Caffeine.newBuilder()
            .maximumSize(256)
            .expireAfterWrite(Duration.ofMinutes(2))
            .build();

    public KnowledgeSearchService(
            KnowledgeProperties properties,
            EmbeddingPort embeddingPort,
            KnowledgeIndexInitializer indexInitializer,
            KnowledgeIndexPort indexPort,
            RrfRanker rrfRanker
    ) {
        this.properties = properties;
        this.embeddingPort = embeddingPort;
        this.indexPort = indexPort;
        this.indexInitializer = indexInitializer;
        this.rrfRanker = rrfRanker;
    }

    public KnowledgeSearchResult search(
            String query,
            List<String> projectIds,
            List<String> documentTypes,
            Integer requestedLimit
    ) {
        String normalizedQuery = query.strip();
        int limit = normalizeLimit(requestedLimit);
        KnowledgeFilter filter = new KnowledgeFilter(
                normalizeFilterValues(projectIds),
                normalizeDocumentTypes(documentTypes)
        );
        int candidateLimit = Math.max(limit, properties.search().candidateLimit());

        indexInitializer.ensureInitialized();
        List<SearchHit> bm25 = indexPort.searchBm25(normalizedQuery, filter, candidateLimit);
        List<List<SearchHit>> rankings = new ArrayList<>();
        rankings.add(bm25);

        if (!embeddingPort.available()) {
            return result(rankings, bm25, limit);
        }

        try {
            List<Float> queryVector = queryVectors.get(normalizedQuery,
                    key -> List.copyOf(embeddingPort.embed(List.of(key)).getFirst()));
            rankings.add(indexPort.searchKnn(queryVector, filter, candidateLimit, candidateLimit * 2));
        } catch (EmbeddingUnavailableException | ElasticsearchAccessException exception) {
            log.warn("임베딩 또는 벡터 검색에 실패해 BM25 결과만 반환합니다.", exception);
        }

        return result(rankings, bm25, limit);
    }

    private KnowledgeSearchResult result(List<List<SearchHit>> rankings, List<SearchHit> bm25, int limit) {
        List<SearchHit> hits = rrfRanker.merge(rankings, properties.search().rrfK(), limit);
        Set<String> bm25ChunkIds = bm25.stream()
                .map(hit -> hit.chunk().chunkId())
                .collect(java.util.stream.Collectors.toUnmodifiableSet());
        return new KnowledgeSearchResult(hits, bm25ChunkIds);
    }

    private int normalizeLimit(Integer requestedLimit) {
        int limit = requestedLimit == null ? properties.search().defaultLimit() : requestedLimit;
        return Math.min(limit, properties.search().maxLimit());
    }

    private List<String> normalizeFilterValues(List<String> values) {
        if (values == null) {
            return List.of();
        }
        return values.stream()
                .map(String::strip)
                .map(value -> value.toLowerCase(Locale.ROOT))
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
    }

    private List<String> normalizeDocumentTypes(List<String> documentTypes) {
        List<String> normalized = normalizeFilterValues(documentTypes);
        List<String> invalid = normalized.stream().filter(value -> !DOCUMENT_TYPES.contains(value)).toList();
        if (!invalid.isEmpty()) {
            throw new IllegalArgumentException("지원하지 않는 문서 종류입니다: " + String.join(", ", invalid));
        }
        return normalized;
    }
}
