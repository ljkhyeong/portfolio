package com.ljkhyeong.portfolio.knowledge.api;

import java.util.List;

public record SearchResponse(
        int total,
        List<SearchResultResponse> results
) {
}
