package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.mapping.DenseVectorIndexOptionsType;
import co.elastic.clients.json.jackson.Jackson3JsonpMapper;
import co.elastic.clients.transport.rest5_client.Rest5ClientTransport;
import co.elastic.clients.transport.rest5_client.low_level.Rest5Client;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort.IndexMetadata;
import org.apache.hc.client5.http.impl.async.HttpAsyncClientBuilder;
import org.apache.hc.core5.http.protocol.HttpCoreContext;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.health.actuate.endpoint.HealthEndpoint;
import org.springframework.boot.health.contributor.Status;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
@Tag("integration")
class ElasticsearchKnowledgeRepositoryIntegrationTest {

    private static final KnowledgeFilter ALL = new KnowledgeFilter(List.of(), List.of(), List.of());

    @Container
    @ServiceConnection
    private static final ElasticsearchContainer ELASTICSEARCH = new ElasticsearchContainer(
            DockerImageName.parse("portfolio-knowledge-elasticsearch:9.4.8-nori")
                    .asCompatibleSubstituteFor("docker.elastic.co/elasticsearch/elasticsearch")
    ).withEnv("xpack.security.enabled", "false")
            .withEnv("ES_JAVA_OPTS", "-Xms512m -Xmx512m")
            .withStartupTimeout(Duration.ofSeconds(120));

    @Autowired
    private ElasticsearchClient client;

    @Autowired
    private HealthEndpoint health;

    @Test
    void 자동_설정한_클라이언트로_클러스터_상태를_확인한다() {
        assertThat(health.healthForPath("readiness").getStatus()).isEqualTo(Status.UP);
    }

    @Test
    void 첫_동기화_전에는_검색_결과와_공개_색인이_없다() {
        var repository = repository("empty-alias");

        assertThat(repository.publishedMetadata()).isEmpty();
        assertThat(repository.searchBm25("알림", ALL, 5)).isEmpty();
        assertThat(repository.searchKnn(List.of(1.0f, 0.0f), ALL, 5, 10)).isEmpty();
    }

    @Test
    void 공개한_색인을_alias로_BM25와_kNN_검색하고_메타데이터를_읽는다() throws IOException {
        var repository = repository("first-publish");
        String index = publish(repository, metadata("sha256:first", 1), chunk("integration-chunk"));
        var filter = new KnowledgeFilter(List.of("baton"), List.of(), List.of("problem_solution"));

        assertThat(chunkIds(repository.searchBm25("알림", filter, 5))).containsExactly("integration-chunk");
        assertThat(chunkIds(repository.searchKnn(List.of(1.0f, 0.0f), filter, 5, 10)))
                .containsExactly("integration-chunk");
        assertThat(repository.publishedMetadata()).contains(metadata("sha256:first", 1));
        var mappings = client.indices().getMapping(request -> request.index(index)).get(index).mappings();
        assertThat(mappings.properties().get("embedding").denseVector().indexOptions().type())
                .isEqualTo(DenseVectorIndexOptionsType.Int8Hnsw);
        assertThat(mappings.properties().get("projectName").text().fields()).isEmpty();
    }

    @Test
    void 두_번째_공개는_검색_결과를_한_번에_바꾸고_이전_색인을_삭제한다() throws IOException {
        var repository = repository("second-publish");
        String first = publish(repository, metadata("sha256:first", 1), chunk("old-chunk", "old-doc"));
        String second = publish(repository, metadata("sha256:second", 1), chunk("new-chunk", "new-doc"));

        assertThat(chunkIds(repository.searchBm25("알림", ALL, 5))).containsExactly("new-chunk");
        assertThat(repository.publishedMetadata()).contains(metadata("sha256:second", 1));
        assertThat(client.indices().exists(request -> request.index(first)).value()).isFalse();
        assertThat(aliasTargets("second-publish")).containsExactly(second);
    }

    @Test
    void 청크_수가_다르면_alias를_옮기지_않고_기존_검색_결과를_유지한다() throws IOException {
        var repository = repository("count-mismatch");
        String published = publish(repository, metadata("sha256:first", 1), chunk("kept-chunk", "kept-doc"));
        String incomplete = repository.createIndex(metadata("sha256:second", 2));
        repository.bulkIndex(incomplete, List.of(chunk("partial-chunk", "partial-doc")));

        assertThatThrownBy(() -> repository.publish(incomplete, 2))
                .isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("청크 수");
        repository.deleteUnpublishedIndex(incomplete);

        assertThat(aliasTargets("count-mismatch")).containsExactly(published);
        assertThat(chunkIds(repository.searchBm25("알림", ALL, 5))).containsExactly("kept-chunk");
        assertThat(client.indices().exists(request -> request.index(incomplete)).value()).isFalse();
    }

    @Test
    void alias_교체_응답을_잃어도_교체가_적용됐으면_성공으로_보고_공개한_색인을_지우지_않는다() throws IOException {
        String first = publish(repository("lost-alias-response"), metadata("sha256:first", 1),
                chunk("old-chunk", "old-doc"));
        try (Rest5Client rest = restClient(builder -> builder.addResponseInterceptorFirst((response, entity, context) -> {
            if (HttpCoreContext.cast(context).getRequest().getRequestUri().startsWith("/_aliases")) {
                throw new IOException("alias 교체 응답 유실");
            }
        }))) {
            var repository = repository("lost-alias-response", rest);
            String second = repository.createIndex(metadata("sha256:second", 1));
            repository.bulkIndex(second, List.of(chunk("new-chunk", "new-doc")));

            repository.publish(second, 1);
            repository.deleteUnpublishedIndex(second);

            assertThat(aliasTargets("lost-alias-response")).containsExactly(second);
            assertThat(client.indices().exists(request -> request.index(first)).value()).isFalse();
            assertThat(chunkIds(repository.searchBm25("알림", ALL, 5))).containsExactly("new-chunk");
        }
    }

    @Test
    void alias_교체_요청이_실패하면_기존_alias를_유지하고_새_색인만_지운다() throws IOException {
        var repository = repository("failed-alias-request");
        String first = publish(repository, metadata("sha256:first", 1), chunk("old-chunk", "old-doc"));
        try (Rest5Client rest = restClient(builder -> builder.addRequestInterceptorFirst((request, entity, context) -> {
            if (request.getRequestUri().startsWith("/_aliases")) {
                throw new IOException("alias 교체 요청 실패");
            }
        }))) {
            var failing = repository("failed-alias-request", rest);
            String second = failing.createIndex(metadata("sha256:second", 1));
            failing.bulkIndex(second, List.of(chunk("new-chunk", "new-doc")));

            assertThatThrownBy(() -> failing.publish(second, 1)).isInstanceOf(KnowledgeIndexAccessException.class)
                    .hasMessageContaining("alias를 교체하지 못했습니다");
            failing.deleteUnpublishedIndex(second);

            assertThat(aliasTargets("failed-alias-request")).containsExactly(first);
            assertThat(client.indices().exists(request -> request.index(second)).value()).isFalse();
            assertThat(chunkIds(repository.searchBm25("알림", ALL, 5))).containsExactly("old-chunk");
        }
    }

    @Test
    void 다른_임베딩_모델로_만든_벡터는_kNN에서_비교하지_않는다() {
        var repository = repository("model-filter");
        KnowledgeChunk otherModel = chunk("other-model-chunk", "other-doc").withEmbedding("old-model", List.of(1f, 0f));
        publish(repository, metadata("sha256:first", 2), chunk("current-chunk"), otherModel);

        assertThat(chunkIds(repository.searchKnn(List.of(1.0f, 0.0f), ALL, 5, 10)))
                .containsExactly("current-chunk");
        assertThat(chunkIds(repository.searchBm25("알림", ALL, 5)))
                .containsExactlyInAnyOrder("current-chunk", "other-model-chunk");
    }

    @Test
    void alias와_같은_이름의_기존_색인은_첫_공개에서_교체한다() throws IOException {
        client.indices().create(request -> request.index("legacy-name"));
        var repository = repository("legacy-name");
        assertThat(repository.publishedMetadata()).isEmpty();

        String index = publish(repository, metadata("sha256:first", 1), chunk("replacing-chunk"));

        assertThat(aliasTargets("legacy-name")).containsExactly(index);
        assertThat(repository.publishedMetadata()).contains(metadata("sha256:first", 1));
    }

    @Test
    void 조사가_붙은_한국어_질문도_같은_근거를_찾는다() {
        var repository = repository("korean-particle");
        publish(repository, metadata("sha256:first", 1), chunk("integration-chunk"));

        assertThat(chunkIds(repository.searchBm25("알림을", ALL, 5))).containsExactly("integration-chunk");
    }

    @Test
    void 본문_뒤쪽의_한국어_일치_문단을_태그_없이_발췌한다() {
        var repository = repository("highlight");
        String content = "# 시스템 소개\n\n" + "이 문서는 프로젝트 구성을 설명합니다. ".repeat(25)
                + "\n\n권한 철회는 기존 구독 토큰을 폐기하고 새 접근을 차단합니다.\n\n"
                + "기타 세부 사항은 원문을 확인하세요. ".repeat(10);
        publish(repository, metadata("sha256:first", 1), chunk("highlight#0", "highlight-doc", content));

        assertThat(repository.searchBm25("권한을 철회하면", ALL, 5)).singleElement()
                .satisfies(hit -> assertThat(hit.matchedPassage())
                        .contains("권한 철회", "구독 토큰").doesNotContain("<em>", "시스템 소개"));
    }

    @Test
    void 임베딩이_없는_청크도_BM25_문서로_색인한다() {
        var repository = repository("without-embedding");
        KnowledgeChunk source = chunk("disabled-embedding-chunk", "disabled-doc",
                "기본 설정에서는 임베딩 없이 BM25 검색을 제공합니다.");
        KnowledgeChunk withoutEmbedding = new KnowledgeChunk(source.chunkId(), source.documentId(),
                source.projectId(), source.projectName(), source.serviceId(), source.documentType(), source.title(),
                source.heading(), source.content(), source.sourceUrl(), source.route(), null, List.of());
        publish(repository, metadata("sha256:first", 1), withoutEmbedding);

        assertThat(chunkIds(repository.searchBm25("임베딩 없이 BM25 검색", ALL, 5)))
                .containsExactly("disabled-embedding-chunk");
        assertThat(repository.searchKnn(List.of(1.0f, 0.0f), ALL, 5, 10)).isEmpty();
    }

    private ElasticsearchKnowledgeRepository repository(String alias) {
        return repository(alias, client);
    }

    private ElasticsearchKnowledgeRepository repository(String alias, Rest5Client rest) {
        return repository(alias, new ElasticsearchClient(new Rest5ClientTransport(rest, new Jackson3JsonpMapper())));
    }

    private ElasticsearchKnowledgeRepository repository(String alias, ElasticsearchClient elasticsearchClient) {
        return new ElasticsearchKnowledgeRepository(
                knowledgeProperties("elasticsearch.index-name", alias, "ai.embedding-model-id", "test-model"),
                elasticsearchClient);
    }

    // 특정 요청이나 응답만 실패시키는 클라이언트. 같은 컨테이너를 쓴다.
    private Rest5Client restClient(Consumer<HttpAsyncClientBuilder> customizer) {
        return Rest5Client.builder(URI.create("http://" + ELASTICSEARCH.getHttpHostAddress()))
                .setHttpClientConfigCallback(customizer)
                .build();
    }

    private String publish(ElasticsearchKnowledgeRepository repository, IndexMetadata metadata,
                           KnowledgeChunk... chunks) {
        String index = repository.createIndex(metadata);
        repository.bulkIndex(index, List.of(chunks));
        repository.publish(index, chunks.length);
        return index;
    }

    private IndexMetadata metadata(String sourceRevision, int documentCount) {
        return new IndexMetadata(sourceRevision, "test-model", 2, "chunking-v1|max=1200|overlap=150", documentCount);
    }

    private Set<String> aliasTargets(String alias) throws IOException {
        return client.indices().getAlias(request -> request.name(alias)).aliases().keySet();
    }

    private static List<String> chunkIds(List<SearchHit> hits) {
        return hits.stream().map(hit -> hit.chunk().chunkId()).toList();
    }
}
