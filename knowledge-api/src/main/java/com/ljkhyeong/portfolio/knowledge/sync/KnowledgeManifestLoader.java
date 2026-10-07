package com.ljkhyeong.portfolio.knowledge.sync;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeManifest;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import jakarta.validation.Validator;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.ObjectReader;
import tools.jackson.databind.cfg.EnumFeature;

@Component
public class KnowledgeManifestLoader {

    private static final String SUPPORTED_SCHEMA_VERSION = "1.0";

    private final ResourceLoader resourceLoader;
    private final ObjectReader manifestReader;
    private final Validator validator;
    private final int maxBytes;

    public KnowledgeManifestLoader(ResourceLoader resourceLoader, ObjectMapper objectMapper, Validator validator,
                                   KnowledgeProperties properties) {
        this.resourceLoader = resourceLoader;
        // 숫자 순번을 공개 범위로 해석하지 않도록 문자열 값만 허용한다.
        this.manifestReader = objectMapper.readerFor(KnowledgeManifest.class)
                .with(EnumFeature.FAIL_ON_NUMBERS_FOR_ENUMS);
        this.validator = validator;
        this.maxBytes = properties.source().maxBytes();
    }

    public KnowledgeManifest load(String location) {
        KnowledgeManifest manifest;
        try (InputStream inputStream = resourceLoader.getResource(location).getInputStream()) {
            byte[] bytes = inputStream.readNBytes(maxBytes + 1);
            if (bytes.length > maxBytes) {
                throw new IllegalArgumentException("공개 지식 문서 목록이 읽기 용량 제한을 초과했습니다.");
            }
            manifest = manifestReader.readValue(bytes);
        } catch (IOException exception) {
            throw new IllegalArgumentException("공개 지식 문서 목록을 읽지 못했습니다.", exception);
        } catch (JacksonException exception) {
            throw new IllegalArgumentException("공개 지식 문서 목록의 형식이 올바르지 않습니다: " + path(exception), exception);
        }
        if (manifest == null) {
            throw new IllegalArgumentException("공개 지식 문서 목록이 비어 있습니다.");
        }
        return keepValidPublicDocuments(manifest);
    }

    private static String path(JacksonException exception) {
        return exception.getPath().stream()
                .map(reference -> reference.getPropertyName() == null
                        ? "[" + reference.getIndex() + "]" : "." + reference.getPropertyName())
                .collect(Collectors.joining())
                .replaceFirst("^\\.", "");
    }

    private KnowledgeManifest keepValidPublicDocuments(KnowledgeManifest manifest) {
        if (!SUPPORTED_SCHEMA_VERSION.equals(manifest.schemaVersion())) {
            throw new IllegalArgumentException("지원하지 않는 공개 지식 문서 스키마입니다: " + manifest.schemaVersion());
        }
        if (!StringUtils.hasText(manifest.sourceRevision())) {
            throw new IllegalArgumentException("sourceRevision이 필요합니다.");
        }

        List<KnowledgeSourceDocument> publicDocuments = manifest.documents().stream()
                .filter(document -> document.visibility() == KnowledgeSourceDocument.Visibility.PUBLIC)
                .peek(this::validateDocument)
                .toList();

        Set<String> documentIds = new HashSet<>();
        for (KnowledgeSourceDocument document : publicDocuments) {
            if (!documentIds.add(document.documentId())) {
                throw new IllegalArgumentException("중복 documentId가 있습니다: " + document.documentId());
            }
        }

        return new KnowledgeManifest(manifest.schemaVersion(), manifest.sourceRevision(), publicDocuments);
    }

    private void validateDocument(KnowledgeSourceDocument document) {
        var violations = validator.validate(document);
        if (!violations.isEmpty()) {
            String fields = violations.stream()
                    .map(violation -> violation.getPropertyPath().toString())
                    .sorted()
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException("공개 문서의 필수값이 없습니다: " + fields);
        }
        if (!StringUtils.hasText(document.sourceUrl()) && !StringUtils.hasText(document.route())) {
            throw new IllegalArgumentException(document.documentId() + " 문서에는 sourceUrl 또는 route가 필요합니다.");
        }
    }
}
