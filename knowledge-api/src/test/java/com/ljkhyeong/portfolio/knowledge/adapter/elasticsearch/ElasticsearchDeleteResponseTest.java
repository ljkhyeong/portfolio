package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

class ElasticsearchDeleteResponseTest {

    @Test
    void 삭제_응답에_타임아웃_충돌_실패가_없으면_완료로_처리한다() {
        assertThatCode(() -> ElasticsearchKnowledgeRepository.verifyDeleteByQueryResponse(Map.of(
                "timed_out", false,
                "version_conflicts", 0,
                "failures", List.of()
        ))).doesNotThrowAnyException();
    }

    @Test
    void 삭제_응답에_타임아웃이_있으면_실패로_처리한다() {
        assertDeleteFailure(Map.of("timed_out", true, "version_conflicts", 0, "failures", List.of()));
    }

    @Test
    void 삭제_응답에_버전_충돌이_있으면_실패로_처리한다() {
        assertDeleteFailure(Map.of("timed_out", false, "version_conflicts", 1, "failures", List.of()));
    }

    @Test
    void 삭제_응답에_실패_목록이_있으면_실패로_처리한다() {
        assertDeleteFailure(Map.of(
                "timed_out", false,
                "version_conflicts", 0,
                "failures", List.of(Map.of("reason", "shard failure"))
        ));
    }

    private void assertDeleteFailure(Map<String, Object> response) {
        assertThatThrownBy(() -> ElasticsearchKnowledgeRepository.verifyDeleteByQueryResponse(response))
                .isInstanceOf(ElasticsearchAccessException.class)
                .hasMessageContaining("문서 삭제가 완료되지 않았습니다");
    }
}
