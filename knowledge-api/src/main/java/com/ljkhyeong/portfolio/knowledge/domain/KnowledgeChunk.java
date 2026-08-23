package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

public record KnowledgeChunk(
        String chunkId,
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
        String evidenceLevel,
        String sourceRevision,
        String sourceHash,
        String contentHash,
        String chunkHash,
        String embeddingModelId,
        List<Float> embedding
) {

    public KnowledgeChunk withEmbedding(String modelId, List<Float> vector) {
        return new KnowledgeChunk(
                chunkId,
                documentId,
                projectId,
                projectName,
                serviceId,
                documentType,
                title,
                heading,
                content,
                sourceUrl,
                route,
                evidenceLevel,
                sourceRevision,
                sourceHash,
                contentHash,
                chunkHash,
                modelId,
                List.copyOf(vector)
        );
    }
}
