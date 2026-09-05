package com.ljkhyeong.portfolio.knowledge.api;

import java.util.LinkedHashMap;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch.ElasticsearchAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(new ApiErrorResponse(
                "INVALID_REQUEST",
                "요청 값을 확인해 주세요.",
                Map.copyOf(fieldErrors)
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(new ApiErrorResponse(
                "INVALID_REQUEST",
                exception.getMessage(),
                Map.of()
        ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableMessage(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(new ApiErrorResponse(
                "INVALID_REQUEST",
                "JSON 요청 형식을 확인해 주세요.",
                Map.of()
        ));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleUnsupportedMethod(HttpRequestMethodNotSupportedException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .headers(exception.getHeaders())
                .body(new ApiErrorResponse(
                        "METHOD_NOT_ALLOWED",
                        "지원하지 않는 HTTP 메소드입니다.",
                        Map.of()
                ));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .headers(exception.getHeaders())
                .body(new ApiErrorResponse(
                        "UNSUPPORTED_MEDIA_TYPE",
                        "Content-Type은 application/json을 사용해 주세요.",
                        Map.of()
                ));
    }

    @ExceptionHandler(ElasticsearchAccessException.class)
    public ResponseEntity<ApiErrorResponse> handleElasticsearch(ElasticsearchAccessException exception) {
        log.error("검색 저장소 요청 실패", exception);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ApiErrorResponse(
                "SEARCH_UNAVAILABLE",
                "현재 문서 검색을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.",
                Map.of()
        ));
    }

    @ExceptionHandler(SyncForbiddenException.class)
    public ResponseEntity<ApiErrorResponse> handleSyncForbidden(SyncForbiddenException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiErrorResponse(
                "SYNC_FORBIDDEN",
                exception.getMessage(),
                Map.of()
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception exception) {
        if (exception instanceof ErrorResponse errorResponse) {
            boolean notFound = errorResponse.getStatusCode().value() == HttpStatus.NOT_FOUND.value();
            return ResponseEntity.status(errorResponse.getStatusCode())
                    .headers(errorResponse.getHeaders())
                    .body(new ApiErrorResponse(
                            notFound ? "NOT_FOUND" : "HTTP_ERROR",
                            notFound ? "요청한 주소를 찾을 수 없습니다." : "요청을 처리하지 못했습니다.",
                            Map.of()
                    ));
        }
        log.error("예상하지 못한 Knowledge API 오류", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiErrorResponse(
                "INTERNAL_ERROR",
                "요청을 처리하지 못했습니다.",
                Map.of()
        ));
    }
}
