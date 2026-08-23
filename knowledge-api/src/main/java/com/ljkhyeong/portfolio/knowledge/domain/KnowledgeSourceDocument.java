package com.ljkhyeong.portfolio.knowledge.domain;

public record KnowledgeSourceDocument(
        String schemaVersion,
        String sourceRevision,
        String documentId,
        String projectId,
        String projectName,
        String serviceId,
        String documentType,
        String title,
        String heading,
        String content,
        String sourceUrl,
        String route,
        String visibility,
        String evidenceLevel,
        String sourceHash,
        String contentHash
) {
}
