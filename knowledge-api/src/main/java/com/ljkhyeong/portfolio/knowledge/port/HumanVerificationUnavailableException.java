package com.ljkhyeong.portfolio.knowledge.port;

public class HumanVerificationUnavailableException extends RuntimeException {

    public HumanVerificationUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }

    public HumanVerificationUnavailableException(String message) {
        super(message);
    }
}
