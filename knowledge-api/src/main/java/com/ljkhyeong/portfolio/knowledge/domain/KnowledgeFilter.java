package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

public record KnowledgeFilter(List<String> projectIds, List<String> documentTypes) {

    public KnowledgeFilter {
        projectIds = projectIds == null ? List.of() : List.copyOf(projectIds);
        documentTypes = documentTypes == null ? List.of() : List.copyOf(documentTypes);
    }
}
