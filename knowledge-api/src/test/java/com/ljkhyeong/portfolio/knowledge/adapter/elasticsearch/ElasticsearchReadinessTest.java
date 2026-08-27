package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static org.mockito.Mockito.doThrow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ElasticsearchReadinessTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private ElasticsearchKnowledgeRepository repository;

    @Test
    void Elasticsearch가_응답하지_않으면_readiness는_503을_반환한다() {
        doThrow(new ElasticsearchAccessException("connection refused"))
                .when(repository).checkHealth();

        RestTestClient.bindToServer()
                .baseUrl("http://127.0.0.1:" + port)
                .build()
                .get()
                .uri("/actuator/health/readiness")
                .exchange()
                .expectStatus().isEqualTo(503)
                .expectBody()
                .jsonPath("$.status").isEqualTo("DOWN");
    }
}
