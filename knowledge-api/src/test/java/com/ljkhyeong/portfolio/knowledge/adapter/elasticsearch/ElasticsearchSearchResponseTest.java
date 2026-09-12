package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
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
            {"_index":"test-index","_id":"chunk-1","_score":1.0,"_source":{
              "chunkId":"chunk-1","documentId":"doc-1","projectId":"baton","projectName":"BATON",
              "documentType":"problem_solution","title":"알림 재처리","content":"미전송 알림을 다시 처리합니다.",
              "route":"/projects/baton/relay","sourceHash":"sha256:source","documentChunkCount":1}}
            """;
    private static final String COMPLETE = """
            {"took":1,"timed_out":false,"_shards":{"total":2,"successful":2,"skipped":0,"failed":0},
             "hits":{"total":{"value":1,"relation":"eq"},"hits":[%s]}}
            """.formatted(HIT);

    private final List<Request> requests = new CopyOnWriteArrayList<>();
    private volatile String response = COMPLETE;
    private HttpServer server;
    private ElasticsearchKnowledgeRepository repository;

    @BeforeEach
    void setUp() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", exchange -> {
            requests.add(new Request(exchange.getRequestURI().getQuery(),
                    new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8)));
            byte[] body = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("X-Elastic-Product", "Elasticsearch");
            exchange.sendResponseHeaders(200, body.length);
            try (var output = exchange.getResponseBody()) {
                output.write(body);
            }
        });
        server.start();
        repository = new ElasticsearchKnowledgeRepository(knowledgeProperties(
                "elasticsearch.base-url", "http://127.0.0.1:" + server.getAddress().getPort()));
    }

    @AfterEach
    void close() {
        try {
            if (repository != null) repository.close();
        } finally {
            if (server != null) server.stop(0);
        }
    }

    @ParameterizedTest
    @CsvSource({
            "bm25, timeout", "knn, timeout", "hashes, timeout",
            "bm25, shard", "knn, shard", "hashes, shard",
            "bm25, early", "knn, early", "hashes, early"
    })
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
    @ValueSource(strings = {"bm25", "knn", "hashes"})
    void 정상_응답을_반환하고_부분_검색을_허용하지_않도록_요청한다(String operation) throws Exception {
        if (!operation.equals("hashes")) {
            response = COMPLETE.replace("\"value\":1", "\"value\":100");
        }
        assertThat(read(operation)).isEqualTo(1);
        assertThat(requests).hasSize(1);
        assertThat(requests.getFirst().query()).contains("allow_partial_search_results=false");
        if (operation.equals("hashes")) {
            var body = new ObjectMapper().readTree(requests.getFirst().body());
            assertThat(body.path("track_total_hits").asBoolean()).isTrue();
            assertThat(body.path("size").asInt()).isEqualTo(10_000);
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"missing", "lower-bound", "truncated", "over-limit"})
    void 전체_청크를_확인하지_못하면_색인_해시_목록을_반환하지_않는다(String failure) {
        response = switch (failure) {
            case "missing" -> COMPLETE.replace("\"total\":{\"value\":1,\"relation\":\"eq\"},", "");
            case "lower-bound" -> COMPLETE.replace("\"relation\":\"eq\"", "\"relation\":\"gte\"");
            case "truncated" -> COMPLETE.replace("\"value\":1", "\"value\":2");
            default -> COMPLETE.replace("\"value\":1", "\"value\":10001");
        };

        assertThatThrownBy(repository::findIndexedSourceHashes).isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("색인 청크 전체를 확인하지 못했습니다");
    }

    @ParameterizedTest
    @ValueSource(strings = {"bm25", "knn", "hashes"})
    void 문서_본문이_없는_검색_항목을_조용히_제외하지_않는다(String operation) {
        response = COMPLETE.replace(HIT, "{\"_index\":\"test-index\",\"_id\":\"chunk-1\"}");
        assertThatThrownBy(() -> read(operation)).isInstanceOf(KnowledgeIndexAccessException.class)
                .hasMessageContaining("문서 본문");
    }

    @Test
    void 조회가_정상_완료된_빈_색인은_빈_목록으로_반환한다() {
        response = COMPLETE.replace("\"value\":1", "\"value\":0").replace(HIT, "");
        assertThat(repository.findIndexedSourceHashes()).isEmpty();
    }

    private int read(String operation) {
        var filter = new KnowledgeFilter(List.of(), List.of());
        return switch (operation) {
            case "bm25" -> repository.searchBm25("알림", filter, 5).size();
            case "knn" -> repository.searchKnn(List.of(1f, 0f), filter, 5, 10).size();
            default -> repository.findIndexedSourceHashes().size();
        };
    }

    private record Request(String query, String body) {
    }
}
