package com.ljkhyeong.portfolio.knowledge.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.ljkhyeong.portfolio.knowledge.util.Hashing;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "knowledge")
public class KnowledgeProperties {

    private final Source source = new Source();
    private final Elasticsearch elasticsearch = new Elasticsearch();
    private final Search search = new Search();
    private final Ai ai = new Ai();
    private final Cors cors = new Cors();

    public Source getSource() {
        return source;
    }

    public Elasticsearch getElasticsearch() {
        return elasticsearch;
    }

    public Search getSearch() {
        return search;
    }

    public Ai getAi() {
        return ai;
    }

    public Cors getCors() {
        return cors;
    }

    public static class Source {

        private String location = "classpath:knowledge/portfolio.json";
        private boolean syncOnStartup;
        private String syncKey = "";
        private boolean allowEmpty;
        private int maxChunkCharacters = 1200;
        private int overlapCharacters = 150;

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public boolean isSyncOnStartup() {
            return syncOnStartup;
        }

        public void setSyncOnStartup(boolean syncOnStartup) {
            this.syncOnStartup = syncOnStartup;
        }

        public String getSyncKey() {
            return syncKey;
        }

        public void setSyncKey(String syncKey) {
            this.syncKey = syncKey;
        }

        public boolean isAllowEmpty() {
            return allowEmpty;
        }

        public void setAllowEmpty(boolean allowEmpty) {
            this.allowEmpty = allowEmpty;
        }

        public int getMaxChunkCharacters() {
            return maxChunkCharacters;
        }

        public void setMaxChunkCharacters(int maxChunkCharacters) {
            this.maxChunkCharacters = maxChunkCharacters;
        }

        public int getOverlapCharacters() {
            return overlapCharacters;
        }

        public void setOverlapCharacters(int overlapCharacters) {
            this.overlapCharacters = overlapCharacters;
        }

        public String chunkingFingerprint() {
            return Hashing.sha256("chunking-v1|max=%d|overlap=%d".formatted(
                    maxChunkCharacters,
                    overlapCharacters
            ));
        }
    }

    public static class Elasticsearch {

        private String baseUrl = "http://localhost:9200";
        private String indexName = "portfolio-knowledge-disabled-v2";
        private String username = "";
        private String password = "";
        private int connectTimeoutSeconds = 3;
        private int readTimeoutSeconds = 10;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getIndexName() {
            return indexName;
        }

        public void setIndexName(String indexName) {
            this.indexName = indexName;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public int getConnectTimeoutSeconds() {
            return connectTimeoutSeconds;
        }

        public void setConnectTimeoutSeconds(int connectTimeoutSeconds) {
            this.connectTimeoutSeconds = connectTimeoutSeconds;
        }

        public int getReadTimeoutSeconds() {
            return readTimeoutSeconds;
        }

        public void setReadTimeoutSeconds(int readTimeoutSeconds) {
            this.readTimeoutSeconds = readTimeoutSeconds;
        }
    }

    public static class Search {

        private int defaultLimit = 10;
        private int maxLimit = 20;
        private int candidateLimit = 40;
        private int rrfK = 60;

        public int getDefaultLimit() {
            return defaultLimit;
        }

        public void setDefaultLimit(int defaultLimit) {
            this.defaultLimit = defaultLimit;
        }

        public int getMaxLimit() {
            return maxLimit;
        }

        public void setMaxLimit(int maxLimit) {
            this.maxLimit = maxLimit;
        }

        public int getCandidateLimit() {
            return candidateLimit;
        }

        public void setCandidateLimit(int candidateLimit) {
            this.candidateLimit = candidateLimit;
        }

        public int getRrfK() {
            return rrfK;
        }

        public void setRrfK(int rrfK) {
            this.rrfK = rrfK;
        }

    }

    public static class Ai {

        private static final Set<String> SUPPORTED_PROVIDERS = Set.of("disabled", "openai", "ollama");

        private String provider = "disabled";
        private String embeddingModelId = "disabled";
        private int embeddingDimensions = 1024;
        private int answerContextLimit = 6;
        private int globalAnswersPerMinute = 30;
        private int clientAnswersPerMinute = 5;
        private int globalSearchesPerMinute = 300;
        private int clientSearchesPerMinute = 30;
        private int maxClientBucketsPerMinute = 100;
        private boolean trustProxyHeaders;

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            String normalized = provider == null ? "" : provider.strip().toLowerCase(Locale.ROOT);
            if (!SUPPORTED_PROVIDERS.contains(normalized)) {
                throw new IllegalArgumentException("AI provider는 disabled, openai, ollama 중 하나여야 합니다.");
            }
            this.provider = normalized;
        }

        public String getEmbeddingModelId() {
            return embeddingModelId;
        }

        public void setEmbeddingModelId(String embeddingModelId) {
            this.embeddingModelId = embeddingModelId;
        }

        public int getEmbeddingDimensions() {
            return embeddingDimensions;
        }

        public void setEmbeddingDimensions(int embeddingDimensions) {
            this.embeddingDimensions = embeddingDimensions;
        }

        public int getAnswerContextLimit() {
            return answerContextLimit;
        }

        public void setAnswerContextLimit(int answerContextLimit) {
            this.answerContextLimit = answerContextLimit;
        }

        public int getGlobalAnswersPerMinute() {
            return globalAnswersPerMinute;
        }

        public void setGlobalAnswersPerMinute(int globalAnswersPerMinute) {
            this.globalAnswersPerMinute = globalAnswersPerMinute;
        }

        public int getClientAnswersPerMinute() {
            return clientAnswersPerMinute;
        }

        public void setClientAnswersPerMinute(int clientAnswersPerMinute) {
            this.clientAnswersPerMinute = clientAnswersPerMinute;
        }

        public int getGlobalSearchesPerMinute() {
            return globalSearchesPerMinute;
        }

        public void setGlobalSearchesPerMinute(int globalSearchesPerMinute) {
            this.globalSearchesPerMinute = globalSearchesPerMinute;
        }

        public int getClientSearchesPerMinute() {
            return clientSearchesPerMinute;
        }

        public void setClientSearchesPerMinute(int clientSearchesPerMinute) {
            this.clientSearchesPerMinute = clientSearchesPerMinute;
        }

        public int getMaxClientBucketsPerMinute() {
            return maxClientBucketsPerMinute;
        }

        public void setMaxClientBucketsPerMinute(int maxClientBucketsPerMinute) {
            this.maxClientBucketsPerMinute = maxClientBucketsPerMinute;
        }

        public boolean isTrustProxyHeaders() {
            return trustProxyHeaders;
        }

        public void setTrustProxyHeaders(boolean trustProxyHeaders) {
            this.trustProxyHeaders = trustProxyHeaders;
        }
    }

    public static class Cors {

        private List<String> allowedOrigins = new ArrayList<>(List.of(
                "http://localhost:5173",
                "https://ljkportfolio.netlify.app"
        ));

        public List<String> getAllowedOrigins() {
            return allowedOrigins;
        }

        public void setAllowedOrigins(List<String> allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }
    }
}
