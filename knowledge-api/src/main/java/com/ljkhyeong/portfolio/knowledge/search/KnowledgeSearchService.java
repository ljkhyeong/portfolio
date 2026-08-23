package com.ljkhyeong.portfolio.knowledge.search;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
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
    private final RrfRanker rrfRanker;

    public KnowledgeSearchService(
            KnowledgeProperties properties,
            EmbeddingPort embeddingPort,
            KnowledgeIndexPort indexPort,
            RrfRanker rrfRanker
    ) {
        this.properties = properties;
        this.embeddingPort = embeddingPort;
        this.indexPort = indexPort;
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
                normalizeProjectIds(projectIds),
                normalizeDocumentTypes(documentTypes)
        );
        int candidateLimit = Math.max(limit, properties.getSearch().getCandidateLimit());

        indexPort.ensureIndex(embeddingPort.modelId(), embeddingPort.dimensions());
        List<SearchHit> bm25 = indexPort.searchBm25(normalizedQuery, filter, candidateLimit);
        List<List<SearchHit>> rankings = new ArrayList<>();
        rankings.add(bm25);

        if (!embeddingPort.available()) {
            return result(rankings, bm25, limit);
        }

        try {
            List<Float> queryVector = embeddingPort.embed(List.of(normalizedQuery)).getFirst();
            rankings.add(indexPort.searchKnn(queryVector, filter, candidateLimit, candidateLimit * 2));
        } catch (RuntimeException exception) {
            log.warn("임베딩 또는 벡터 검색에 실패해 BM25 결과만 반환합니다: {}", exception.getMessage());
        }

        return result(rankings, bm25, limit);
    }

    private KnowledgeSearchResult result(List<List<SearchHit>> rankings, List<SearchHit> bm25, int limit) {
        List<SearchHit> hits = rrfRanker.merge(rankings, properties.getSearch().getRrfK(), limit);
        Set<String> bm25ChunkIds = bm25.stream()
                .map(hit -> hit.chunk().chunkId())
                .collect(java.util.stream.Collectors.toUnmodifiableSet());
        return new KnowledgeSearchResult(hits, bm25ChunkIds);
    }

    private int normalizeLimit(Integer requestedLimit) {
        int limit = requestedLimit == null ? properties.getSearch().getDefaultLimit() : requestedLimit;
        return Math.min(limit, properties.getSearch().getMaxLimit());
    }

    private List<String> normalizeProjectIds(List<String> projectIds) {
        if (projectIds == null) {
            return List.of();
        }
        return projectIds.stream()
                .map(String::strip)
                .map(value -> value.toLowerCase(Locale.ROOT))
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
    }

    private List<String> normalizeDocumentTypes(List<String> documentTypes) {
        if (documentTypes == null) {
            return List.of();
        }
        List<String> normalized = documentTypes.stream()
                .map(String::strip)
                .map(value -> value.toLowerCase(Locale.ROOT))
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
        List<String> invalid = normalized.stream().filter(value -> !DOCUMENT_TYPES.contains(value)).toList();
        if (!invalid.isEmpty()) {
            throw new IllegalArgumentException("지원하지 않는 문서 종류입니다: " + String.join(", ", invalid));
        }
        return normalized;
    }
}
