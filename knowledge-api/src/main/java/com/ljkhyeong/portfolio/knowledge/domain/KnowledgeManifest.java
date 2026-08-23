package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

public record KnowledgeManifest(
        String schemaVersion,
        String sourceRevision,
        List<String> documentTypes,
        List<String> projectIds,
        List<KnowledgeSourceDocument> documents
) {

    public KnowledgeManifest {
        documentTypes = documentTypes == null ? List.of() : List.copyOf(documentTypes);
        projectIds = projectIds == null ? List.of() : List.copyOf(projectIds);
        documents = documents == null ? List.of() : List.copyOf(documents);
    }
}
