package com.ljkhyeong.portfolio.knowledge.api;

public class SyncForbiddenException extends RuntimeException {

    public SyncForbiddenException() {
        super("공개 지식 문서 동기화 권한이 없습니다.");
    }
}
