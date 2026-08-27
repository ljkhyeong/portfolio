package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

public record KnowledgeFilter(List<String> projectIds, List<String> documentTypes) {

    public KnowledgeFilter {
        projectIds = List.copyOf(projectIds);
        documentTypes = List.copyOf(documentTypes);
    }
}
