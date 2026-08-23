package com.ljkhyeong.portfolio.knowledge.search;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import org.springframework.stereotype.Component;

@Component
public class RrfRanker {

    public List<SearchHit> merge(List<List<SearchHit>> rankings, int rrfK, int limit) {
        Map<String, RankedHit> merged = new LinkedHashMap<>();
        for (List<SearchHit> ranking : rankings) {
            for (int index = 0; index < ranking.size(); index++) {
                SearchHit hit = ranking.get(index);
                double contribution = 1.0 / (rrfK + index + 1);
                merged.compute(hit.chunk().chunkId(), (chunkId, existing) -> {
                    if (existing == null) {
                        return new RankedHit(hit, contribution);
                    }
                    return new RankedHit(existing.hit(), existing.score() + contribution);
                });
            }
        }

        return merged.values().stream()
                .sorted(Comparator.comparingDouble(RankedHit::score).reversed()
                        .thenComparing(value -> value.hit().chunk().chunkId()))
                .limit(limit)
                .map(value -> new SearchHit(value.hit().chunk(), value.score()))
                .toList();
    }

    private record RankedHit(SearchHit hit, double score) {
    }
}
