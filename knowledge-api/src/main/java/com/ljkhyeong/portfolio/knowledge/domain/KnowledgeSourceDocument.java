package com.ljkhyeong.portfolio.knowledge.domain;

import jakarta.validation.constraints.NotBlank;

public record KnowledgeSourceDocument(
        String schemaVersion,
        String sourceRevision,
        @NotBlank String documentId,
        @NotBlank String projectId,
        @NotBlank String projectName,
        String serviceId,
        @NotBlank String documentType,
        @NotBlank String title,
        String heading,
        @NotBlank String content,
        String sourceUrl,
        String route,
        String visibility,
        String evidenceLevel,
        @NotBlank String sourceHash,
        @NotBlank String contentHash
) {
}
