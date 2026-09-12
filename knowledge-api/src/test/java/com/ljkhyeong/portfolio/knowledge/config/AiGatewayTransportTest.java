package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicReference;

import com.ljkhyeong.portfolio.knowledge.KnowledgeApiApplication;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import org.springframework.ai.model.openai.autoconfigure.OpenAiCommonProperties;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.boot.context.properties.bind.Binder;

class AiGatewayTransportTest {

    @Test
    void 답변과_임베딩이_같은_Gateway_경로와_인증_헤더를_사용한다() throws Exception {
        var environment = new MockEnvironment().withProperty("CLOUDFLARE_ACCOUNT_ID", "account")
                .withProperty("CLOUDFLARE_AI_GATEWAY_ID", "portfolio")
                .withProperty("CLOUDFLARE_AI_GATEWAY_TOKEN", "test-only-gateway");
        new YamlPropertySourceLoader().load("gateway", new ClassPathResource("application-ai-gateway.yml"))
                .forEach(environment.getPropertySources()::addLast);
        assertThat(Binder.get(environment).bindOrCreate("spring.ai.openai", OpenAiCommonProperties.class).getBaseUrl())
                .isEqualTo("https://gateway.ai.cloudflare.com/v1/account/portfolio/openai");

        List<Request> requests = new CopyOnWriteArrayList<>();
        var finishReason = new AtomicReference<>("stop");
        var embeddingData = new AtomicReference<>("""
                {"object":"embedding","index":0,"embedding":[1.0,0.0]}
                """);
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/v1/account/portfolio/openai/", exchange -> {
            var headers = exchange.getRequestHeaders();
            String path = exchange.getRequestURI().getPath();
            requests.add(new Request(path, headers.getFirst("Authorization"),
                    headers.getFirst("cf-aig-authorization"), headers.getFirst("cf-aig-skip-cache"),
                    headers.getFirst("cf-aig-collect-log-payload"), headers.getFirst("cf-aig-max-attempts")));
            exchange.getRequestBody().readAllBytes();
            String response = path.endsWith("/embeddings") ? """
                    {"object":"list","model":"text-embedding-3-large","data":[%s],
                      "usage":{"prompt_tokens":2,"total_tokens":2}}
                    """.formatted(embeddingData.get()) : """
                    {"id":"chat-test","object":"chat.completion","created":1,"model":"gpt-5-mini",
                     "choices":[{"index":0,"finish_reason":"%s","message":{"role":"assistant",
                       "content":"{\\"answerable\\":false,\\"paragraphs\\":[]}"}}],
                     "usage":{"prompt_tokens":2,"completion_tokens":2,"total_tokens":4}}
                    """.formatted(finishReason.get());
            byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            try (var output = exchange.getResponseBody()) {
                output.write(bytes);
            }
        });
        server.start();
        try (var context = new SpringApplicationBuilder(KnowledgeApiApplication.class)
                .web(WebApplicationType.NONE).profiles("openai", "ai-gateway").run(
                        "--spring.ai.openai.base-url=http://127.0.0.1:" + server.getAddress().getPort()
                                + "/v1/account/portfolio/openai",
                        "--OPENAI_API_KEY=test-only-openai", "--CLOUDFLARE_ACCOUNT_ID=account",
                        "--CLOUDFLARE_AI_GATEWAY_ID=portfolio", "--CLOUDFLARE_AI_GATEWAY_TOKEN=test-only-gateway",
                        "--OPENAI_EMBEDDING_DIMENSIONS=2", "--knowledge.source.sync-on-startup=false")) {
            assertThat(context.getBean(EmbeddingPort.class).embed(List.of("알림 재처리")))
                    .containsExactly(List.of(1f, 0f));
            assertThat(context.getBean(AnswerGenerationPort.class).generate("알림 복구", List.of()).answerable())
                    .isFalse();
            assertThat(requests).extracting(Request::path).containsExactly(
                    "/v1/account/portfolio/openai/embeddings", "/v1/account/portfolio/openai/chat/completions");
            assertThat(requests).allSatisfy(request -> {
                assertThat(request.providerKey()).isEqualTo("Bearer test-only-openai");
                assertThat(request.gatewayKey()).isEqualTo("Bearer test-only-gateway");
                assertThat(request.skipCache()).isEqualTo("true");
                assertThat(request.collectPayload()).isEqualTo("false");
                assertThat(request.maxAttempts()).isEqualTo("1");
            });
            embeddingData.set("""
                    {"object":"embedding","index":1,"embedding":[0.0,1.0]},
                    {"object":"embedding","index":0,"embedding":[1.0,0.0]}
                    """);
            assertThat(context.getBean(EmbeddingPort.class).embed(List.of("첫 문단", "두 번째 문단")))
                    .containsExactly(List.of(1f, 0f), List.of(0f, 1f));
            assertThat(requests).hasSize(3);
            for (String indexField : List.of("\"index\":0,", "\"index\":-1,", "\"index\":2,", "")) {
                embeddingData.set("""
                        {"object":"embedding","index":0,"embedding":[1.0,0.0]},
                        {"object":"embedding",%s"embedding":[0.0,1.0]}
                        """.formatted(indexField));
                int previousRequests = requests.size();
                assertThatThrownBy(() -> context.getBean(EmbeddingPort.class).embed(List.of("첫 문단", "두 번째 문단")))
                        .isInstanceOf(EmbeddingUnavailableException.class);
                assertThat(requests).hasSize(previousRequests + 1);
            }
            for (String reason : List.of("length", "content_filter")) {
                finishReason.set(reason);
                int previousRequests = requests.size();
                assertThatThrownBy(() -> context.getBean(AnswerGenerationPort.class).generate("알림 복구", List.of()))
                        .isInstanceOf(AnswerGenerationUnavailableException.class)
                        .hasMessageContaining("정상 종료");
                assertThat(requests).hasSize(previousRequests + 1);
            }
        } finally {
            server.stop(0);
        }
    }

    private record Request(String path, String providerKey, String gatewayKey, String skipCache,
                           String collectPayload, String maxAttempts) {
    }
}
