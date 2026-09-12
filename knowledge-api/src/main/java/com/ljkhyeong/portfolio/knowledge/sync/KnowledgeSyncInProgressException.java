package com.ljkhyeong.portfolio.knowledge.sync;

public class KnowledgeSyncInProgressException extends IllegalStateException {

    public KnowledgeSyncInProgressException() {
        super("공개 자료 동기화가 이미 실행 중입니다. 완료 후 자료 상태를 확인해 주세요.");
    }
}
