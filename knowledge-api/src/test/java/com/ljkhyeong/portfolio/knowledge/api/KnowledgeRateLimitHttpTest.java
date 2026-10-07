package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.net.URI;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch.ElasticsearchKnowledgeRepository;
import com.ljkhyeong.portfolio.knowledge.verification.KnowledgeHumanVerificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.test.context.bean.override.convention.TestBean;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class KnowledgeRateLimitHttpTest {

    private static final String SEARCH_PATH = "/api/v1/knowledge/search";
    private static final String ANSWER_PATH = "/api/v1/knowledge/answers";
    private static final String SEARCH_BODY = "{\"query\":\"baton\"}";
    private static final String ANSWER_BODY = "{\"question\":\"baton\"}";

    @LocalServerPort
    private int port;

    @MockitoBean
    private ElasticsearchKnowledgeRepository repository;

    @MockitoSpyBean
    private KnowledgeHumanVerificationService verificationService;

    // 두 요청 사이에 분이 바뀌어 한도가 초기화되지 않도록 시각을 고정한다.
    @TestBean
    private KnowledgeRateLimiter rateLimiter;

    // JDK 클라이언트는 인코딩한 경로와 세미콜론 파라미터를 바꾸지 않고 보낸다.
    private final RestTestClient client = RestTestClient.bindToServer(new JdkClientHttpRequestFactory()).build();

    static KnowledgeRateLimiter rateLimiter() {
        return new KnowledgeRateLimiter(
                knowledgeProperties(
                        "ai.client-searches-per-minute", "1",
                        "ai.client-answers-per-minute", "1"
                ),
                Clock.fixed(Instant.parse("2026-10-07T12:00:30Z"), ZoneOffset.UTC)
        );
    }

    @ParameterizedTest
    @CsvSource({
            "/api/v1/knowledge/answers;x=1, 203.0.113.11",
            "/api/v1/knowledge/answer%73, 203.0.113.12",
            "/api/v1/knowledge/%61nswers, 203.0.113.13"
    })
    void 인코딩하거나_세미콜론_파라미터를_붙인_답변_경로도_답변_한도로_계산한다(String path, String clientAddress) {
        post(ANSWER_PATH, ANSWER_BODY, clientAddress).expectStatus().isOk();

        post(path, ANSWER_BODY, clientAddress)
                .expectStatus().isEqualTo(429)
                .expectHeader().valueEquals(HttpHeaders.RETRY_AFTER, "30")
                .expectBody()
                .jsonPath("$.code").isEqualTo("ANSWER_RATE_LIMITED");
        // 호출 제한에 걸린 요청은 Turnstile 검증 전에 끝난다.
        verify(verificationService, times(1)).verify(any(), any());
    }

    @Test
    void X_Forwarded_For의_왼쪽_값을_바꿔도_같은_클라이언트로_계산한다() {
        post(SEARCH_PATH, SEARCH_BODY, "1.1.1.1, 203.0.113.7").expectStatus().isOk();

        post(SEARCH_PATH, SEARCH_BODY, "2.2.2.2, 203.0.113.7")
                .expectStatus().isEqualTo(429)
                .expectBody()
                .jsonPath("$.code").isEqualTo("SEARCH_RATE_LIMITED");
        post(SEARCH_PATH, SEARCH_BODY, "203.0.113.8").expectStatus().isOk();
    }

    @Test
    void CORS_사전_요청과_OPTIONS는_호출_제한과_Turnstile_검증에_포함하지_않는다() {
        String clientAddress = "203.0.113.30";
        for (String path : List.of(SEARCH_PATH, ANSWER_PATH)) {
            for (int attempt = 0; attempt < 3; attempt++) {
                client.options()
                        .uri(uri(path))
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header("X-Forwarded-For", clientAddress)
                        .exchange()
                        .expectStatus().isOk();
            }
            client.options()
                    .uri(uri(path))
                    .header("X-Forwarded-For", clientAddress)
                    .exchange()
                    .expectStatus().isOk();
        }
        verify(verificationService, never()).verify(any(), any());

        post(SEARCH_PATH, SEARCH_BODY, clientAddress).expectStatus().isOk();
        post(ANSWER_PATH, ANSWER_BODY, clientAddress).expectStatus().isOk();
    }

    private RestTestClient.ResponseSpec post(String path, String body, String forwardedFor) {
        return client.post()
                .uri(uri(path))
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-Forwarded-For", forwardedFor)
                .body(body)
                .exchange();
    }

    // 문자열 URI 템플릿은 %를 다시 인코딩하므로 원문 경로를 URI로 넘긴다.
    private URI uri(String path) {
        return URI.create("http://127.0.0.1:" + port + path);
    }
}
