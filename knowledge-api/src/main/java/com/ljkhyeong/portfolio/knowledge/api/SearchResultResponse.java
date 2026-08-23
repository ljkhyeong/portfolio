package com.ljkhyeong.portfolio.knowledge.api;

public record SearchResultResponse(
        String chunkId,
        String projectId,
        String projectName,
        String serviceId,
        String documentType,
        String title,
        String heading,
        String snippet,
        String sourceUrl,
        String route,
        double score
) {
}
