package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

public record KnowledgeAnswer(
        Status status,
        String answer,
        List<SearchHit> citations,
        List<SearchHit> results
) {

    public KnowledgeAnswer {
        citations = List.copyOf(citations);
        results = List.copyOf(results);
    }

    public static KnowledgeAnswer withoutAnswer(Status status, List<SearchHit> results) {
        return new KnowledgeAnswer(status, null, List.of(), results);
    }

    public enum Status {
        GENERATED,
        INSUFFICIENT_EVIDENCE,
        GENERATION_UNAVAILABLE
    }
}
