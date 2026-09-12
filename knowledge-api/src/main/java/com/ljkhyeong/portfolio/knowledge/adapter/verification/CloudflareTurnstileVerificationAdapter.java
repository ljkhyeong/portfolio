package com.ljkhyeong.portfolio.knowledge.adapter.verification;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

public class CloudflareTurnstileVerificationAdapter implements HumanVerificationPort {

    private static final int MAX_ATTEMPTS = 2;
    private static final Set<String> TOKEN_ERRORS = Set.of(
            "missing-input-response", "invalid-input-response", "timeout-or-duplicate"
    );

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

        // 일회용 토큰 재검증은 같은 멱등 키로 한 번만 재시도한다.
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
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
                if (List.of("internal-error").equals(errors) && attempt < MAX_ATTEMPTS) {
                    continue;
                }
                throw new HumanVerificationUnavailableException("Turnstile 서버 오류 또는 연동 설정을 확인해야 합니다.");
            } catch (RestClientException exception) {
                boolean retryable = exception instanceof ResourceAccessException
                        || exception instanceof RestClientResponseException responseException
                        && responseException.getStatusCode().is5xxServerError();
                if (!retryable || attempt == MAX_ATTEMPTS) {
                    throw new HumanVerificationUnavailableException("Turnstile 검증 요청에 실패했습니다.", exception);
                }
            }
        }
        throw new HumanVerificationUnavailableException("Turnstile 검증 재시도 횟수를 초과했습니다.");
    }

    private record SiteverifyResponse(
            Boolean success, String hostname, String action,
            @JsonProperty("error-codes") List<String> errorCodes
    ) {
    }
}
