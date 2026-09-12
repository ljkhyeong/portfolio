package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import com.ljkhyeong.portfolio.knowledge.KnowledgeApiApplication;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;

class OllamaEmbeddingTransportTest {

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
        } finally {
            server.stop(0);
        }
    }
}
