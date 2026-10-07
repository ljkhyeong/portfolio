package com.ljkhyeong.portfolio.knowledge.search;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.hit;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import org.junit.jupiter.api.Test;

class RrfRankerTest {

    private final RrfRanker ranker = new RrfRanker();

    @Test
    void 두_검색에_모두_포함된_청크를_우선한다() {
        SearchHit first = hit(chunk("chunk-a", "doc-a"));
        SearchHit second = hit(chunk("chunk-b", "doc-b"));
        SearchHit third = hit(chunk("chunk-c", "doc-c"));

        List<SearchHit> result = ranker.merge(
                List.of(List.of(first, second), List.of(third, first)),
                60
        );

        assertThat(result).extracting(hit -> hit.chunk().chunkId())
                .containsExactly("chunk-a", "chunk-c", "chunk-b");
    }

    @Test
    void 순위_합이_같으면_청크_ID_순서로_정렬한다() {
        List<SearchHit> result = ranker.merge(
                List.of(List.of(hit(chunk("chunk-b", "doc-b"))), List.of(hit(chunk("chunk-a", "doc-a")))),
                60
        );

        assertThat(result).extracting(hit -> hit.chunk().chunkId()).containsExactly("chunk-a", "chunk-b");
    }

    @Test
    void 같은_문서의_문단과_일치_구간을_순위_통합_후에도_유지한다() {
        SearchHit first = new SearchHit(chunk("doc-a#000", "doc-a"), "키워드 일치 문단");
        SearchHit second = hit(chunk("doc-a#001", "doc-a"));
        SearchHit third = hit(chunk("doc-b#000", "doc-b"));

        List<SearchHit> result = ranker.merge(
                List.of(List.of(first, second, third), List.of(second, first, third)), 60);

        assertThat(result).extracting(hit -> hit.chunk().documentId()).containsExactly("doc-a", "doc-a", "doc-b");
        assertThat(result.getFirst().chunk().chunkId()).isEqualTo("doc-a#000");
        assertThat(result.getFirst().matchedPassage()).isEqualTo("키워드 일치 문단");
    }
}
