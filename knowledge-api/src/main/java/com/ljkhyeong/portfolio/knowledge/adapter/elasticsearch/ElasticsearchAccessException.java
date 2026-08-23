package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

public class ElasticsearchAccessException extends RuntimeException {

    public ElasticsearchAccessException(String message) {
        super(message);
    }

    public ElasticsearchAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
