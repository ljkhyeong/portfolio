package com.ljkhyeong.portfolio.knowledge.sync;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import com.ljkhyeong.portfolio.knowledge.index.KnowledgeIndexInitializer;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeSyncService {

    private static final int EMBEDDING_BATCH_SIZE = 32;

    private final KnowledgeProperties properties;
    private final KnowledgeManifestLoader manifestLoader;
    private final KnowledgeChunker chunker;
    private final EmbeddingPort embeddingPort;
    private final KnowledgeIndexPort indexPort;
    private final KnowledgeIndexInitializer indexInitializer;

    public KnowledgeSyncService(
            KnowledgeProperties properties,
            KnowledgeManifestLoader manifestLoader,
            KnowledgeChunker chunker,
            EmbeddingPort embeddingPort,
            KnowledgeIndexInitializer indexInitializer,
            KnowledgeIndexPort indexPort
    ) {
        this.properties = properties;
        this.manifestLoader = manifestLoader;
        this.chunker = chunker;
        this.embeddingPort = embeddingPort;
        this.indexPort = indexPort;
        this.indexInitializer = indexInitializer;
    }

    public SyncResult syncConfiguredManifest() {
        KnowledgeManifest manifest = manifestLoader.load(properties.source().location());
        if (manifest.documents().isEmpty() && !properties.source().allowEmpty()) {
            throw new IllegalArgumentException("빈 공개 지식 문서 목록은 동기화할 수 없습니다.");
        }
        indexInitializer.refresh();
        Map<String, String> currentHashes = indexPort.findIndexedSourceHashes();

        Set<String> desiredDocumentIds = new HashSet<>();
        int unchangedDocuments = 0;
        int indexedDocuments = 0;
        int indexedChunks = 0;

        for (KnowledgeSourceDocument document : manifest.documents()) {
            desiredDocumentIds.add(document.documentId());
            if (document.sourceHash().equals(currentHashes.get(document.documentId()))) {
                unchangedDocuments++;
                continue;
            }

            List<KnowledgeChunk> chunks = addEmbeddings(chunker.split(document));
            indexPort.bulkIndex(chunks);
            indexPort.deleteStaleChunks(
                    document.documentId(),
                    chunks.stream().map(KnowledgeChunk::chunkId).toList()
            );
            indexedDocuments++;
            indexedChunks += chunks.size();
        }

        int deletedDocuments = 0;
        for (String indexedDocumentId : currentHashes.keySet()) {
            if (!desiredDocumentIds.contains(indexedDocumentId)) {
                indexPort.deleteByDocumentId(indexedDocumentId);
                deletedDocuments++;
            }
        }

        return new SyncResult(
                manifest.sourceRevision(),
                manifest.documents().size(),
                indexedDocuments,
                unchangedDocuments,
                deletedDocuments,
                indexedChunks,
                embeddingPort.modelId()
        );
    }

    private List<KnowledgeChunk> addEmbeddings(List<KnowledgeChunk> chunks) {
        if (!embeddingPort.available()) {
            return chunks;
        }
        List<KnowledgeChunk> embedded = new ArrayList<>(chunks.size());
        for (int offset = 0; offset < chunks.size(); offset += EMBEDDING_BATCH_SIZE) {
            List<KnowledgeChunk> batch = chunks.subList(offset, Math.min(offset + EMBEDDING_BATCH_SIZE, chunks.size()));
            List<List<Float>> vectors = embeddingPort.embed(batch.stream().map(KnowledgeChunk::content).toList());
            if (vectors.size() != batch.size()) {
                throw new IllegalStateException("임베딩 결과 수가 요청한 청크 수와 다릅니다.");
            }
            for (int index = 0; index < batch.size(); index++) {
                List<Float> vector = vectors.get(index);
                if (vector.size() != embeddingPort.dimensions()) {
                    throw new IllegalStateException("임베딩 벡터 차원이 설정과 다릅니다.");
                }
                embedded.add(batch.get(index).withEmbedding(embeddingPort.modelId(), vector));
            }
        }
        return List.copyOf(embedded);
    }

    public record SyncResult(
            String sourceRevision,
            int totalDocuments,
            int indexedDocuments,
            int unchangedDocuments,
            int deletedDocuments,
            int indexedChunks,
            String embeddingModelId
    ) {
    }
}
