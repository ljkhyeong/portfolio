package com.ljkhyeong.portfolio.knowledge.search;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import org.junit.jupiter.api.Test;

class RrfRankerTest {

    private final RrfRanker ranker = new RrfRanker();

    @Test
    void 두_검색에_모두_포함된_청크를_우선한다() {
        SearchHit first = new SearchHit(chunk("chunk-a", "doc-a"), 10);
        SearchHit second = new SearchHit(chunk("chunk-b", "doc-b"), 9);
        SearchHit third = new SearchHit(chunk("chunk-c", "doc-c"), 0.9);

        List<SearchHit> result = ranker.merge(
                List.of(List.of(first, second), List.of(third, first)),
                60,
                3
        );

        assertThat(result).extracting(hit -> hit.chunk().chunkId())
                .containsExactly("chunk-a", "chunk-c", "chunk-b");
        assertThat(result.getFirst().score()).isEqualTo((1.0 / 61) + (1.0 / 62));
    }

    @Test
    void 같은_문서의_문단이_검색_결과를_중복_차지하지_않는다() {
        SearchHit first = new SearchHit(chunk("doc-a#000", "doc-a"), 10);
        SearchHit second = new SearchHit(chunk("doc-a#001", "doc-a"), 9);
        SearchHit third = new SearchHit(chunk("doc-b#000", "doc-b"), 8);

        List<SearchHit> result = ranker.merge(
                List.of(List.of(first, second, third), List.of(second, first, third)), 60, 2);

        assertThat(result).extracting(hit -> hit.chunk().documentId()).containsExactly("doc-a", "doc-b");
        assertThat(result.getFirst().chunk().chunkId()).isEqualTo("doc-a#000");
    }
}
