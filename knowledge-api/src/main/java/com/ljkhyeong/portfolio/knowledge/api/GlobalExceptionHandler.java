package com.ljkhyeong.portfolio.knowledge.api;

import java.util.LinkedHashMap;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.sync.KnowledgeSyncInProgressException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

// 오류 응답은 RFC 9457 ProblemDetail로 반환한다. Spring MVC 표준 오류의 한글 detail은 messages.properties에 둔다.
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage())
        );
        exception.getBody().setProperty("fieldErrors", fieldErrors);
        return super.handleMethodArgumentNotValid(exception, headers, status, request);
    }

    @ExceptionHandler(KnowledgeIndexAccessException.class)
    public ResponseEntity<Object> handleIndexAccess(KnowledgeIndexAccessException exception, WebRequest request) {
        log.error("검색 저장소 요청 실패", exception);
        return problem(
                exception,
                HttpStatus.SERVICE_UNAVAILABLE,
                "SEARCH_UNAVAILABLE",
                "현재 문서 검색을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.",
                request
        );
    }

    @ExceptionHandler(KnowledgeSyncInProgressException.class)
    public ResponseEntity<Object> handleSyncInProgress(KnowledgeSyncInProgressException exception, WebRequest request) {
        return problem(exception, HttpStatus.CONFLICT, "SYNC_IN_PROGRESS", exception.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpected(Exception exception, WebRequest request) {
        // 상위 클래스 목록에 없는 Spring HTTP 예외도 상태와 헤더를 유지한다.
        if (exception instanceof ErrorResponse errorResponse) {
            return handleExceptionInternal(
                    exception,
                    null,
                    errorResponse.getHeaders(),
                    errorResponse.getStatusCode(),
                    request
            );
        }
        return problem(exception, HttpStatus.INTERNAL_SERVER_ERROR, null, "요청을 처리하지 못했습니다.", request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception,
            Object body,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        if (status.value() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
            log.error("예상하지 못한 Knowledge API 오류", exception);
        }
        return super.handleExceptionInternal(exception, body, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> createResponseEntity(
            Object body,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        // 모든 오류 응답에 code를 둔다. 도메인 코드가 없으면 HTTP 상태 이름을 쓴다.
        if (body instanceof ProblemDetail problem
                && (problem.getProperties() == null || !problem.getProperties().containsKey("code"))) {
            HttpStatus resolved = HttpStatus.resolve(status.value());
            problem.setProperty("code", resolved != null ? resolved.name() : "HTTP_ERROR");
        }
        return super.createResponseEntity(body, headers, status, request);
    }

    private ResponseEntity<Object> problem(
            Exception exception,
            HttpStatus status,
            String code,
            String detail,
            WebRequest request
    ) {
        ProblemDetail body = ProblemDetail.forStatusAndDetail(status, detail);
        if (code != null) {
            body.setProperty("code", code);
        }
        return handleExceptionInternal(exception, body, new HttpHeaders(), status, request);
    }
}
