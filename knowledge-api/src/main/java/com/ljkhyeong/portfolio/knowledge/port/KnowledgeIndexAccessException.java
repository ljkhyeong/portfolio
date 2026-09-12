package com.ljkhyeong.portfolio.knowledge.port;

public class KnowledgeIndexAccessException extends RuntimeException {

    public KnowledgeIndexAccessException(String message) {
        super(message);
    }

    public KnowledgeIndexAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
