package com.ljkhyeong.portfolio.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketTimeoutException;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.elasticsearch.autoconfigure.ElasticsearchClientAutoConfiguration;
import org.springframework.boot.elasticsearch.autoconfigure.ElasticsearchRestClientAutoConfiguration;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

class ElasticsearchConfigurationTest {

    private final AtomicInteger redirectedRequests = new AtomicInteger();
    private HttpServer server;
    private ApplicationContextRunner contextRunner;

    @BeforeEach
    void setUp() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.setExecutor(Executors.newCachedThreadPool());
        server.createContext("/stalled", exchange -> {
            try {
                Thread.sleep(5_000);
            } catch (InterruptedException ignored) {
                Thread.currentThread().interrupt();
            }
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
        });
        server.createContext("/moved", exchange -> {
            exchange.getResponseHeaders().set("Location", "/target");
            exchange.sendResponseHeaders(302, -1);
            exchange.close();
        });
        server.createContext("/target", exchange -> {
            redirectedRequests.incrementAndGet();
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
        });
        server.start();
        contextRunner = new ApplicationContextRunner()
                .withConfiguration(AutoConfigurations.of(
                        ElasticsearchRestClientAutoConfiguration.class, ElasticsearchClientAutoConfiguration.class))
                .withUserConfiguration(ElasticsearchConfiguration.class)
                .withPropertyValues("spring.elasticsearch.uris=http://127.0.0.1:" + server.getAddress().getPort());
    }

    @AfterEach
    void tearDown() {
        server.stop(0);
    }

    @Test
    void 응답이_멈춘_요청도_socket_timeout_안에_실패한다() {
        contextRunner.withPropertyValues(
                "spring.elasticsearch.path-prefix=/stalled",
                "spring.elasticsearch.socket-timeout=500ms"
        ).run(context -> {
            long started = System.nanoTime();
            assertThatThrownBy(() -> context.getBean(ElasticsearchClient.class).info())
                    .isInstanceOf(SocketTimeoutException.class);
            assertThat((System.nanoTime() - started) / 1_000_000).isLessThan(3_000);
        });
    }

    @Test
    void 리다이렉트를_따라가지_않는다() {
        contextRunner.withPropertyValues("spring.elasticsearch.path-prefix=/moved").run(context -> {
            assertThatThrownBy(() -> context.getBean(ElasticsearchClient.class).info())
                    .isInstanceOf(IOException.class);
            assertThat(redirectedRequests).hasValue(0);
        });
    }
}
