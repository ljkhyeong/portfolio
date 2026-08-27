package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ElasticsearchDeleteResponseTest {

    @Test
    void 삭제_응답에_타임아웃_충돌_실패가_없으면_완료로_처리한다() {
        assertThatCode(() -> ElasticsearchKnowledgeRepository.verifyDeleteByQueryResponse(false, 0, 0))
                .doesNotThrowAnyException();
    }

    @Test
    void 삭제_응답에_타임아웃이_있으면_실패로_처리한다() {
        assertDeleteFailure(true, 0, 0);
    }

    @Test
    void 삭제_응답에_버전_충돌이_있으면_실패로_처리한다() {
        assertDeleteFailure(false, 1, 0);
    }

    @Test
    void 삭제_응답에_실패_목록이_있으면_실패로_처리한다() {
        assertDeleteFailure(false, 0, 1);
    }

    private void assertDeleteFailure(boolean timedOut, long versionConflicts, int failureCount) {
        assertThatThrownBy(() -> ElasticsearchKnowledgeRepository.verifyDeleteByQueryResponse(
                timedOut,
                versionConflicts,
                failureCount
        ))
                .isInstanceOf(ElasticsearchAccessException.class)
                .hasMessageContaining("문서 삭제가 완료되지 않았습니다");
    }
}
