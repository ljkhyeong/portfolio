package com.ljkhyeong.portfolio.knowledge.verification;

import java.util.Locale;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import com.ljkhyeong.portfolio.knowledge.util.SecretMatcher;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class KnowledgeHumanVerificationService {

    public static final String EXPECTED_ACTION = "knowledge_answer";
    private static final int MAX_TOKEN_LENGTH = 2048;

    private final HumanVerificationPort verificationPort;
    private final KnowledgeProperties properties;

    public KnowledgeHumanVerificationService(
            HumanVerificationPort verificationPort,
            KnowledgeProperties properties
    ) {
        this.verificationPort = verificationPort;
        this.properties = properties;
    }

    public Decision verify(String token, String operatorKey) {
        KnowledgeProperties.HumanVerification configuration = properties.humanVerification();
        if (!configuration.enabled()) {
            return Decision.NOT_REQUIRED;
        }
        if (SecretMatcher.matches(properties.source().syncKey(), operatorKey)) {
            return Decision.VERIFIED;
        }
        if (!StringUtils.hasText(token) || token.length() > MAX_TOKEN_LENGTH || !token.equals(token.strip())) {
            return Decision.REJECTED;
        }

        try {
            HumanVerificationPort.Result result = verificationPort.verify(token);
            if (!result.successful()
                    || !EXPECTED_ACTION.equals(result.action())
                    || !configuration.expectedHostnames().contains(normalizeHostname(result.hostname()))) {
                return Decision.REJECTED;
            }
            return Decision.VERIFIED;
        } catch (HumanVerificationUnavailableException exception) {
            return Decision.UNAVAILABLE;
        }
    }

    private String normalizeHostname(String hostname) {
        return hostname == null ? "" : hostname.strip().toLowerCase(Locale.ROOT);
    }

    public enum Decision {
        NOT_REQUIRED,
        VERIFIED,
        REJECTED,
        UNAVAILABLE
    }
}
