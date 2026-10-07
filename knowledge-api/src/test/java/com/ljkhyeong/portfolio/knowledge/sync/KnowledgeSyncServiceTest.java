package com.ljkhyeong.portfolio.knowledge.sync;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.document;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

import com.ljkhyeong.portfolio.knowledge.adapter.ai.SpringAiEmbeddingAdapter;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort.IndexMetadata;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import tools.jackson.databind.json.JsonMapper;

class KnowledgeSyncServiceTest {

    private static final String NEW_INDEX = "portfolio-knowledge-20261007000000000";

    private final KnowledgeProperties properties = knowledgeProperties();
    private final KnowledgeManifestLoader loader = mock(KnowledgeManifestLoader.class);
    private final KnowledgeChunker chunker = mock(KnowledgeChunker.class);
    private final EmbeddingPort embeddingPort = mock(EmbeddingPort.class);
    private final KnowledgeIndexPort indexPort = mock(KnowledgeIndexPort.class);
    private final KnowledgeSyncService service =
            new KnowledgeSyncService(properties, loader, chunker, embeddingPort, indexPort);
    private final IndexMetadata current = new IndexMetadata(
            "sha256:revision", "test-model", 2, properties.source().chunkingFingerprint(), 1);

    @BeforeEach
    void setUp() {
        when(embeddingPort.modelId()).thenReturn("test-model");
        when(embeddingPort.dimensions()).thenReturn(2);
        when(embeddingPort.available()).thenReturn(true);
        when(indexPort.createIndex(any())).thenReturn(NEW_INDEX);
    }

    @Test
    void 자료를_읽지_못하면_색인과_임베딩을_변경하지_않는다() {
        when(loader.load(properties.source().location()))
                .thenThrow(new IllegalArgumentException("공개 자료 읽기 실패"))
                .thenReturn(manifest(document("doc-1")));

        assertThatThrownBy(service::syncConfiguredManifest).isInstanceOf(IllegalArgumentException.class);
        verifyNoInteractions(indexPort, embeddingPort, chunker);

        when(indexPort.publishedMetadata()).thenReturn(Optional.of(current));
        assertThat(service.syncConfiguredManifest().rebuilt()).isFalse();
    }

    @ParameterizedTest
    @ValueSource(strings = {"missing", "null", "visibility"})
    void 형식이_잘못된_자료는_색인을_조회하거나_바꾸기_전에_중단한다(String failure) {
        String documentsField = switch (failure) {
            case "missing" -> "";
            case "null" -> ",\"documents\":null";
            default -> ",\"documents\":[" + new JsonMapper().writeValueAsString(document("doc-1"))
                    + ",{\"documentId\":\"doc-2\"}]";
        };
        byte[] json = ("{\"schemaVersion\":\"1.0\",\"sourceRevision\":\"sha256:revision\"" + documentsField + "}")
                .getBytes(StandardCharsets.UTF_8);
        var resources = mock(ResourceLoader.class);
        when(resources.getResource(properties.source().location())).thenReturn(new ByteArrayResource(json));
        try (var validator = new LocalValidatorFactoryBean()) {
            validator.afterPropertiesSet();
            var sync = new KnowledgeSyncService(properties,
                    new KnowledgeManifestLoader(resources, new JsonMapper(), validator, properties),
                    chunker, embeddingPort, indexPort);

            assertThatThrownBy(sync::syncConfiguredManifest).isInstanceOf(IllegalArgumentException.class);
        }
        verifyNoInteractions(indexPort, embeddingPort, chunker);
    }

    @Test
    void 동기화_중복_요청은_자료를_읽기_전에_거부하고_완료_후에는_다시_허용한다() throws Exception {
        var manifest = manifest(document("doc-1"));
        CountDownLatch started = new CountDownLatch(1);
        CountDownLatch release = new CountDownLatch(1);
        AtomicInteger loads = new AtomicInteger();
        when(loader.load(properties.source().location())).thenAnswer(invocation -> {
            if (loads.incrementAndGet() == 1) {
                started.countDown();
                if (!release.await(5, TimeUnit.SECONDS)) throw new IllegalStateException("테스트 대기 시간 초과");
            }
            return manifest;
        });
        when(indexPort.publishedMetadata()).thenReturn(Optional.of(current));

        try (var executor = Executors.newSingleThreadExecutor()) {
            var running = executor.submit(service::syncConfiguredManifest);
            try {
                assertThat(started.await(5, TimeUnit.SECONDS)).isTrue();
                assertThatThrownBy(service::syncConfiguredManifest)
                        .isInstanceOf(KnowledgeSyncInProgressException.class)
                        .hasMessageContaining("동기화가 이미 실행 중");
                assertThat(loads.get()).isEqualTo(1);
                verifyNoInteractions(indexPort, embeddingPort, chunker);
            } finally {
                release.countDown();
            }
            assertThat(running.get(5, TimeUnit.SECONDS).rebuilt()).isFalse();
        }
        assertThat(service.syncConfiguredManifest().rebuilt()).isFalse();
        assertThat(service.status().upToDate()).isTrue();
    }

    @Test
    void 동기화_중에는_색인이_같아도_최신_상태로_표시하지_않는다() throws Exception {
        when(loader.load(properties.source().location())).thenReturn(manifest(document("doc-1")));
        CountDownLatch started = new CountDownLatch(1);
        CountDownLatch release = new CountDownLatch(1);
        AtomicInteger reads = new AtomicInteger();
        when(indexPort.publishedMetadata()).thenAnswer(invocation -> {
            if (reads.incrementAndGet() == 1) {
                started.countDown();
                if (!release.await(5, TimeUnit.SECONDS)) throw new IllegalStateException("테스트 대기 시간 초과");
            }
            return Optional.of(current);
        });
        try (var executor = Executors.newSingleThreadExecutor()) {
            var running = executor.submit(service::syncConfiguredManifest);
            try {
                assertThat(started.await(5, TimeUnit.SECONDS)).isTrue();
                assertThat(service.status()).isEqualTo(
                        new KnowledgeSyncService.IndexStatus("sha256:revision", 1, 1, 0, false));
            } finally {
                release.countDown();
            }
            running.get(5, TimeUnit.SECONDS);
        }
        assertThat(service.status()).isEqualTo(new KnowledgeSyncService.IndexStatus("sha256:revision", 1, 1, 1, true));
    }

    @Test
    void 공개한_색인의_자료와_설정이_같으면_색인을_바꾸지_않는다() {
        when(loader.load(properties.source().location())).thenReturn(manifest(document("doc-1")));
        when(indexPort.publishedMetadata()).thenReturn(Optional.of(current));

        var result = service.syncConfiguredManifest();

        assertThat(result).isEqualTo(new KnowledgeSyncService.SyncResult("sha256:revision", 1, 0, "test-model", false));
        verify(indexPort, never()).createIndex(any());
        verify(indexPort, never()).publish(anyString(), anyLong());
        verifyNoInteractions(chunker);
        verify(embeddingPort, never()).embed(anyList());
    }

    @ParameterizedTest
    @ValueSource(strings = {"none", "revision", "model", "dimensions", "chunking", "documents"})
    void 자료나_색인_설정이_바뀌면_새_색인을_모두_채운_뒤_검색_대상으로_바꾼다(String changed) {
        var document = document("doc-1");
        var chunk = chunk("doc-1#000");
        when(loader.load(properties.source().location())).thenReturn(manifest(document));
        when(indexPort.publishedMetadata()).thenReturn(switch (changed) {
            case "none" -> Optional.empty();
            case "revision" -> Optional.of(new IndexMetadata("sha256:old", "test-model", 2,
                    current.chunkingFingerprint(), 1));
            case "model" -> Optional.of(new IndexMetadata("sha256:revision", "old-model", 2,
                    current.chunkingFingerprint(), 1));
            case "dimensions" -> Optional.of(new IndexMetadata("sha256:revision", "test-model", 3,
                    current.chunkingFingerprint(), 1));
            case "chunking" -> Optional.of(new IndexMetadata("sha256:revision", "test-model", 2,
                    "chunking-v1|max=1000|overlap=150", 1));
            default -> Optional.of(new IndexMetadata("sha256:revision", "test-model", 2,
                    current.chunkingFingerprint(), 2));
        });
        when(chunker.split(document)).thenReturn(List.of(chunk));
        when(embeddingPort.embed(List.of(chunk.content()))).thenReturn(List.of(List.of(1.0f, 0.0f)));

        var result = service.syncConfiguredManifest();

        assertThat(result).isEqualTo(new KnowledgeSyncService.SyncResult("sha256:revision", 1, 1, "test-model", true));
        var order = inOrder(indexPort);
        order.verify(indexPort).createIndex(current);
        order.verify(indexPort).bulkIndex(NEW_INDEX, List.of(chunk.withEmbedding("test-model", List.of(1.0f, 0.0f))));
        order.verify(indexPort).publish(NEW_INDEX, 1);
        verify(indexPort, never()).deleteIndex(anyString());
    }

    @Test
    void 여러_문서의_청크를_32개씩_묶어_임베딩하고_전체_청크_수로_검증한다() {
        var first = document("doc-1");
        var second = document("doc-2");
        List<KnowledgeChunk> firstChunks = chunks("doc-1", 20);
        List<KnowledgeChunk> secondChunks = chunks("doc-2", 13);
        when(loader.load(properties.source().location())).thenReturn(
                new KnowledgeManifest("1.0", "sha256:revision", List.of(first, second)));
        when(indexPort.publishedMetadata()).thenReturn(Optional.empty());
        when(chunker.split(first)).thenReturn(firstChunks);
        when(chunker.split(second)).thenReturn(secondChunks);
        when(embeddingPort.embed(anyList())).thenAnswer(invocation -> ((List<?>) invocation.getArgument(0)).stream()
                .map(ignored -> List.of(1.0f, 0.0f)).toList());

        assertThat(service.syncConfiguredManifest().chunks()).isEqualTo(33);

        verify(embeddingPort).embed(IntStream.range(0, 32)
                .mapToObj(index -> (index < 20 ? firstChunks.get(index) : secondChunks.get(index - 20)).content())
                .toList());
        verify(embeddingPort).embed(List.of(secondChunks.getLast().content()));
        verify(indexPort, times(2)).bulkIndex(anyString(), anyList());
        verify(indexPort).publish(NEW_INDEX, 33);
    }

    @Test
    void 벌크_색인이_실패하면_새_색인만_지우고_다음_동기화를_허용한다() {
        var document = document("doc-1");
        var chunk = chunk("doc-1#000");
        when(loader.load(properties.source().location())).thenReturn(manifest(document));
        when(indexPort.publishedMetadata()).thenReturn(Optional.empty());
        when(chunker.split(document)).thenReturn(List.of(chunk));
        when(embeddingPort.embed(List.of(chunk.content()))).thenReturn(List.of(List.of(1.0f, 0.0f)));
        var failure = new KnowledgeIndexAccessException("테스트 벌크 색인 실패");
        doThrow(failure).doNothing().when(indexPort).bulkIndex(anyString(), anyList());

        assertThatThrownBy(service::syncConfiguredManifest).isSameAs(failure);
        verify(indexPort).deleteIndex(NEW_INDEX);
        verify(indexPort, never()).publish(anyString(), anyLong());

        assertThat(service.syncConfiguredManifest().rebuilt()).isTrue();
        verify(indexPort).publish(NEW_INDEX, 1);
    }

    @Test
    void 청크_수_검증이나_검색_대상_교체에_실패하면_새_색인을_지운다() {
        var document = document("doc-1");
        when(loader.load(properties.source().location())).thenReturn(manifest(document));
        when(indexPort.publishedMetadata()).thenReturn(Optional.empty());
        when(chunker.split(document)).thenReturn(List.of(chunk("doc-1#000")));
        when(embeddingPort.embed(anyList())).thenReturn(List.of(List.of(1.0f, 0.0f)));
        var failure = new KnowledgeIndexAccessException("새 색인의 청크 수가 다릅니다.");
        doThrow(failure).when(indexPort).publish(NEW_INDEX, 1);

        assertThatThrownBy(service::syncConfiguredManifest).isSameAs(failure);
        verify(indexPort).deleteIndex(NEW_INDEX);
    }

    @Test
    void 새_색인_정리에_실패해도_원래_오류를_반환한다() {
        var document = document("doc-1");
        when(loader.load(properties.source().location())).thenReturn(manifest(document));
        when(indexPort.publishedMetadata()).thenReturn(Optional.empty());
        when(chunker.split(document)).thenReturn(List.of(chunk("doc-1#000")));
        var failure = new EmbeddingUnavailableException("임베딩 실패", new IllegalStateException("provider"));
        when(embeddingPort.embed(anyList())).thenThrow(failure);
        var cleanupFailure = new KnowledgeIndexAccessException("삭제 실패");
        doThrow(cleanupFailure).when(indexPort).deleteIndex(NEW_INDEX);

        assertThatThrownBy(service::syncConfiguredManifest).isSameAs(failure).hasSuppressedException(cleanupFailure);
        verify(indexPort, never()).bulkIndex(anyString(), anyList());
    }

    @Test
    void 임베딩_순번_오류는_쓰기를_중단하고_다음_동기화에서_올바른_문단에_연결한다() {
        var document = document("doc-1");
        var first = chunk("doc-1#000", "doc-1", "첫 문단");
        var second = chunk("doc-1#001", "doc-1", "두 번째 문단");
        when(loader.load(properties.source().location())).thenReturn(manifest(document));
        when(indexPort.publishedMetadata()).thenReturn(Optional.empty());
        when(chunker.split(document)).thenReturn(List.of(first, second));
        var model = mock(EmbeddingModel.class);
        when(model.embedForResponse(List.of("첫 문단", "두 번째 문단")))
                .thenReturn(new EmbeddingResponse(List.of(
                        new Embedding(new float[]{1, 0}, 0), new Embedding(new float[]{0, 1}, 0))))
                .thenReturn(new EmbeddingResponse(List.of(
                        new Embedding(new float[]{0, 1}, 1), new Embedding(new float[]{1, 0}, 0))));
        var sync = new KnowledgeSyncService(properties, loader, chunker,
                new SpringAiEmbeddingAdapter(model, "test-model", 2), indexPort);

        assertThatThrownBy(sync::syncConfiguredManifest).isInstanceOf(EmbeddingUnavailableException.class);
        verify(indexPort, never()).bulkIndex(anyString(), anyList());
        verify(indexPort).deleteIndex(NEW_INDEX);

        assertThat(sync.syncConfiguredManifest().chunks()).isEqualTo(2);
        verify(indexPort).bulkIndex(NEW_INDEX, List.of(
                first.withEmbedding("test-model", List.of(1f, 0f)),
                second.withEmbedding("test-model", List.of(0f, 1f))));
        verify(model, times(2)).embedForResponse(List.of("첫 문단", "두 번째 문단"));
    }

    @Test
    void 임베딩을_사용하지_않을_때도_BM25용_청크를_색인한다() {
        var document = document("doc-1");
        var chunk = chunk("doc-1#000");
        when(embeddingPort.available()).thenReturn(false);
        when(embeddingPort.modelId()).thenReturn("disabled");
        when(loader.load(properties.source().location())).thenReturn(manifest(document));
        when(indexPort.publishedMetadata()).thenReturn(Optional.empty());
        when(chunker.split(document)).thenReturn(List.of(chunk));

        assertThat(service.syncConfiguredManifest().embeddingModelId()).isEqualTo("disabled");

        verify(embeddingPort, never()).embed(anyList());
        verify(indexPort).bulkIndex(NEW_INDEX, List.of(chunk));
        verify(indexPort).publish(NEW_INDEX, 1);
    }

    @Test
    void 빈_문서_목록은_기존_색인을_바꾸지_않도록_거부한다() {
        when(loader.load(properties.source().location()))
                .thenReturn(new KnowledgeManifest("1.0", "sha256:empty", List.of()));

        assertThatThrownBy(service::syncConfiguredManifest)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("빈 공개 지식 문서 목록");
        verifyNoInteractions(indexPort);
    }

    @Test
    void 빈_자료는_색인이_있어도_최신으로_판정하지_않는다() {
        when(loader.load(properties.source().location()))
                .thenReturn(new KnowledgeManifest("1.0", "sha256:empty", List.of()));
        when(indexPort.publishedMetadata()).thenReturn(Optional.of(
                new IndexMetadata("sha256:empty", "test-model", 2, current.chunkingFingerprint(), 0)));

        assertThat(service.status()).isEqualTo(new KnowledgeSyncService.IndexStatus("sha256:empty", 0, 0, 0, false));
    }

    @Test
    void 상태의_문서_수는_공개한_색인과_최신_여부를_따른다() {
        when(loader.load(properties.source().location())).thenReturn(manifest(document("doc-1")));
        when(indexPort.publishedMetadata()).thenReturn(
                Optional.empty(),
                Optional.of(new IndexMetadata("sha256:old", "test-model", 2, current.chunkingFingerprint(), 5)),
                Optional.of(current)
        );

        assertThat(service.status()).isEqualTo(new KnowledgeSyncService.IndexStatus("sha256:revision", 1, 0, 0, false));
        assertThat(service.status()).isEqualTo(new KnowledgeSyncService.IndexStatus("sha256:revision", 1, 5, 0, false));
        assertThat(service.status()).isEqualTo(new KnowledgeSyncService.IndexStatus("sha256:revision", 1, 1, 1, true));
    }

    private KnowledgeManifest manifest(KnowledgeSourceDocument document) {
        return new KnowledgeManifest("1.0", "sha256:revision", List.of(document));
    }

    private List<KnowledgeChunk> chunks(String documentId, int count) {
        return IntStream.range(0, count)
                .mapToObj(index -> chunk("%s#%03d".formatted(documentId, index), documentId, documentId + " 문단 " + index))
                .toList();
    }
}
