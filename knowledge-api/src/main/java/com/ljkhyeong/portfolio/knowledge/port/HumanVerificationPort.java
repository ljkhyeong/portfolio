package com.ljkhyeong.portfolio.knowledge.port;

public interface HumanVerificationPort {

    Result verify(String token);

    record Result(boolean successful, String hostname, String action) {
    }
}
