package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

public record KnowledgeFilter(
        List<String> projectIds,
        List<String> serviceIds,
        List<String> documentTypes
) {

    public KnowledgeFilter(List<String> projectIds, List<String> documentTypes) {
        this(projectIds, List.of(), documentTypes);
    }

    public KnowledgeFilter {
        projectIds = List.copyOf(projectIds);
        serviceIds = List.copyOf(serviceIds);
        documentTypes = List.copyOf(documentTypes);
    }
}
