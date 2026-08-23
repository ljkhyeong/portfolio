package com.ljkhyeong.portfolio.knowledge.api;

import java.util.List;

public record AnswerResponse(
        String question,
        AnswerStatus status,
        String answer,
        List<CitationResponse> citations,
        List<SearchResultResponse> results
) {

    public enum AnswerStatus {
        GENERATED,
        INSUFFICIENT_EVIDENCE,
        GENERATION_UNAVAILABLE
    }

    public record CitationResponse(
            String chunkId,
            String title,
            String heading,
            String sourceUrl,
            String route,
            String excerpt
    ) {
    }
}
