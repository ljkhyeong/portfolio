package com.ljkhyeong.portfolio.knowledge.domain;

public record SearchHit(KnowledgeChunk chunk, double score, String matchedPassage) {

    public SearchHit(KnowledgeChunk chunk, double score) {
        this(chunk, score, null);
    }
}
