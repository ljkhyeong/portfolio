package com.ljkhyeong.portfolio.knowledge.adapter.verification;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

public class CloudflareTurnstileVerificationAdapter implements HumanVerificationPort {

    private static final Set<String> TOKEN_ERRORS = Set.of(
            "missing-input-response", "invalid-input-response", "timeout-or-duplicate"
    );
    // 일회용 토큰 재검증은 연결 오류, HTTP 5xx와 internal-error만 같은 멱등 키로 즉시 한 번 재시도한다.
    private static final RetryTemplate RETRY = new RetryTemplate(RetryPolicy.builder()
            .maxRetries(1)
            .delay(Duration.ZERO)
            .predicate(CloudflareTurnstileVerificationAdapter::isTransient)
            .build());

    private final RestClient restClient;
    private final String secretKey;

    public CloudflareTurnstileVerificationAdapter(RestClient restClient, String secretKey) {
        this.restClient = restClient;
        this.secretKey = secretKey;
    }

    @Override
    public Result verify(String token) {
        var form = new LinkedMultiValueMap<String, String>();
        form.add("secret", secretKey);
        form.add("response", token);
        form.add("idempotency_key", UUID.randomUUID().toString());
        try {
            return RETRY.invoke(() -> siteverify(form));
        } catch (RestClientException exception) {
            throw new HumanVerificationUnavailableException("Turnstile 검증 요청에 실패했습니다.", exception);
        }
    }

    private Result siteverify(MultiValueMap<String, String> form) {
        SiteverifyResponse response = restClient.post()
                .uri("/turnstile/v0/siteverify")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(SiteverifyResponse.class);
        if (response == null || response.success() == null) {
            throw new HumanVerificationUnavailableException("Turnstile 검증 응답 형식이 올바르지 않습니다.");
        }
        if (response.success()) {
            return new Result(true, response.hostname(), response.action());
        }
        List<String> errors = response.errorCodes();
        if (errors != null && !errors.isEmpty()
                && errors.stream().allMatch(error -> error != null && TOKEN_ERRORS.contains(error))) {
            return new Result(false, response.hostname(), response.action());
        }
        if (List.of("internal-error").equals(errors)) {
            throw new TurnstileInternalError();
        }
        throw new HumanVerificationUnavailableException("Turnstile 서버 오류 또는 연동 설정을 확인해야 합니다.");
    }

    private static boolean isTransient(Throwable exception) {
        return exception instanceof TurnstileInternalError
                || exception instanceof ResourceAccessException
                || exception instanceof RestClientResponseException response
                && response.getStatusCode().is5xxServerError();
    }

    private static final class TurnstileInternalError extends HumanVerificationUnavailableException {

        private TurnstileInternalError() {
            super("Turnstile 서버 오류 또는 연동 설정을 확인해야 합니다.");
        }
    }

    private record SiteverifyResponse(
            Boolean success, String hostname, String action,
            @JsonProperty("error-codes") List<String> errorCodes
    ) {
    }
}
