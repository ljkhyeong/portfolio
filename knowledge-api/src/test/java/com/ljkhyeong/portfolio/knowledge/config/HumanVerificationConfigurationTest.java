package com.ljkhyeong.portfolio.knowledge.config;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.http.client.support.HttpRequestWrapper;
import org.springframework.web.client.RestClient;

class HumanVerificationConfigurationTest {

    private final AtomicInteger siteverifyRequests = new AtomicInteger();
    private final AtomicInteger redirectedRequests = new AtomicInteger();
    private final CountDownLatch release = new CountDownLatch(1);
    private ExecutorService executor;
    private HttpServer server;

    @BeforeEach
    void setUp() throws IOException {
        executor = Executors.newVirtualThreadPerTaskExecutor();
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.setExecutor(executor);
        server.createContext("/moved", exchange -> {
            redirectedRequests.incrementAndGet();
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
        });
        server.start();
    }

    @AfterEach
    void tearDown() {
        release.countDown();
        server.stop(0);
        executor.close();
    }

    @Test
    void 자동_설정_빌더를_써도_Siteverify_리다이렉트를_따르지_않는다() {
        server.createContext("/turnstile/v0/siteverify", exchange -> {
            siteverifyRequests.incrementAndGet();
            exchange.getRequestBody().readAllBytes();
            exchange.getResponseHeaders().set("Location", localUri("/moved").toString());
            exchange.sendResponseHeaders(307, -1);
            exchange.close();
        });

        runner().run(context -> {
            assertThatThrownBy(() -> context.getBean(HumanVerificationPort.class).verify("browser-token"))
                    .isInstanceOf(HumanVerificationUnavailableException.class);
            assertThat(siteverifyRequests).hasValue(1);
            assertThat(redirectedRequests).hasValue(0);
        });
    }

    @Test
    void Siteverify_응답이_읽기_제한을_넘으면_재시도하지_않고_검증_불가로_종료한다() {
        server.createContext("/turnstile/v0/siteverify", exchange -> {
            siteverifyRequests.incrementAndGet();
            try {
                release.await(10, TimeUnit.SECONDS);
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
            }
            exchange.close();
        });

        runner("turnstile.read-timeout-seconds", "1").run(context -> {
            long started = System.nanoTime();
            assertThatThrownBy(() -> context.getBean(HumanVerificationPort.class).verify("browser-token"))
                    .isInstanceOf(HumanVerificationUnavailableException.class);
            // POST 응답 대기 초과는 본문 읽기 오류로 처리돼 대기 시간을 늘리는 재시도를 하지 않는다.
            assertThat(siteverifyRequests).hasValue(1);
            assertThat(TimeUnit.NANOSECONDS.toSeconds(System.nanoTime() - started)).isLessThan(3);
        });
    }

    // 고정된 Cloudflare 주소를 로컬 대역 서버로 바꾸되, 설정이 지정한 요청 팩토리는 그대로 사용한다.
    private ApplicationContextRunner runner(String... properties) {
        RestClient.Builder builder = RestClient.builder().requestInterceptor((request, body, execution) ->
                execution.execute(new HttpRequestWrapper(request) {
                    @Override
                    public URI getURI() {
                        return localUri(request.getURI().getRawPath());
                    }
                }, body));
        return new ApplicationContextRunner()
                .withUserConfiguration(HumanVerificationConfiguration.class)
                .withBean(KnowledgeProperties.class, () -> knowledgeProperties(properties))
                .withBean(RestClient.Builder.class, () -> builder);
    }

    private URI localUri(String path) {
        return URI.create("http://127.0.0.1:" + server.getAddress().getPort() + path);
    }
}
