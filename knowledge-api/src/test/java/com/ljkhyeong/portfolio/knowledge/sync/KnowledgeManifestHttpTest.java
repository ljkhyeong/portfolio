package com.ljkhyeong.portfolio.knowledge.sync;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.document;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketTimeoutException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import com.ljkhyeong.portfolio.knowledge.index.KnowledgeIndexInitializer;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import tools.jackson.databind.json.JsonMapper;

class KnowledgeManifestHttpTest {

    private final JsonMapper mapper = new JsonMapper();
    private final LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
    private final CountDownLatch release = new CountDownLatch(1);
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private HttpServer server;
    private String location;

    @BeforeEach
    void setUp() throws IOException {
        validator.afterPropertiesSet();
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.setExecutor(executor);
        server.start();
        location = "http://127.0.0.1:" + server.getAddress().getPort() + "/portfolio.json";
    }

    @AfterEach
    void tearDown() {
        release.countDown();
        server.stop(0);
        executor.shutdownNow();
        validator.close();
    }

    @Test
    void 원격_자료가_용량_상한과_같아도_공개_문서를_읽는다() {
        byte[] body = mapper.writeValueAsBytes(Map.of(
                "schemaVersion", "1.0", "sourceRevision", "sha256:http",
                "documents", List.of(document("http-document", "sha256:body"))
        ));
        server.createContext("/portfolio.json", exchange -> respond(exchange, body, body.length));

        var manifest = loader("source.max-bytes", String.valueOf(body.length)).load(location);

        assertThat(manifest.sourceRevision()).isEqualTo("sha256:http");
        assertThat(manifest.documents()).extracting(value -> value.documentId())
                .containsExactly("http-document");
    }

    @Test
    void 리다이렉트_대상으로_이동하지_않는다() {
        var redirected = new AtomicInteger();
        server.createContext("/portfolio.json", exchange -> {
            exchange.getResponseHeaders().set("Location", "/other.json");
            exchange.sendResponseHeaders(302, -1);
            exchange.close();
        });
        server.createContext("/other.json", exchange -> {
            redirected.incrementAndGet();
            exchange.sendResponseHeaders(500, -1);
            exchange.close();
        });

        assertThatThrownBy(() -> loader().load(location))
                .isInstanceOf(IllegalArgumentException.class)
                .hasRootCauseMessage("공개 자료 서버의 HTTP 응답: 302");
        assertThat(redirected).hasValue(0);
    }

    @ParameterizedTest
    @ValueSource(ints = {204, 206, 404, 503})
    void 전체_자료를_반환하지_않은_HTTP_응답은_거부한다(int status) {
        server.createContext("/portfolio.json", exchange -> {
            exchange.sendResponseHeaders(status, -1);
            exchange.close();
        });

        assertThatThrownBy(() -> loader().load(location))
                .isInstanceOf(IllegalArgumentException.class)
                .hasRootCauseMessage("공개 자료 서버의 HTTP 응답: " + status);
    }

    @ParameterizedTest
    @ValueSource(booleans = {false, true})
    void Content_Length_유무와_관계없이_용량을_제한한다(boolean chunked) {
        byte[] body = new byte[65];
        server.createContext("/portfolio.json", exchange -> respond(exchange, body, chunked ? 0 : body.length));

        assertThatThrownBy(() -> loader("source.max-bytes", "64").load(location))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("용량 제한");
    }

    @ParameterizedTest
    @ValueSource(booleans = {false, true})
    @Timeout(10)
    void 응답_헤더와_본문_읽기에_대기_시간을_적용한다(boolean startedBody) {
        server.createContext("/portfolio.json", exchange -> {
            try (exchange) {
                if (startedBody) {
                    exchange.sendResponseHeaders(200, 0);
                    exchange.getResponseBody().write('{');
                    exchange.getResponseBody().flush();
                }
                try {
                    release.await(8, TimeUnit.SECONDS);
                } catch (InterruptedException exception) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        assertThatThrownBy(() -> loader("source.read-timeout-seconds", "1").load(location))
                .isInstanceOf(IllegalArgumentException.class)
                .hasRootCauseInstanceOf(SocketTimeoutException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {"missing", "null", "visibility"})
    void 빈_목록을_허용해도_잘못된_원격_자료는_색인_변경_전에_중단한다(String failure) {
        String documentsField = switch (failure) {
            case "missing" -> "";
            case "null" -> ",\"documents\":null";
            default -> ",\"documents\":[" + mapper.writeValueAsString(document("doc-1", "sha256:body"))
                    + ",{\"documentId\":\"doc-2\"}]";
        };
        byte[] body = ("{\"schemaVersion\":\"1.0\",\"sourceRevision\":\"sha256:http\""
                + documentsField + "}").getBytes(java.nio.charset.StandardCharsets.UTF_8);
        server.createContext("/portfolio.json", exchange -> respond(exchange, body, body.length));
        var properties = knowledgeProperties("source.location", location, "source.allow-empty", "true");
        var index = mock(KnowledgeIndexPort.class);
        when(index.findIndexedSourceHashes()).thenReturn(Map.of("doc-1", "sha256:source", "doc-2", "sha256:source"));
        var embeddings = mock(EmbeddingPort.class);
        var chunker = mock(KnowledgeChunker.class);
        var initializer = mock(KnowledgeIndexInitializer.class);
        var service = new KnowledgeSyncService(properties,
                new KnowledgeManifestLoader(new DefaultResourceLoader(), mapper, validator, properties),
                chunker, embeddings, initializer, index);

        assertThatThrownBy(service::syncConfiguredManifest).isInstanceOf(IllegalArgumentException.class);
        verifyNoInteractions(index, embeddings, chunker, initializer);
    }

    private KnowledgeManifestLoader loader(String... settings) {
        return new KnowledgeManifestLoader(new DefaultResourceLoader(), mapper, validator,
                knowledgeProperties(settings));
    }

    private void respond(HttpExchange exchange, byte[] body, long length) throws IOException {
        try (exchange) {
            exchange.sendResponseHeaders(200, length);
            exchange.getResponseBody().write(body);
        }
    }
}
