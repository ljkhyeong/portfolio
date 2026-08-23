package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

@Repository
public class ElasticsearchKnowledgeRepository implements KnowledgeIndexPort {

    private static final String JSON_MEDIA_TYPE = "application/json";
    private static final String NDJSON_MEDIA_TYPE = "application/x-ndjson";

    private final KnowledgeProperties properties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public ElasticsearchKnowledgeRepository(KnowledgeProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.restClient = createClient(properties.getElasticsearch());
    }

    public void checkHealth() {
        try {
            restClient.get().uri("/_cluster/health?local=true&timeout=2s").retrieve().toBodilessEntity();
        } catch (RuntimeException exception) {
            throw accessException("Elasticsearch 상태를 확인하지 못했습니다.", exception);
        }
    }

    @Override
    public void ensureIndex(String embeddingModelId, int dimensions) {
        if (indexExists()) {
            verifyIndexCompatibility(embeddingModelId, dimensions);
            return;
        }
        put("/" + indexName(), indexDefinition(embeddingModelId, dimensions));
    }

    @Override
    public Map<String, String> findIndexedSourceHashes() {
        Map<String, Object> request = Map.of(
                "size", 10_000,
                "_source", List.of("documentId", "sourceHash", "documentChunkCount"),
                "query", Map.of("match_all", Map.of())
        );
        Map<String, Object> response = post("/" + indexName() + "/_search", request);
        Map<String, IndexedDocumentState> states = new LinkedHashMap<>();
        for (Map<String, Object> hit : hits(response)) {
            Map<String, Object> source = map(hit.get("_source"));
            String documentId = string(source.get("documentId"));
            states.computeIfAbsent(documentId, ignored -> new IndexedDocumentState())
                    .add(string(source.get("sourceHash")), number(source.get("documentChunkCount")).intValue());
        }
        Map<String, String> hashes = new LinkedHashMap<>();
        states.forEach((documentId, state) -> hashes.put(documentId, state.completeSourceHash()));
        return Map.copyOf(hashes);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        Map<String, Object> request = Map.of(
                "query", Map.of("term", Map.of("documentId", documentId))
        );
        verifyDeleteByQueryResponse(
                post("/" + indexName() + "/_delete_by_query?refresh=true&conflicts=proceed", request)
        );
    }

    @Override
    public void deleteStaleChunks(String documentId, List<String> retainedChunkIds) {
        if (retainedChunkIds.isEmpty()) {
            deleteByDocumentId(documentId);
            return;
        }
        Map<String, Object> bool = Map.of(
                "must", List.of(Map.of("term", Map.of("documentId", documentId))),
                "must_not", List.of(Map.of("ids", Map.of("values", retainedChunkIds)))
        );
        verifyDeleteByQueryResponse(
                post(
                        "/" + indexName() + "/_delete_by_query?refresh=true&conflicts=proceed",
                        Map.of("query", Map.of("bool", bool))
                )
        );
    }

    @Override
    public void bulkIndex(List<KnowledgeChunk> chunks) {
        if (chunks.isEmpty()) {
            return;
        }
        Map<String, Long> chunkCounts = chunks.stream().collect(java.util.stream.Collectors.groupingBy(
                KnowledgeChunk::documentId,
                java.util.stream.Collectors.counting()
        ));
        StringBuilder body = new StringBuilder();
        for (KnowledgeChunk chunk : chunks) {
            body.append(writeJson(Map.of("index", Map.of("_index", indexName(), "_id", chunk.chunkId()))))
                    .append('\n');
            body.append(writeJson(toSource(chunk, chunkCounts.get(chunk.documentId()).intValue()))).append('\n');
        }

        Map<String, Object> response = postRaw("/_bulk?refresh=true", body.toString(), NDJSON_MEDIA_TYPE);
        if (Boolean.TRUE.equals(response.get("errors"))) {
            throw new ElasticsearchAccessException("Elasticsearch 벌크 색인 실패: " + bulkFailureSummary(response));
        }
    }

    @Override
    public List<SearchHit> searchBm25(String query, KnowledgeFilter filter, int limit) {
        Map<String, Object> boolQuery = new LinkedHashMap<>();
        boolQuery.put("must", List.of(Map.of(
                "multi_match", Map.of(
                        "query", query,
                        "fields", List.of("title^3", "heading^2", "projectName^2", "content"),
                        "type", "best_fields"
                )
        )));
        List<Map<String, Object>> filters = filters(filter);
        if (!filters.isEmpty()) {
            boolQuery.put("filter", filters);
        }

        Map<String, Object> request = Map.of(
                "size", limit,
                "_source", Map.of("excludes", List.of("embedding")),
                "query", Map.of("bool", boolQuery)
        );
        return search(request);
    }

    @Override
    public List<SearchHit> searchKnn(List<Float> queryVector, KnowledgeFilter filter, int limit, int candidates) {
        Map<String, Object> knn = new LinkedHashMap<>();
        knn.put("field", "embedding");
        knn.put("query_vector", queryVector);
        knn.put("k", limit);
        knn.put("num_candidates", Math.max(candidates, limit));
        List<Map<String, Object>> filters = filters(filter);
        if (!filters.isEmpty()) {
            knn.put("filter", Map.of("bool", Map.of("filter", filters)));
        }

        Map<String, Object> request = Map.of(
                "size", limit,
                "_source", Map.of("excludes", List.of("embedding")),
                "knn", knn
        );
        return search(request);
    }

    private List<SearchHit> search(Map<String, Object> request) {
        Map<String, Object> response = post("/" + indexName() + "/_search", request);
        List<SearchHit> results = new ArrayList<>();
        for (Map<String, Object> hit : hits(response)) {
            Map<String, Object> source = map(hit.get("_source"));
            results.add(new SearchHit(toChunk(source), number(hit.get("_score")).doubleValue()));
        }
        return List.copyOf(results);
    }

    private RestClient createClient(KnowledgeProperties.Elasticsearch configuration) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(configuration.getConnectTimeoutSeconds()))
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(configuration.getReadTimeoutSeconds()));

        RestClient.Builder builder = RestClient.builder()
                .baseUrl(configuration.getBaseUrl())
                .requestFactory(requestFactory)
                .defaultHeader(HttpHeaders.ACCEPT, JSON_MEDIA_TYPE);
        if (StringUtils.hasText(configuration.getUsername())) {
            String credentials = configuration.getUsername() + ":" + configuration.getPassword();
            builder.defaultHeader(
                    HttpHeaders.AUTHORIZATION,
                    "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes(java.nio.charset.StandardCharsets.UTF_8))
            );
        }
        return builder.build();
    }

    private boolean indexExists() {
        try {
            return restClient.head()
                    .uri("/" + indexName())
                    .exchange((request, response) -> {
                        if (response.getStatusCode().value() == 404) {
                            return false;
                        }
                        if (response.getStatusCode().isError()) {
                            throw new ElasticsearchAccessException("Elasticsearch 인덱스를 확인하지 못했습니다.");
                        }
                        return true;
                    });
        } catch (RuntimeException exception) {
            throw accessException("Elasticsearch 인덱스를 확인하지 못했습니다.", exception);
        }
    }

    private void verifyIndexCompatibility(String embeddingModelId, int dimensions) {
        Map<String, Object> mapping = get("/" + indexName() + "/_mapping");
        Map<String, Object> indexMapping = map(mapping.get(indexName()));
        Map<String, Object> mappings = map(indexMapping.get("mappings"));
        Map<String, Object> metadata = map(mappings.get("_meta"));
        String currentModel = string(metadata.get("embeddingModelId"));
        int currentDimensions = number(metadata.get("embeddingDimensions")).intValue();
        if (!embeddingModelId.equals(currentModel) || currentDimensions != dimensions) {
            throw new ElasticsearchAccessException(
                    "현재 인덱스의 임베딩 모델 또는 차원이 다릅니다. 새 인덱스 이름으로 전체 색인하세요."
            );
        }
    }

    private Map<String, Object> indexDefinition(String embeddingModelId, int dimensions) {
        Map<String, Object> propertiesMap = new LinkedHashMap<>();
        propertiesMap.put("chunkId", keyword());
        propertiesMap.put("documentId", keyword());
        propertiesMap.put("projectId", keyword());
        propertiesMap.put("projectName", textWithKeyword());
        propertiesMap.put("serviceId", keyword());
        propertiesMap.put("documentType", keyword());
        propertiesMap.put("title", analyzedText());
        propertiesMap.put("heading", analyzedText());
        propertiesMap.put("content", analyzedText());
        propertiesMap.put("sourceUrl", keyword());
        propertiesMap.put("route", keyword());
        propertiesMap.put("evidenceLevel", keyword());
        propertiesMap.put("sourceRevision", keyword());
        propertiesMap.put("sourceHash", keyword());
        propertiesMap.put("contentHash", keyword());
        propertiesMap.put("chunkHash", keyword());
        propertiesMap.put("embeddingModelId", keyword());
        propertiesMap.put("documentChunkCount", Map.of("type", "integer"));
        propertiesMap.put("embedding", Map.of(
                "type", "dense_vector",
                "dims", dimensions,
                "index", true,
                "similarity", "cosine"
        ));

        return Map.of(
                "settings", Map.of(
                        "number_of_shards", 1,
                        "number_of_replicas", 0
                ),
                "mappings", Map.of(
                        "dynamic", "strict",
                        "_meta", Map.of(
                                "embeddingModelId", embeddingModelId,
                                "embeddingDimensions", dimensions
                        ),
                        "properties", propertiesMap
                )
        );
    }

    private Map<String, Object> analyzedText() {
        return Map.of("type", "text", "analyzer", "standard", "search_analyzer", "standard");
    }

    private Map<String, Object> textWithKeyword() {
        return Map.of(
                "type", "text",
                "analyzer", "standard",
                "fields", Map.of("raw", Map.of("type", "keyword"))
        );
    }

    private Map<String, Object> keyword() {
        return Map.of("type", "keyword", "ignore_above", 2048);
    }

    private List<Map<String, Object>> filters(KnowledgeFilter filter) {
        List<Map<String, Object>> filters = new ArrayList<>();
        if (!filter.projectIds().isEmpty()) {
            filters.add(Map.of("terms", Map.of("projectId", filter.projectIds())));
        }
        if (!filter.documentTypes().isEmpty()) {
            filters.add(Map.of("terms", Map.of("documentType", filter.documentTypes())));
        }
        return List.copyOf(filters);
    }

    private Map<String, Object> toSource(KnowledgeChunk chunk, int documentChunkCount) {
        Map<String, Object> source = new LinkedHashMap<>();
        source.put("chunkId", chunk.chunkId());
        source.put("documentId", chunk.documentId());
        source.put("projectId", chunk.projectId());
        source.put("projectName", chunk.projectName());
        source.put("serviceId", chunk.serviceId());
        source.put("documentType", chunk.documentType());
        source.put("title", chunk.title());
        source.put("heading", chunk.heading());
        source.put("content", chunk.content());
        source.put("sourceUrl", chunk.sourceUrl());
        source.put("route", chunk.route());
        source.put("evidenceLevel", chunk.evidenceLevel());
        source.put("sourceRevision", chunk.sourceRevision());
        source.put("sourceHash", chunk.sourceHash());
        source.put("contentHash", chunk.contentHash());
        source.put("chunkHash", chunk.chunkHash());
        source.put("documentChunkCount", documentChunkCount);
        if (StringUtils.hasText(chunk.embeddingModelId())) {
            source.put("embeddingModelId", chunk.embeddingModelId());
        }
        if (!chunk.embedding().isEmpty()) {
            source.put("embedding", chunk.embedding());
        }
        return source;
    }

    private KnowledgeChunk toChunk(Map<String, Object> source) {
        return new KnowledgeChunk(
                string(source.get("chunkId")),
                string(source.get("documentId")),
                string(source.get("projectId")),
                string(source.get("projectName")),
                nullableString(source.get("serviceId")),
                string(source.get("documentType")),
                string(source.get("title")),
                nullableString(source.get("heading")),
                string(source.get("content")),
                nullableString(source.get("sourceUrl")),
                nullableString(source.get("route")),
                nullableString(source.get("evidenceLevel")),
                nullableString(source.get("sourceRevision")),
                nullableString(source.get("sourceHash")),
                string(source.get("contentHash")),
                string(source.get("chunkHash")),
                nullableString(source.get("embeddingModelId")),
                List.of()
        );
    }

    private Map<String, Object> get(String uri) {
        try {
            String body = restClient.get().uri(uri).retrieve().body(String.class);
            return readMap(body);
        } catch (RuntimeException exception) {
            throw accessException("Elasticsearch 조회에 실패했습니다.", exception);
        }
    }

    private Map<String, Object> put(String uri, Map<String, Object> body) {
        try {
            String response = restClient.put()
                    .uri(uri)
                    .contentType(MediaType.parseMediaType(JSON_MEDIA_TYPE))
                    .body(body)
                    .retrieve()
                    .body(String.class);
            return readMap(response);
        } catch (RuntimeException exception) {
            throw accessException("Elasticsearch 저장에 실패했습니다.", exception);
        }
    }

    private Map<String, Object> post(String uri, Map<String, Object> body) {
        try {
            String response = restClient.post()
                    .uri(uri)
                    .contentType(MediaType.parseMediaType(JSON_MEDIA_TYPE))
                    .body(body)
                    .retrieve()
                    .body(String.class);
            return readMap(response);
        } catch (RuntimeException exception) {
            throw accessException("Elasticsearch 요청에 실패했습니다.", exception);
        }
    }

    private Map<String, Object> postRaw(String uri, String body, String mediaType) {
        try {
            String response = restClient.post()
                    .uri(uri)
                    .contentType(MediaType.parseMediaType(mediaType + ";charset=UTF-8"))
                    .body(body.getBytes(java.nio.charset.StandardCharsets.UTF_8))
                    .retrieve()
                    .body(String.class);
            return readMap(response);
        } catch (RuntimeException exception) {
            throw accessException("Elasticsearch 벌크 요청에 실패했습니다.", exception);
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> hits(Map<String, Object> response) {
        Map<String, Object> hits = map(response.get("hits"));
        Object values = hits.get("hits");
        return values instanceof List<?> list ? (List<Map<String, Object>>) list : List.of();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> map(Object value) {
        return value instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> readMap(String body) {
        if (!StringUtils.hasText(body)) {
            return Map.of();
        }
        return objectMapper.readValue(body, Map.class);
    }

    private String writeJson(Object value) {
        return objectMapper.writeValueAsString(value);
    }

    private String bulkFailureSummary(Map<String, Object> response) {
        Object itemValue = response.get("items");
        if (!(itemValue instanceof List<?> items)) {
            return "상세 응답 없음";
        }
        List<String> failures = new ArrayList<>();
        for (Object itemValueEntry : items) {
            Map<String, Object> item = map(itemValueEntry);
            Map<String, Object> operation = map(item.values().stream().findFirst().orElse(Map.of()));
            if (number(operation.get("status")).intValue() >= 300) {
                Map<String, Object> error = map(operation.get("error"));
                failures.add("id=%s, status=%s, reason=%s".formatted(
                        string(operation.get("_id")),
                        number(operation.get("status")).intValue(),
                        string(error.get("reason"))
                ));
            }
            if (failures.size() == 3) {
                break;
            }
        }
        return failures.isEmpty() ? "상세 응답 없음" : String.join("; ", failures);
    }

    static void verifyDeleteByQueryResponse(Map<String, Object> response) {
        boolean timedOut = Boolean.TRUE.equals(response.get("timed_out"));
        int versionConflicts = numberValue(response.get("version_conflicts"));
        Object failuresValue = response.get("failures");
        int failureCount = failuresValue instanceof List<?> failures ? failures.size() : 0;
        if (timedOut || versionConflicts > 0 || failureCount > 0) {
            throw new ElasticsearchAccessException(
                    "Elasticsearch 문서 삭제가 완료되지 않았습니다. timedOut=%s, versionConflicts=%d, failures=%d"
                            .formatted(timedOut, versionConflicts, failureCount)
            );
        }
    }

    private static int numberValue(Object value) {
        return value instanceof Number number ? number.intValue() : 0;
    }

    private String string(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private String nullableString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Number number(Object value) {
        return value instanceof Number number ? number : 0;
    }

    private String indexName() {
        return properties.getElasticsearch().getIndexName();
    }

    private ElasticsearchAccessException accessException(String message, RuntimeException exception) {
        if (exception instanceof ElasticsearchAccessException accessException) {
            return accessException;
        }
        if (exception instanceof HttpClientErrorException clientException) {
            return new ElasticsearchAccessException(message + " 상태 코드: " + clientException.getStatusCode(), exception);
        }
        return new ElasticsearchAccessException(message, exception);
    }

    private static final class IndexedDocumentState {

        private final java.util.Set<String> sourceHashes = new java.util.HashSet<>();
        private int actualChunkCount;
        private int expectedChunkCount;

        private void add(String sourceHash, int chunkCount) {
            sourceHashes.add(sourceHash);
            actualChunkCount++;
            expectedChunkCount = Math.max(expectedChunkCount, chunkCount);
        }

        private String completeSourceHash() {
            if (sourceHashes.size() != 1 || actualChunkCount != expectedChunkCount) {
                return "__incomplete__";
            }
            return sourceHashes.iterator().next();
        }
    }
}
