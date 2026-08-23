package com.ljkhyeong.portfolio.knowledge.sync;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.document;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class KnowledgeSyncServiceTest {

    private final KnowledgeProperties properties = new KnowledgeProperties();
    private final KnowledgeManifestLoader loader = mock(KnowledgeManifestLoader.class);
    private final KnowledgeChunker chunker = mock(KnowledgeChunker.class);
    private final EmbeddingPort embeddingPort = mock(EmbeddingPort.class);
    private final KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
    private final KnowledgeSyncService service = new KnowledgeSyncService(
            properties,
            loader,
            chunker,
            embeddingPort,
            indexPort
    );

    @BeforeEach
    void setUp() {
        when(embeddingPort.modelId()).thenReturn("test-model");
        when(embeddingPort.dimensions()).thenReturn(2);
        when(embeddingPort.available()).thenReturn(true);
    }

    @Test
    void sourceHash가_같으면_다시_임베딩하지_않는다() {
        var document = document("doc-1", "sha256:same");
        when(loader.load(properties.getSource().getLocation())).thenReturn(manifest(document));
        when(indexPort.findIndexedSourceHashes()).thenReturn(Map.of("doc-1", "sha256:source"));

        KnowledgeSyncService.SyncResult result = service.syncConfiguredManifest();

        assertThat(result.unchangedDocuments()).isEqualTo(1);
        assertThat(result.indexedDocuments()).isZero();
        verify(embeddingPort, never()).embed(anyList());
        verify(indexPort, never()).bulkIndex(anyList());
    }

    @Test
    void 본문이_같아도_제목이나_링크를_포함한_sourceHash가_바뀌면_다시_색인한다() {
        var document = document("doc-1", "sha256:same-content");
        var chunk = chunk("doc-1#000");
        when(loader.load(properties.getSource().getLocation())).thenReturn(manifest(document));
        when(indexPort.findIndexedSourceHashes()).thenReturn(Map.of("doc-1", "sha256:old-source"));
        when(chunker.split(document)).thenReturn(List.of(chunk));
        when(embeddingPort.embed(List.of(chunk.content()))).thenReturn(List.of(List.of(1.0f, 0.0f)));

        KnowledgeSyncService.SyncResult result = service.syncConfiguredManifest();

        assertThat(result.indexedDocuments()).isEqualTo(1);
        verify(indexPort).bulkIndex(anyList());
    }

    @Test
    void 변경된_문서는_새_청크를_색인하고_목록에서_빠진_문서는_삭제한다() {
        var document = document("doc-1", "sha256:new");
        var chunk = chunk("doc-1#000");
        when(loader.load(properties.getSource().getLocation())).thenReturn(manifest(document));
        when(indexPort.findIndexedSourceHashes()).thenReturn(Map.of(
                "doc-1", "sha256:old-source",
                "deleted-doc", "sha256:deleted"
        ));
        when(chunker.split(document)).thenReturn(List.of(chunk));
        when(embeddingPort.embed(List.of(chunk.content()))).thenReturn(List.of(List.of(1.0f, 0.0f)));

        KnowledgeSyncService.SyncResult result = service.syncConfiguredManifest();

        assertThat(result.indexedDocuments()).isEqualTo(1);
        assertThat(result.deletedDocuments()).isEqualTo(1);
        var order = inOrder(indexPort);
        order.verify(indexPort).bulkIndex(anyList());
        order.verify(indexPort).deleteStaleChunks("doc-1", List.of("doc-1#000"));
        verify(indexPort).deleteByDocumentId("deleted-doc");
    }

    @Test
    void 임베딩을_사용하지_않을_때도_BM25용_청크를_색인한다() {
        var document = document("doc-1", "sha256:new");
        var chunk = chunk("doc-1#000");
        when(embeddingPort.available()).thenReturn(false);
        when(embeddingPort.modelId()).thenReturn("disabled");
        when(loader.load(properties.getSource().getLocation())).thenReturn(manifest(document));
        when(indexPort.findIndexedSourceHashes()).thenReturn(Map.of());
        when(chunker.split(document)).thenReturn(List.of(chunk));

        KnowledgeSyncService.SyncResult result = service.syncConfiguredManifest();

        assertThat(result.indexedDocuments()).isEqualTo(1);
        verify(embeddingPort, never()).embed(anyList());
        verify(indexPort).bulkIndex(List.of(chunk));
    }

    @Test
    void 빈_문서_목록은_기존_색인을_삭제하지_않도록_거부한다() {
        when(loader.load(properties.getSource().getLocation())).thenReturn(new KnowledgeManifest(
                "1.0",
                "sha256:empty",
                List.of(),
                List.of(),
                List.of()
        ));

        assertThat(org.assertj.core.api.Assertions.catchThrowable(service::syncConfiguredManifest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("빈 공개 지식 문서 목록");
        verify(indexPort, never()).findIndexedSourceHashes();
        verify(indexPort, never()).deleteByDocumentId(org.mockito.ArgumentMatchers.anyString());
    }

    private KnowledgeManifest manifest(com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument document) {
        return new KnowledgeManifest(
                "1.0",
                "sha256:revision",
                List.of("problem_solution"),
                List.of("baton"),
                List.of(document)
        );
    }
}
