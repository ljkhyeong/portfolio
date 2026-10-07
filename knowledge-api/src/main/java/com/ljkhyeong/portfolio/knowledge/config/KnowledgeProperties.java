package com.ljkhyeong.portfolio.knowledge.config;

import java.util.List;
import java.util.Locale;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "knowledge")
public record KnowledgeProperties(
        @Valid @DefaultValue Source source,
        @Valid @DefaultValue Elasticsearch elasticsearch,
        @Valid @DefaultValue Search search,
        @Valid @DefaultValue Ai ai,
        @DefaultValue RateLimit rateLimit,
        @Valid @DefaultValue HumanVerification humanVerification,
        @DefaultValue Cors cors
) {

    public record Source(
            // 이미지에 포함된 자료만 읽는다. 원격 URL과 파일 경로는 기동 단계에서 거부한다.
            @Pattern(regexp = "classpath:.+") @DefaultValue("classpath:knowledge/portfolio.json") String location,
            @DefaultValue("false") boolean syncOnStartup,
            @DefaultValue("") String syncKey,
            @Positive @Max(67108864) @DefaultValue("8388608") int maxBytes,
            @Min(200) @DefaultValue("1200") int maxChunkCharacters,
            @PositiveOrZero @DefaultValue("150") int overlapCharacters
    ) {
        public Source {
            if (overlapCharacters >= maxChunkCharacters) {
                throw new IllegalArgumentException("청크 겹침 범위는 청크 크기보다 작아야 합니다.");
            }
        }

        public String chunkingFingerprint() {
            return "chunking-v1|max=%d|overlap=%d".formatted(maxChunkCharacters, overlapCharacters);
        }
    }

    public record Elasticsearch(
            // 검색 alias 이름이다. 실제 색인은 동기화마다 이름 뒤에 생성 시각을 붙여 새로 만든다.
            @Pattern(regexp = "[a-z0-9][a-z0-9_-]*") @DefaultValue("portfolio-knowledge") String indexName
    ) {
    }

    public record Search(
            @Positive @DefaultValue("10") int defaultLimit,
            @Positive @DefaultValue("20") int maxLimit,
            @Positive @DefaultValue("40") int candidateLimit,
            @PositiveOrZero @DefaultValue("60") int rrfK
    ) {
    }

    public enum AiProvider {
        DISABLED, OPENAI, OLLAMA
    }

    public record Ai(
            @DefaultValue("disabled") AiProvider provider,
            @DefaultValue("disabled") String embeddingModelId,
            @Positive @DefaultValue("1024") int embeddingDimensions,
            @Positive @DefaultValue("6") int answerContextLimit,
            @PositiveOrZero @DefaultValue("120") int answerCacheTtlSeconds,
            @PositiveOrZero @DefaultValue("128") int answerCacheMaxEntries
    ) {
    }

    // 0 이하 값은 해당 한도를 적용하지 않는다.
    public record RateLimit(
            @DefaultValue("30") int globalAnswersPerMinute,
            @DefaultValue("5") int clientAnswersPerMinute,
            @DefaultValue("300") int globalSearchesPerMinute,
            @DefaultValue("30") int clientSearchesPerMinute,
            @DefaultValue("100") int maxClientsPerMinute
    ) {
    }

    public record HumanVerification(
            @DefaultValue("false") boolean enabled,
            @DefaultValue("") String secretKey,
            @DefaultValue("ljkportfolio.netlify.app") List<String> expectedHostnames,
            @Positive @DefaultValue("3") int connectTimeoutSeconds,
            @Positive @DefaultValue("5") int readTimeoutSeconds
    ) {
        public HumanVerification {
            expectedHostnames = expectedHostnames == null
                    ? List.of()
                    : expectedHostnames.stream()
                            .map(String::strip)
                            .filter(hostname -> !hostname.isEmpty())
                            .map(hostname -> hostname.toLowerCase(Locale.ROOT))
                            .distinct()
                            .toList();
            if (enabled && secretKey.isBlank()) {
                throw new IllegalArgumentException("Turnstile을 사용하려면 비밀 키가 필요합니다.");
            }
            if (enabled && expectedHostnames.isEmpty()) {
                throw new IllegalArgumentException("Turnstile을 사용하려면 허용 호스트가 필요합니다.");
            }
        }
    }

    public record Cors(
            @DefaultValue({"http://localhost:5173", "https://ljkportfolio.netlify.app"}) List<String> allowedOrigins
    ) {
    }
}
