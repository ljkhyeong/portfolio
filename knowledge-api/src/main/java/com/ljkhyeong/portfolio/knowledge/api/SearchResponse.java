package com.ljkhyeong.portfolio.knowledge.api;

import java.util.List;

public record SearchResponse(
        String query,
        int total,
        List<SearchResultResponse> results
) {
}
