package com.ljkhyeong.portfolio.knowledge.api;

import java.util.List;
import java.util.Locale;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import org.springframework.stereotype.Component;

@Component
public class ResponseMapper {

    private static final int SNIPPET_LENGTH = 280;

    public List<SearchResultResponse> toSearchResults(List<SearchHit> hits, String query) {
        return hits.stream().map(hit -> toSearchResult(hit, query)).toList();
    }

    public SearchResultResponse toSearchResult(SearchHit hit, String query) {
        KnowledgeChunk chunk = hit.chunk();
        return new SearchResultResponse(
                chunk.chunkId(),
                chunk.projectId(),
                chunk.projectName(),
                chunk.serviceId(),
                chunk.documentType(),
                chunk.title(),
                chunk.heading(),
                snippet(chunk.content(), query),
                chunk.sourceUrl(),
                chunk.route(),
                hit.score()
        );
    }

    public String snippet(String content, String query) {
        if (content.length() <= SNIPPET_LENGTH) {
            return content;
        }
        String lowerContent = content.toLowerCase(Locale.ROOT);
        int match = -1;
        for (String term : query.toLowerCase(Locale.ROOT).split("\\s+")) {
            if (term.length() < 2) {
                continue;
            }
            match = lowerContent.indexOf(term);
            if (match >= 0) {
                break;
            }
        }
        int start = match < 0 ? 0 : Math.max(0, match - SNIPPET_LENGTH / 3);
        int end = Math.min(content.length(), start + SNIPPET_LENGTH);
        String value = content.substring(start, end).strip();
        return (start > 0 ? "…" : "") + value + (end < content.length() ? "…" : "");
    }
}
