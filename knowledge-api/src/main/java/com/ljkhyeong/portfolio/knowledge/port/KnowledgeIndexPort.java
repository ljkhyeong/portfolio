package com.ljkhyeong.portfolio.knowledge.port;

import java.util.List;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;

public interface KnowledgeIndexPort {

    void ensureIndex(String embeddingModelId, int dimensions, String chunkingFingerprint);

    Map<String, String> findIndexedSourceHashes();

    void deleteByDocumentId(String documentId);

    void deleteStaleChunks(String documentId, List<String> retainedChunkIds);

    void bulkIndex(List<KnowledgeChunk> chunks);

    List<SearchHit> searchBm25(String query, KnowledgeFilter filter, int limit);

    List<SearchHit> searchKnn(List<Float> queryVector, KnowledgeFilter filter, int limit, int candidates);
}
