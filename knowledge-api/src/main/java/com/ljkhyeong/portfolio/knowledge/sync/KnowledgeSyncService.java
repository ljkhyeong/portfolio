package com.ljkhyeong.portfolio.knowledge.sync;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort.IndexMetadata;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeSyncService {

    private static final int EMBEDDING_BATCH_SIZE = 32;

    private final KnowledgeProperties properties;
    private final KnowledgeManifestLoader manifestLoader;
    private final KnowledgeChunker chunker;
    private final EmbeddingPort embeddingPort;
    private final KnowledgeIndexPort indexPort;
    private final AtomicBoolean syncInProgress = new AtomicBoolean();

    public KnowledgeSyncService(
            KnowledgeProperties properties,
            KnowledgeManifestLoader manifestLoader,
            KnowledgeChunker chunker,
            EmbeddingPort embeddingPort,
            KnowledgeIndexPort indexPort
    ) {
        this.properties = properties;
        this.manifestLoader = manifestLoader;
        this.chunker = chunker;
        this.embeddingPort = embeddingPort;
        this.indexPort = indexPort;
    }

    public SyncResult syncConfiguredManifest() {
        if (!syncInProgress.compareAndSet(false, true)) {
            throw new KnowledgeSyncInProgressException();
        }
        try {
            return syncManifest();
        } finally {
            syncInProgress.set(false);
        }
    }

    private SyncResult syncManifest() {
        KnowledgeManifest manifest = manifestLoader.load(properties.source().location());
        if (manifest.documents().isEmpty()) {
            throw new IllegalArgumentException("빈 공개 지식 문서 목록은 동기화할 수 없습니다.");
        }
        IndexMetadata wanted = wantedMetadata(manifest);
        if (indexPort.publishedMetadata().filter(wanted::equals).isPresent()) {
            return new SyncResult(manifest.sourceRevision(), wanted.documentCount(), 0, wanted.embeddingModelId(), false);
        }

        // 새 색인을 모두 채운 뒤에만 검색 대상을 바꾸고, 실패하면 기존 색인을 그대로 둔다.
        List<KnowledgeChunk> chunks = manifest.documents().stream()
                .flatMap(document -> chunker.split(document).stream())
                .toList();
        String index = indexPort.createIndex(wanted);
        try {
            for (int offset = 0; offset < chunks.size(); offset += EMBEDDING_BATCH_SIZE) {
                indexPort.bulkIndex(index, addEmbeddings(
                        chunks.subList(offset, Math.min(offset + EMBEDDING_BATCH_SIZE, chunks.size()))));
            }
            indexPort.publish(index, chunks.size());
        } catch (RuntimeException exception) {
            try {
                indexPort.deleteUnpublishedIndex(index);
            } catch (RuntimeException cleanupFailure) {
                exception.addSuppressed(cleanupFailure);
            }
            throw exception;
        }
        return new SyncResult(manifest.sourceRevision(), wanted.documentCount(), chunks.size(),
                wanted.embeddingModelId(), true);
    }

    public IndexStatus status() {
        KnowledgeManifest manifest = manifestLoader.load(properties.source().location());
        Optional<IndexMetadata> published = indexPort.publishedMetadata();
        int expected = manifest.documents().size();
        boolean upToDate = !syncInProgress.get() && expected > 0
                && published.filter(wantedMetadata(manifest)::equals).isPresent();
        return new IndexStatus(manifest.sourceRevision(), expected,
                published.map(IndexMetadata::documentCount).orElse(0), upToDate ? expected : 0, upToDate);
    }

    private IndexMetadata wantedMetadata(KnowledgeManifest manifest) {
        return new IndexMetadata(
                manifest.sourceRevision(),
                embeddingPort.modelId(),
                embeddingPort.dimensions(),
                properties.source().chunkingFingerprint(),
                manifest.documents().size()
        );
    }

    private List<KnowledgeChunk> addEmbeddings(List<KnowledgeChunk> batch) {
        if (!embeddingPort.available()) {
            return batch;
        }
        List<List<Float>> vectors = embeddingPort.embed(batch.stream().map(KnowledgeChunk::content).toList());
        List<KnowledgeChunk> embedded = new ArrayList<>(batch.size());
        for (int index = 0; index < batch.size(); index++) {
            embedded.add(batch.get(index).withEmbedding(embeddingPort.modelId(), vectors.get(index)));
        }
        return List.copyOf(embedded);
    }

    public record IndexStatus(String sourceRevision, int expectedDocuments, int indexedDocuments,
                              int matchedDocuments, boolean upToDate) {
    }

    // chunks는 이번 동기화에서 색인한 청크 수다. 색인이 이미 최신이면 0이다.
    public record SyncResult(
            String sourceRevision,
            int documents,
            int chunks,
            String embeddingModelId,
            boolean rebuilt
    ) {
    }
}
