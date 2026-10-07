package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.Jackson3JsonpMapper;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort.IndexMetadata;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import tools.jackson.databind.ObjectMapper;

class ElasticsearchSearchResponseTest {

    private static final String HIT = """
            {"_index":"portfolio-knowledge-20261007000000000","_id":"chunk-1","_score":1.0,"_source":{
              "chunkId":"chunk-1","documentId":"doc-1","projectId":"baton","projectName":"BATON",
              "documentType":"problem_solution","title":"알림 재처리","content":"미전송 알림을 다시 처리합니다.",
              "route":"/projects/baton/relay","embeddingModelId":"test-model"}}
            """;
    private static final String COMPLETE = """
            {"took":1,"timed_out":false,"_shards":{"total":2,"successful":2,"skipped":0,"failed":0},
             "hits":{"total":{"value":1,"relation":"eq"},"hits":[%s]}}
            """.formatted(HIT);
    private static final String META = """
            {"mappingVersion":1,"sourceRevision":"sha256:revision","embeddingModelId":"test-model",
             "embeddingDimensions":2,"chunkingFingerprint":"chunking-v1|max=1200|overlap=150","documentCount":3}
            """;
    private static final String SHARDS = "\"_shards\":{\"total\":1,\"successful\":1,\"skipped\":0,\"failed\":0}";

    private final List<Request> requests = new CopyOnWriteArrayList<>();
    private final Map<String, String> routes = new ConcurrentHashMap<>();
    private volatile String response = COMPLETE;
    private HttpServer server;
    private ElasticsearchClient client;
    private ElasticsearchKnowledgeRepository repository;

    @BeforeEach
    void setUp() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", exchange -> {
            var request = new Request(exchange.getRequestMethod(), exchange.getRequestURI().getPath(),
                    exchange.getRequestURI().getQuery(),
                    new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            requests.add(request);
            byte[] body = routes.getOrDefault(request.method() + " " + request.path(), response)
                    .getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("X-Elastic-Product", "Elasticsearch");
            exchange.sendResponseHeaders(200, body.length);
            try (var output = exchange.getResponseBody()) {
                output.write(body);
            }
        });
        server.start();
        String url = "http://127.0.0.1:" + server.getAddress().getPort();
        client = ElasticsearchClient.of(config -> config.host(url).jsonMapper(new Jackson3JsonpMapper()));
        repository = new ElasticsearchKnowledgeRepository(knowledgeProperties("ai.embedding-model-id", "test-model"),
                client, Clock.fixed(Instant.parse("2026-10-07T01:02:03.004Z"), ZoneOffset.UTC));
    }

    @AfterEach
    void close() throws Exception {
        try {
            if (client != null) client.close();
        } finally {
            if (server != null) server.stop(0);
        }
    }

    @ParameterizedTest
    @CsvSource({"bm25, timeout", "knn, timeout", "bm25, shard", "knn, shard", "bm25, early", "knn, early"})
    void 일부만_완료된_HTTP_200_응답을_거부한다(String operation, String failure) {
        response = switch (failure) {
            case "timeout" -> COMPLETE.replace("\"timed_out\":false", "\"timed_out\":true");
            case "shard" -> COMPLETE.replace("\"successful\":2", "\"successful\":1")
                    .replace("\"failed\":0", "\"failed\":1");
            default -> COMPLETE.replace("\"took\":1", "\"took\":1,\"terminated_early\":true");
        };

        assertThatThrownBy(() -> read(operation)).isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("완료되지 않았습니다");
        assertThat(requests).hasSize(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"bm25", "knn"})
    void 검색_alias를_조회하고_부분_검색을_허용하지_않도록_요청한다(String operation) {
        response = COMPLETE.replace("\"value\":1", "\"value\":100");

        assertThat(read(operation)).isEqualTo(1);
        assertThat(requests).singleElement().satisfies(request -> {
            assertThat(request.path()).isEqualTo("/portfolio-knowledge/_search");
            assertThat(request.query()).contains("allow_partial_search_results=false", "ignore_unavailable=true");
        });
    }

    @Test
    void 벡터_검색은_설정한_임베딩_모델의_청크만_비교한다() throws Exception {
        repository.searchKnn(List.of(1f, 0f), new KnowledgeFilter(List.of("baton"), List.of(), List.of()), 5, 10);

        var knn = new ObjectMapper().readTree(requests.getFirst().body()).path("knn");
        assertThat(knn.toString()).contains("\"projectId\":[\"baton\"]",
                "\"embeddingModelId\":{\"value\":\"test-model\"}");
    }

    @ParameterizedTest
    @ValueSource(strings = {"bm25", "knn"})
    void 문서_본문이_없는_검색_항목을_조용히_제외하지_않는다(String operation) {
        response = COMPLETE.replace(HIT, "{\"_index\":\"test-index\",\"_id\":\"chunk-1\"}");
        assertThatThrownBy(() -> read(operation)).isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("문서 본문");
    }

    @Test
    void 검색_alias가_가리키는_색인의_메타데이터를_읽는다() {
        response = "{\"portfolio-knowledge-20261007000000000\":{\"mappings\":{\"_meta\":" + META + "}}}";

        assertThat(repository.publishedMetadata()).contains(new IndexMetadata(
                "sha256:revision", "test-model", 2, "chunking-v1|max=1200|overlap=150", 3));
        assertThat(requests).singleElement().satisfies(request -> {
            assertThat(request.path()).isEqualTo("/portfolio-knowledge/_mapping");
            assertThat(request.query()).contains("ignore_unavailable=true", "allow_no_indices=true");
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {"missing", "legacy", "version", "incomplete"})
    void 공개한_색인이_없거나_형식이_다르면_다시_색인하도록_빈_값을_반환한다(String state) {
        String meta = switch (state) {
            case "missing" -> null;
            case "legacy" -> "{\"embeddingModelId\":\"test-model\",\"embeddingDimensions\":2}";
            case "version" -> META.replace("\"mappingVersion\":1", "\"mappingVersion\":0");
            default -> META.replace(",\"documentCount\":3", "");
        };
        response = meta == null ? "{}" : "{\"portfolio-knowledge\":{\"mappings\":{\"_meta\":" + meta + "}}}";

        assertThat(repository.publishedMetadata()).isEmpty();
    }

    @Test
    void 검색_alias가_여러_색인을_가리키면_메타데이터를_고르지_않는다() {
        response = """
                {"portfolio-knowledge-20261006000000000":{"mappings":{"_meta":%s}},
                 "portfolio-knowledge-20261007000000000":{"mappings":{"_meta":%s}}}
                """.formatted(META, META);

        assertThatThrownBy(repository::publishedMetadata).isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("여러 색인");
    }

    @Test
    void 새_색인은_alias와_생성_시각으로_이름을_짓고_설정을_메타데이터로_남긴다() throws Exception {
        response = "{\"acknowledged\":true,\"shards_acknowledged\":true,\"index\":\"created\"}";

        String index = repository.createIndex(new IndexMetadata(
                "sha256:revision", "test-model", 2, "chunking-v1|max=1200|overlap=150", 3));

        assertThat(index).isEqualTo("portfolio-knowledge-20261007010203004");
        var request = requests.getFirst();
        assertThat(request.method() + " " + request.path()).isEqualTo("PUT /" + index);
        var mappings = new ObjectMapper().readTree(request.body()).path("mappings");
        assertThat(mappings.path("_meta")).isEqualTo(new ObjectMapper().readTree(META));
        assertThat(mappings.path("dynamic").asString()).isEqualTo("strict");
        assertThat(mappings.path("properties").path("embedding").path("dims").asInt()).isEqualTo(2);
    }

    @Test
    void 청크_수가_같을_때만_alias를_옮기고_이전_생성_색인과_같은_이름의_색인만_삭제한다() throws Exception {
        String index = "portfolio-knowledge-20261007010203004";
        routes.put("POST /" + index + "/_refresh", "{" + SHARDS + "}");
        routes.put("POST /" + index + "/_count", "{\"count\":2," + SHARDS + "}");
        routes.put("GET /portfolio-knowledge,portfolio-knowledge-*", """
                {"portfolio-knowledge":{"aliases":{}},
                 "portfolio-knowledge-20261006000000000":{"aliases":{"portfolio-knowledge":{}}},
                 "portfolio-knowledge-disabled-v3":{"aliases":{}},
                 "portfolio-knowledge-20261007010203004":{"aliases":{}}}
                """);
        routes.put("POST /_aliases", "{\"acknowledged\":true}");

        assertThatThrownBy(() -> repository.publish(index, 3)).isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("기대=3, 실제=2");
        assertThat(requests).extracting(Request::path).doesNotContain("/_aliases");

        repository.publish(index, 2);

        var mapper = new ObjectMapper();
        var aliases = requests.stream().filter(request -> request.path().equals("/_aliases"))
                .findFirst().orElseThrow();
        assertThat(mapper.readTree(aliases.body()).path("actions").values()).containsExactlyInAnyOrder(
                mapper.readTree("""
                        {"add":{"alias":"portfolio-knowledge","index":"portfolio-knowledge-20261007010203004"}}
                        """),
                mapper.readTree("{\"remove_index\":{\"index\":\"portfolio-knowledge\"}}"),
                mapper.readTree("{\"remove_index\":{\"index\":\"portfolio-knowledge-20261006000000000\"}}"));
    }

    private int read(String operation) {
        var filter = new KnowledgeFilter(List.of(), List.of(), List.of());
        return switch (operation) {
            case "bm25" -> repository.searchBm25("알림", filter, 5).size();
            default -> repository.searchKnn(List.of(1f, 0f), filter, 5, 10).size();
        };
    }

    private record Request(String method, String path, String query, String body) {
    }
}
