package com.ljkhyeong.portfolio.knowledge.api;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

// 웹 계층에서 HTTP 상태, 오류 코드와 헤더를 함께 전달하는 RFC 9457 오류.
public class KnowledgeApiException extends ErrorResponseException {

    public KnowledgeApiException(HttpStatus status, String code, String detail) {
        super(status, body(status, code, detail), null);
    }

    public KnowledgeApiException retryAfter(long seconds) {
        getHeaders().set(HttpHeaders.RETRY_AFTER, Long.toString(seconds));
        return this;
    }

    private static ProblemDetail body(HttpStatus status, String code, String detail) {
        ProblemDetail body = ProblemDetail.forStatusAndDetail(status, detail);
        body.setProperty("code", code);
        return body;
    }
}
