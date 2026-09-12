package com.ljkhyeong.portfolio.knowledge.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.springframework.util.StringUtils;

public final class SecretMatcher {

    private SecretMatcher() {
    }

    public static boolean matches(String configuredSecret, String suppliedSecret) {
        if (!StringUtils.hasText(configuredSecret) || !StringUtils.hasText(suppliedSecret)) {
            return false;
        }
        return MessageDigest.isEqual(
                configuredSecret.getBytes(StandardCharsets.UTF_8),
                suppliedSecret.getBytes(StandardCharsets.UTF_8)
        );
    }
}
