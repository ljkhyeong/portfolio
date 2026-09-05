package com.ljkhyeong.portfolio.knowledge.api;

import com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch.ElasticsearchKnowledgeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class KnowledgeErrorResponseHttpTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private ElasticsearchKnowledgeRepository repository;

    @Test
    void 없는_정적_리소스는_404와_한글_오류_응답을_반환한다() {
        RestTestClient.bindToServer()
                .baseUrl("http://127.0.0.1:" + port)
                .build()
                .get()
                .uri("/missing-resource.css")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isNotFound()
                .expectBody()
                .jsonPath("$.code").isEqualTo("NOT_FOUND")
                .jsonPath("$.message").isEqualTo("요청한 주소를 찾을 수 없습니다.");
    }
}
