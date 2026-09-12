package com.ljkhyeong.portfolio.knowledge.adapter.verification;

import java.util.UUID;

import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

public class CloudflareTurnstileVerificationAdapter implements HumanVerificationPort {

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
            SiteverifyResponse response = restClient.post()
                    .uri("/turnstile/v0/siteverify")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(SiteverifyResponse.class);
            if (response == null) {
                throw new HumanVerificationUnavailableException("Turnstile 검증 응답이 비어 있습니다.");
            }
            return new Result(Boolean.TRUE.equals(response.success()), response.hostname(), response.action());
        } catch (RestClientException exception) {
            throw new HumanVerificationUnavailableException("Turnstile 검증 요청에 실패했습니다.", exception);
        }
    }

    private record SiteverifyResponse(Boolean success, String hostname, String action) {
    }
}
