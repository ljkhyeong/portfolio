package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static org.assertj.core.api.Assertions.assertThat;

import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import org.junit.jupiter.api.Test;

class ResponseMapperTest {

    private final ResponseMapper mapper = new ResponseMapper();

    @Test
    void 제목과_강조_코드_링크를_읽을_수_있는_문구로_바꾼다() {
        String markdown = "# 재처리 정책\n\n**실패한 작업**은 `Outbox`에 보관합니다. "
                + "[설계 문서](https://example.com/very-long-document-url)를 확인하세요.\n\n"
                + "- 완료한 작업은 제외합니다.";

        String snippet = mapper.snippet(new SearchHit(chunk("a", "doc", markdown), 1));

        assertThat(snippet).contains("재처리 정책", "실패한 작업", "Outbox", "설계 문서를 확인하세요.", "완료한 작업은 제외합니다.")
                .doesNotContain("#", "**", "`", "https://", "[", "\n", "- 완료");
    }

    @Test
    void 검색기가_찾은_일치_문단을_본문_도입부보다_우선한다() {
        String passage = "**중복 알림**은 이벤트 ID로 걸러냅니다.";
        SearchHit hit = new SearchHit(chunk("a", "doc", "소개 문구. ".repeat(100) + passage), 1, passage);

        assertThat(mapper.toSearchResult(hit).snippet()).isEqualTo("중복 알림은 이벤트 ID로 걸러냅니다.");
    }

    @Test
    void 원문의_표_구분선은_제거하고_셀_내용은_유지한다() {
        String content = "질의 매개변수:\n\n| 이름 | 필수 | 의미 |\n|---|---|---|\n"
                + "| `weekStart` | 예 | 조회할 주간 |\n| `zoneId` | 예 | 시간대 |";

        String snippet = mapper.snippet(new SearchHit(chunk("a", "doc", content), 1));

        assertThat(snippet).contains("weekStart", "조회할 주간", "zoneId", "시간대").doesNotContain("---", "`", "\n");
    }

    @Test
    void 검색기가_문장_중간까지_반환한_구간은_생략을_표시한다() {
        String passage = "동시 요청에도 보고서는 한 건만";
        SearchHit hit = new SearchHit(chunk("a", "doc", passage + " 저장합니다."), 1, passage);

        assertThat(mapper.snippet(hit)).isEqualTo(passage + "…");
    }

    @Test
    void 긴_발췌문은_완성된_문장_끝에서_줄인다() {
        String sentence = "실패한 작업은 DB에서 다시 읽어 처리합니다. ";
        String content = sentence.repeat(20);

        String snippet = mapper.snippet(new SearchHit(chunk("a", "doc", content), 1));

        assertThat(snippet).hasSizeLessThanOrEqualTo(281).endsWith("처리합니다.…");
        assertThat(content).startsWith(snippet.substring(0, snippet.length() - 1));
    }

    @Test
    void 긴_단일_문장도_단어_중간에서_끊지_않는다() {
        String content = "재처리대상 ".repeat(100);

        String snippet = mapper.snippet(new SearchHit(chunk("a", "doc", content), 1));

        assertThat(snippet).hasSizeLessThanOrEqualTo(281).endsWith("재처리대상…");
    }

    @Test
    void 일치_문단이_없는_짧은_본문은_그대로_표시한다() {
        String content = "전송 실패 시 DB에 저장한 이벤트를 다시 처리합니다.";

        assertThat(mapper.snippet(new SearchHit(chunk("a", "doc", content), 1))).isEqualTo(content);
    }
}
