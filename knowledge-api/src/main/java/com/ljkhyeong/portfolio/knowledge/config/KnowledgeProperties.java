package com.ljkhyeong.portfolio.knowledge.config;

import java.util.List;
import java.util.Locale;

import com.ljkhyeong.portfolio.knowledge.util.Hashing;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
        @Valid @DefaultValue HumanVerification humanVerification,
        @DefaultValue Cors cors
) {

    public record Source(
            @DefaultValue("classpath:knowledge/portfolio.json") String location,
            @DefaultValue("false") boolean syncOnStartup,
            @DefaultValue("") String syncKey,
            @DefaultValue("false") boolean allowEmpty,
            @Positive @Max(300) @DefaultValue("3") int connectTimeoutSeconds,
            @Positive @Max(300) @DefaultValue("10") int readTimeoutSeconds,
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
            return Hashing.sha256("chunking-v1|max=%d|overlap=%d".formatted(
                    maxChunkCharacters, overlapCharacters
            ));
        }
    }

    public record Elasticsearch(
            @DefaultValue("http://localhost:9200") String baseUrl,
            @DefaultValue("portfolio-knowledge-disabled-v3") String indexName,
            @DefaultValue("") String username,
            @DefaultValue("") String password,
            @PositiveOrZero @DefaultValue("3") int connectTimeoutSeconds,
            @PositiveOrZero @DefaultValue("10") int readTimeoutSeconds
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
            @PositiveOrZero @DefaultValue("128") int answerCacheMaxEntries,
            @DefaultValue("30") int globalAnswersPerMinute,
            @DefaultValue("5") int clientAnswersPerMinute,
            @DefaultValue("300") int globalSearchesPerMinute,
            @DefaultValue("30") int clientSearchesPerMinute,
            @DefaultValue("100") int maxClientBucketsPerMinute,
            @DefaultValue("false") boolean trustProxyHeaders
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
