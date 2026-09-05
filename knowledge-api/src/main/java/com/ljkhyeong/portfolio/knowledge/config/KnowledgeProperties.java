package com.ljkhyeong.portfolio.knowledge.config;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.util.Hashing;
import jakarta.validation.Valid;
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
        @DefaultValue Cors cors
) {

    public record Source(
            @DefaultValue("classpath:knowledge/portfolio.json") String location,
            @DefaultValue("false") boolean syncOnStartup,
            @DefaultValue("") String syncKey,
            @DefaultValue("false") boolean allowEmpty,
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
            @DefaultValue("portfolio-knowledge-disabled-v2") String indexName,
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
            @DefaultValue("30") int globalAnswersPerMinute,
            @DefaultValue("5") int clientAnswersPerMinute,
            @DefaultValue("300") int globalSearchesPerMinute,
            @DefaultValue("30") int clientSearchesPerMinute,
            @DefaultValue("100") int maxClientBucketsPerMinute,
            @DefaultValue("false") boolean trustProxyHeaders
    ) {
    }

    public record Cors(
            @DefaultValue({"http://localhost:5173", "https://ljkportfolio.netlify.app"}) List<String> allowedOrigins
    ) {
    }
}
