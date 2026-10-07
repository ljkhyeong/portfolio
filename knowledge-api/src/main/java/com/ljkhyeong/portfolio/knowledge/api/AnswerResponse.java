package com.ljkhyeong.portfolio.knowledge.api;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeAnswer;

public record AnswerResponse(
        KnowledgeAnswer.Status status,
        String answer,
        List<CitationResponse> citations,
        List<SearchResultResponse> results
) {

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
