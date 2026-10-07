package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalManagementPort;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestClient;

@ActiveProfiles("homeserver")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "management.server.port=0",
        "knowledge.source.sync-on-startup=false"
})
class HomeserverMonitoringTest {

    @LocalServerPort
    private int apiPort;

    @LocalManagementPort
    private int managementPort;

    @Test
    void 관리_포트에서_RAG_지표를_Prometheus_형식으로_수집한다() {
        String body = RestClient.create("http://127.0.0.1:" + managementPort).get()
                .uri("/actuator/prometheus").retrieve().body(String.class);

        // 캐시 지표는 서비스 생성 때 등록되므로 요청 없이도 0으로 노출된다.
        assertThat(body).contains("cache_gets_total", "cache=\"answer\"", "cache=\"query_embedding\"",
                "result=\"hit\"", "application=\"portfolio-knowledge-api\"");
        assertThat(managementPort).isNotEqualTo(apiPort);
        int apiStatus = RestClient.create("http://127.0.0.1:" + apiPort).get()
                .uri("/actuator/prometheus")
                .exchange((request, response) -> response.getStatusCode().value());
        assertThat(apiStatus).isEqualTo(404);
    }
}
