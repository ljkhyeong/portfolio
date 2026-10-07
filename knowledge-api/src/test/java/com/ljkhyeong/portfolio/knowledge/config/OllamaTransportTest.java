package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import com.ljkhyeong.portfolio.knowledge.KnowledgeApiApplication;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ReactorClientHttpRequestFactoryBuilder;

class OllamaTransportTest {

    @Test
    void Ollama의_배열_순서를_Spring_AI_순번으로_유지한다() throws Exception {
        var requests = new AtomicInteger();
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/api/embed", exchange -> {
            requests.incrementAndGet();
            exchange.getRequestBody().readAllBytes();
            byte[] bytes = """
                    {"model":"bge-m3","embeddings":[[1.0,0.0],[0.0,1.0]],
                     "total_duration":1,"load_duration":1,"prompt_eval_count":2}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            try (var output = exchange.getResponseBody()) {
                output.write(bytes);
            }
        });
        server.start();
        try (var context = new SpringApplicationBuilder(KnowledgeApiApplication.class)
                .web(WebApplicationType.NONE).profiles("ollama").run(
                        "--OLLAMA_URL=http://127.0.0.1:" + server.getAddress().getPort(),
                        "--OLLAMA_EMBEDDING_DIMENSIONS=2", "--knowledge.source.sync-on-startup=false")) {
            assertThat(context.getBean(EmbeddingPort.class).embed(List.of("첫 문단", "두 번째 문단")))
                    .containsExactly(List.of(1f, 0f), List.of(0f, 1f));
            assertThat(requests.get()).isEqualTo(1);
            assertThat(context.getBean(ClientHttpRequestFactoryBuilder.class))
                    .isInstanceOf(ReactorClientHttpRequestFactoryBuilder.class);
        } finally {
            server.stop(0);
        }
    }

    // Spring AI 기본 재시도(최대 10회, 2초부터 지수 증가)가 남아 있으면 제한 시간 안에 끝나지 않는다.
    @Test
    @Timeout(value = 20, unit = TimeUnit.SECONDS)
    void Ollama_답변_장애는_재시도하지_않고_생성_불가로_처리한다() throws Exception {
        var requests = new AtomicInteger();
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/api/chat", exchange -> {
            requests.incrementAndGet();
            exchange.getRequestBody().readAllBytes();
            byte[] bytes = "{\"error\":\"model is loading\"}".getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(503, bytes.length);
            try (var output = exchange.getResponseBody()) {
                output.write(bytes);
            }
        });
        server.start();
        try (var context = new SpringApplicationBuilder(KnowledgeApiApplication.class)
                .web(WebApplicationType.NONE).profiles("ollama").run(
                        "--OLLAMA_URL=http://127.0.0.1:" + server.getAddress().getPort(),
                        "--knowledge.source.sync-on-startup=false")) {
            assertThatThrownBy(() -> context.getBean(AnswerGenerationPort.class).generate("알림 복구", List.of()))
                    .isInstanceOf(AnswerGenerationUnavailableException.class);
            assertThat(requests.get()).isEqualTo(1);
        } finally {
            server.stop(0);
        }
    }
}
