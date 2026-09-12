package com.ljkhyeong.portfolio.knowledge.sync;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URLConnection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import jakarta.validation.Validator;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.JsonNode;
import tools.jackson.core.JacksonException;

@Component
public class KnowledgeManifestLoader {

    private static final String SUPPORTED_SCHEMA_VERSION = "1.0";

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final Validator validator;
    private final KnowledgeProperties.Source configuration;

    public KnowledgeManifestLoader(ResourceLoader resourceLoader, ObjectMapper objectMapper, Validator validator,
                                   KnowledgeProperties properties) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
        this.validator = validator;
        this.configuration = properties.source();
    }

    public KnowledgeManifest load(String location) {
        Resource resource = resourceLoader.getResource(location);

        try {
            if (resource instanceof UrlResource) {
                return loadUrl(resource);
            }
            try (InputStream inputStream = resource.getInputStream()) {
                return readManifest(inputStream);
            }
        } catch (IOException | JacksonException exception) {
            throw new IllegalArgumentException("공개 지식 문서 목록을 읽지 못했습니다.", exception);
        }
    }

    private KnowledgeManifest loadUrl(Resource resource) throws IOException {
        URLConnection connection = resource.getURL().openConnection();
        connection.setConnectTimeout(configuration.connectTimeoutSeconds() * 1000);
        connection.setReadTimeout(configuration.readTimeoutSeconds() * 1000);
        connection.setUseCaches(false);
        HttpURLConnection http = connection instanceof HttpURLConnection value ? value : null;
        try {
            if (http != null) {
                http.setInstanceFollowRedirects(false);
                if (http.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    throw new IOException("공개 자료 서버의 HTTP 응답: " + http.getResponseCode());
                }
            }
            if (connection.getContentLengthLong() > configuration.maxBytes()) {
                throw new IllegalArgumentException("공개 지식 문서 목록이 읽기 용량 제한을 초과했습니다.");
            }
            try (InputStream inputStream = connection.getInputStream()) {
                return readManifest(inputStream);
            }
        } finally {
            if (http != null) {
                http.disconnect();
            }
        }
    }

    private KnowledgeManifest readManifest(InputStream inputStream) throws IOException {
        byte[] bytes = inputStream.readNBytes(configuration.maxBytes() + 1);
        if (bytes.length > configuration.maxBytes()) {
            throw new IllegalArgumentException("공개 지식 문서 목록이 읽기 용량 제한을 초과했습니다.");
        }
        JsonNode root = objectMapper.readTree(bytes);
        validateManifestShape(root);
        return validateAndKeepPublicDocuments(objectMapper.treeToValue(root, KnowledgeManifest.class));
    }

    private void validateManifestShape(JsonNode root) {
        if (root == null || !root.isObject() || !root.path("documents").isArray()) {
            throw new IllegalArgumentException("공개 지식 문서의 documents는 배열이어야 합니다. 빈 목록은 []로 명시하세요.");
        }
        JsonNode documents = root.path("documents");
        for (int index = 0; index < documents.size(); index++) {
            JsonNode document = documents.get(index);
            if (!document.isObject()) {
                throw new IllegalArgumentException("documents[" + index + "]는 JSON 객체여야 합니다.");
            }
            JsonNode visibility = document.path("visibility");
            if (!visibility.isString()
                    || !("public".equals(visibility.asString()) || "private".equals(visibility.asString()))) {
                throw new IllegalArgumentException("documents[" + index + "].visibility는 public 또는 private여야 합니다.");
            }
        }
    }

    private KnowledgeManifest validateAndKeepPublicDocuments(KnowledgeManifest manifest) {
        if (!SUPPORTED_SCHEMA_VERSION.equals(manifest.schemaVersion())) {
            throw new IllegalArgumentException("지원하지 않는 공개 지식 문서 스키마입니다: " + manifest.schemaVersion());
        }
        if (!StringUtils.hasText(manifest.sourceRevision())) {
            throw new IllegalArgumentException("sourceRevision이 필요합니다.");
        }

        List<KnowledgeSourceDocument> publicDocuments = manifest.documents().stream()
                .filter(document -> "public".equals(document.visibility()))
                .peek(this::validateDocument)
                .toList();

        Set<String> documentIds = new HashSet<>();
        for (KnowledgeSourceDocument document : publicDocuments) {
            if (!documentIds.add(document.documentId())) {
                throw new IllegalArgumentException("중복 documentId가 있습니다: " + document.documentId());
            }
        }

        return new KnowledgeManifest(
                manifest.schemaVersion(),
                manifest.sourceRevision(),
                manifest.documentTypes(),
                manifest.projectIds(),
                publicDocuments
        );
    }

    private void validateDocument(KnowledgeSourceDocument document) {
        var violations = validator.validate(document);
        if (!violations.isEmpty()) {
            String fields = violations.stream()
                    .map(violation -> violation.getPropertyPath().toString())
                    .sorted()
                    .collect(java.util.stream.Collectors.joining(", "));
            throw new IllegalArgumentException("공개 문서의 필수값이 없습니다: " + fields);
        }
        if (!StringUtils.hasText(document.sourceUrl()) && !StringUtils.hasText(document.route())) {
            throw new IllegalArgumentException(document.documentId() + " 문서에는 sourceUrl 또는 route가 필요합니다.");
        }
    }
}
