package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;
import java.util.Set;

public record KnowledgeSearchResult(
        List<SearchHit> hits,
        Set<String> bm25ChunkIds
) {

    public KnowledgeSearchResult {
        hits = List.copyOf(hits);
        bm25ChunkIds = Set.copyOf(bm25ChunkIds);
    }

    public boolean hasBm25Evidence() {
        return hits.stream().anyMatch(hit -> bm25ChunkIds.contains(hit.chunk().chunkId()));
    }
}
