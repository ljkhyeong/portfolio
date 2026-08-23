package com.ljkhyeong.portfolio.knowledge.port;

public class AnswerGenerationUnavailableException extends RuntimeException {

    public AnswerGenerationUnavailableException(String message) {
        super(message);
    }

    public AnswerGenerationUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
