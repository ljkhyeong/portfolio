package com.ljkhyeong.portfolio.knowledge.port;

import java.util.List;
import java.util.Optional;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;

public interface KnowledgeIndexPort {

    // 검색 대상 색인의 메타데이터. 아직 공개한 색인이 없거나 매핑 형식이 바뀌었으면 비어 있다.
    Optional<IndexMetadata> publishedMetadata();

    // 검색에 노출되지 않는 새 색인을 만들고 이름을 반환한다.
    String createIndex(IndexMetadata metadata);

    void bulkIndex(String index, List<KnowledgeChunk> chunks);

    // 새 색인의 청크 수를 확인한 뒤 검색 대상을 한 번에 바꾸고 이전 색인을 삭제한다.
    void publish(String index, long expectedChunks);

    void deleteIndex(String index);

    List<SearchHit> searchBm25(String query, KnowledgeFilter filter, int limit);

    List<SearchHit> searchKnn(List<Float> queryVector, KnowledgeFilter filter, int limit, int candidates);

    record IndexMetadata(
            String sourceRevision,
            String embeddingModelId,
            int embeddingDimensions,
            String chunkingFingerprint,
            int documentCount
    ) {
    }
}
