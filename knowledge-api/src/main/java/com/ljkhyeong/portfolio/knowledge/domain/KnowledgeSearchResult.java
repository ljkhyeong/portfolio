package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;
import java.util.Set;

public record KnowledgeSearchResult(
        List<SearchHit> hits,
        List<SearchHit> candidates,
        Set<String> bm25ChunkIds
) {

    public KnowledgeSearchResult {
        hits = List.copyOf(hits);
        candidates = List.copyOf(candidates);
        bm25ChunkIds = Set.copyOf(bm25ChunkIds);
    }

    public boolean hasBm25Evidence(List<SearchHit> evidence) {
        return evidence.stream().anyMatch(hit -> bm25ChunkIds.contains(hit.chunk().chunkId()));
    }
}
