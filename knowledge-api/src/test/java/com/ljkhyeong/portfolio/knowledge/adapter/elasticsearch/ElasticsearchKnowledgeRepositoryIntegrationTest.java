package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.time.Duration;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers(disabledWithoutDocker = true)
@Tag("integration")
class ElasticsearchKnowledgeRepositoryIntegrationTest {

    @Container
    private static final ElasticsearchContainer ELASTICSEARCH = new ElasticsearchContainer(
            DockerImageName.parse("portfolio-knowledge-elasticsearch:8.19.20-nori")
                    .asCompatibleSubstituteFor("docker.elastic.co/elasticsearch/elasticsearch")
    ).withEnv("xpack.security.enabled", "false")
            .withEnv("ES_JAVA_OPTS", "-Xms512m -Xmx512m")
            .withStartupTimeout(Duration.ofSeconds(120));

    private static ElasticsearchKnowledgeRepository repository;

    @BeforeAll
    static void setUp() {
        KnowledgeProperties properties = knowledgeProperties(
                "elasticsearch.base-url", "http://" + ELASTICSEARCH.getHttpHostAddress(),
                "elasticsearch.index-name", "portfolio-knowledge-integration-test"
        );
        repository = new ElasticsearchKnowledgeRepository(properties);
        repository.checkHealth();
        String chunkingFingerprint = properties.source().chunkingFingerprint();
        repository.ensureIndex("test-model", 2, chunkingFingerprint);
        repository.ensureIndex("test-model", 2, chunkingFingerprint);
        repository.bulkIndex(List.of(chunk("integration-chunk")));
    }

    @Test
    void 문서를_색인하고_BM25와_kNN으로_조회한다() {
        var filter = new KnowledgeFilter(List.of("baton"), List.of("problem_solution"));

        var bm25 = repository.searchBm25("알림", filter, 5);
        var knn = repository.searchKnn(List.of(1.0f, 0.0f), filter, 5, 10);

        assertThat(bm25).extracting(hit -> hit.chunk().chunkId()).contains("integration-chunk");
        assertThat(knn).extracting(hit -> hit.chunk().chunkId()).contains("integration-chunk");
        assertThat(repository.findIndexedSourceHashes()).containsEntry("doc-1", "sha256:source");
    }

    @Test
    void 조사가_붙은_한국어_질문도_같은_근거를_찾는다() {
        var filter = new KnowledgeFilter(List.of("baton"), List.of("problem_solution"));
        assertThat(repository.searchBm25("알림을", filter, 5))
                .extracting(hit -> hit.chunk().chunkId()).contains("integration-chunk");
    }

    @Test
    void 임베딩이_없는_청크도_BM25_문서로_색인한다() {
        KnowledgeChunk source = chunk("disabled-embedding-chunk");
        KnowledgeChunk withoutEmbedding = new KnowledgeChunk(
                source.chunkId(),
                "disabled-doc",
                source.projectId(),
                source.projectName(),
                source.serviceId(),
                source.documentType(),
                source.title(),
                source.heading(),
                "기본 설정에서는 임베딩 없이 BM25 검색을 제공합니다.",
                source.sourceUrl(),
                source.route(),
                source.evidenceLevel(),
                source.sourceRevision(),
                source.sourceHash(),
                "sha256:disabled-content",
                "sha256:disabled-chunk",
                null,
                List.of()
        );
        KnowledgeChunk staleChunk = new KnowledgeChunk(
                "disabled-stale-chunk",
                withoutEmbedding.documentId(),
                withoutEmbedding.projectId(),
                withoutEmbedding.projectName(),
                withoutEmbedding.serviceId(),
                withoutEmbedding.documentType(),
                withoutEmbedding.title(),
                withoutEmbedding.heading(),
                "임베딩 없이 BM25 검색을 제공하던 오래된 청크입니다.",
                withoutEmbedding.sourceUrl(),
                withoutEmbedding.route(),
                withoutEmbedding.evidenceLevel(),
                withoutEmbedding.sourceRevision(),
                withoutEmbedding.sourceHash(),
                "sha256:stale-content",
                "sha256:stale-chunk",
                null,
                List.of()
        );

        repository.bulkIndex(List.of(withoutEmbedding, staleChunk));
        repository.bulkIndex(List.of(withoutEmbedding));
        repository.deleteStaleChunks("disabled-doc", List.of("disabled-embedding-chunk"));

        var result = repository.searchBm25("임베딩 없이 BM25 검색", new KnowledgeFilter(List.of(), List.of()), 5);
        assertThat(result).extracting(hit -> hit.chunk().chunkId())
                .contains("disabled-embedding-chunk")
                .doesNotContain("disabled-stale-chunk");
        assertThat(repository.findIndexedSourceHashes()).containsEntry("disabled-doc", "sha256:source");

        repository.deleteByDocumentId("disabled-doc");

        var deleted = repository.searchBm25("임베딩 없이 BM25 검색", new KnowledgeFilter(List.of(), List.of()), 5);
        assertThat(deleted).extracting(hit -> hit.chunk().chunkId()).doesNotContain("disabled-embedding-chunk");
    }

    @Test
    void 청크_설정_지문이_다른_기존_인덱스는_재사용하지_않는다() {
        assertThatThrownBy(() -> repository.ensureIndex("test-model", 2, "sha256:changed-chunking"))
                .isInstanceOf(ElasticsearchAccessException.class)
                .hasMessageContaining("청크 설정");
    }
}
