package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.elasticsearch.autoconfigure.ElasticsearchProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "management.endpoint.health.show-details=always")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class ElasticsearchReadinessTest {

    private static final String HEALTH_RESPONSE = """
            {"cluster_name":"test-cluster","status":"%s","timed_out":%s,
             "number_of_nodes":1,"number_of_data_nodes":1,"active_primary_shards":1,
             "active_shards":1,"relocating_shards":0,"initializing_shards":0,
             "unassigned_shards":0,"unassigned_primary_shards":0,
             "delayed_unassigned_shards":0,"number_of_pending_tasks":0,"number_of_in_flight_fetch":0,
             "task_max_waiting_in_queue_millis":0,"active_shards_percent_as_number":100.0}
            """;
    private static final AtomicInteger HEALTH_REQUESTS = new AtomicInteger();
    private static volatile String response = HEALTH_RESPONSE.formatted("green", false);
    private static volatile int responseStatus = 200;
    private static final HttpServer ELASTICSEARCH = startElasticsearchStub();

    @LocalServerPort
    private int port;

    @Autowired
    private ElasticsearchProperties elasticsearch;

    private RestTestClient client;

    @DynamicPropertySource
    static void elasticsearchProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.elasticsearch.uris",
                () -> "http://127.0.0.1:" + ELASTICSEARCH.getAddress().getPort());
    }

    @BeforeEach
    void setUp() {
        response = HEALTH_RESPONSE.formatted("green", false);
        responseStatus = 200;
        client = RestTestClient.bindToServer().baseUrl("http://127.0.0.1:" + port).build();
    }

    @AfterAll
    static void close() {
        ELASTICSEARCH.stop(0);
    }

    @ParameterizedTest
    @CsvSource({"green, 200, UP", "yellow, 200, UP", "red, 503, OUT_OF_SERVICE"})
    void HTTP_200이어도_실제_상태로_readiness를_판정한다(String status, int httpStatus, String readiness) {
        response = HEALTH_RESPONSE.formatted(status, false);
        assertHealth("readiness", httpStatus, readiness);
    }

    @Test
    void 상태가_복구되면_다음_readiness부터_요청을_받는다() {
        response = HEALTH_RESPONSE.formatted("red", false);
        assertHealth("readiness", 503, "OUT_OF_SERVICE");
        response = HEALTH_RESPONSE.formatted("green", false);
        assertHealth("readiness", 200, "UP");
    }

    @Test
    void Elasticsearch_장애는_프로세스_생존_확인에_영향을_주지_않는다() {
        response = HEALTH_RESPONSE.formatted("red", false);
        int previousRequests = HEALTH_REQUESTS.get();
        assertHealth("liveness", 200, "UP");
        assertThat(HEALTH_REQUESTS.get()).isEqualTo(previousRequests);
    }

    @Test
    void Elasticsearch_HTTP_오류도_readiness에_반영한다() {
        responseStatus = 503;
        response = """
                {"error":{"type":"unavailable_shards_exception","reason":"test"},"status":503}
                """;
        assertHealth("readiness", 503, "DOWN");
    }

    @Test
    void 연결과_응답_대기_시간을_기본_설정값으로_제한한다() {
        assertThat(elasticsearch.getConnectionTimeout()).isEqualTo(Duration.ofSeconds(3));
        assertThat(elasticsearch.getSocketTimeout()).isEqualTo(Duration.ofSeconds(10));
    }

    private void assertHealth(String group, int httpStatus, String status) {
        client.get()
                .uri("/actuator/health/" + group)
                .exchange()
                .expectStatus().isEqualTo(httpStatus)
                .expectBody()
                .jsonPath("$.status").isEqualTo(status);
    }

    private static HttpServer startElasticsearchStub() {
        try {
            var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.createContext("/_cluster/health", exchange -> {
                HEALTH_REQUESTS.incrementAndGet();
                byte[] body = response.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.getResponseHeaders().set("X-Elastic-Product", "Elasticsearch");
                exchange.sendResponseHeaders(responseStatus, body.length);
                try (var output = exchange.getResponseBody()) {
                    output.write(body);
                }
            });
            server.start();
            return server;
        } catch (IOException exception) {
            throw new UncheckedIOException(exception);
        }
    }
}
