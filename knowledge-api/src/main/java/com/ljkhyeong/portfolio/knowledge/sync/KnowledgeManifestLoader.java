package com.ljkhyeong.portfolio.knowledge.sync;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import jakarta.validation.Validator;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import tools.jackson.databind.ObjectMapper;

@Component
public class KnowledgeManifestLoader {

    private static final String SUPPORTED_SCHEMA_VERSION = "1.0";

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public KnowledgeManifestLoader(ResourceLoader resourceLoader, ObjectMapper objectMapper, Validator validator) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    public KnowledgeManifest load(String location) {
        Resource resource = resourceLoader.getResource(location);

        try (InputStream inputStream = resource.getInputStream()) {
            KnowledgeManifest manifest = objectMapper.readValue(inputStream, KnowledgeManifest.class);
            return validateAndKeepPublicDocuments(manifest);
        } catch (IOException exception) {
            throw new IllegalArgumentException("공개 지식 문서 목록을 읽지 못했습니다: " + location, exception);
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
