package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.Conflicts;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.Refresh;
import co.elastic.clients.elasticsearch._types.mapping.DenseVectorSimilarity;
import co.elastic.clients.elasticsearch._types.mapping.DynamicMapping;
import co.elastic.clients.elasticsearch._types.mapping.Property;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.DeleteByQueryResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkResponseItem;
import co.elastic.clients.elasticsearch.indices.GetMappingResponse;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.json.jackson.Jackson3JsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.util.ObjectBuilder;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import jakarta.annotation.PreDestroy;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.ResponseException;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
public class ElasticsearchKnowledgeRepository implements KnowledgeIndexPort {

    private final KnowledgeProperties properties;
    private final RestClientTransport transport;
    private final ElasticsearchClient client;

    public ElasticsearchKnowledgeRepository(KnowledgeProperties properties) {
        this.properties = properties;
        RestClient restClient = createRestClient(properties.elasticsearch());
        this.transport = new RestClientTransport(restClient, new Jackson3JsonpMapper());
        this.client = new ElasticsearchClient(transport);
    }

    public void checkHealth() {
        execute(
                "Elasticsearch 상태를 확인하지 못했습니다.",
                () -> client.cluster().health(request -> request.local(true).timeout(timeout -> timeout.time("2s")))
        );
    }

    @Override
    public void ensureIndex(String embeddingModelId, int dimensions, String chunkingFingerprint) {
        if (indexExists()) {
            verifyIndexCompatibility(embeddingModelId, dimensions, chunkingFingerprint);
            return;
        }

        execute("Elasticsearch 인덱스를 생성하지 못했습니다.", () -> client.indices().create(request -> request
                .index(indexName())
                .settings(settings -> settings.numberOfShards("1").numberOfReplicas("0"))
                .mappings(mapping -> mapping
                        .dynamic(DynamicMapping.Strict)
                        .meta("embeddingModelId", JsonData.of(embeddingModelId))
                        .meta("embeddingDimensions", JsonData.of(dimensions))
                        .meta("chunkingFingerprint", JsonData.of(chunkingFingerprint))
                        .meta("textAnalyzer", JsonData.of("nori"))
                        .properties("chunkId", keyword())
                        .properties("documentId", keyword())
                        .properties("projectId", keyword())
                        .properties("projectName", textWithKeyword())
                        .properties("serviceId", keyword())
                        .properties("documentType", keyword())
                        .properties("title", analyzedText())
                        .properties("heading", analyzedText())
                        .properties("content", analyzedText())
                        .properties("sourceUrl", keyword())
                        .properties("route", keyword())
                        .properties("evidenceLevel", keyword())
                        .properties("sourceRevision", keyword())
                        .properties("sourceHash", keyword())
                        .properties("contentHash", keyword())
                        .properties("chunkHash", keyword())
                        .properties("embeddingModelId", keyword())
                        .properties("documentChunkCount", property -> property.integer(integer -> integer))
                        .properties("embedding", property -> property.denseVector(vector -> vector
                                .dims(dimensions)
                                .index(true)
                                .similarity(DenseVectorSimilarity.Cosine)
                        ))
                )
        ));
    }

    @Override
    public Map<String, String> findIndexedSourceHashes() {
        SearchResponse<IndexedChunkDocument> response = execute(
                "Elasticsearch 조회에 실패했습니다.",
                () -> client.search(request -> request
                                .index(indexName())
                                .size(10_000)
                                .source(source -> source.filter(filter -> filter.includes(
                                        "documentId",
                                        "sourceHash",
                                        "documentChunkCount"
                                )))
                                .query(query -> query.matchAll(matchAll -> matchAll)),
                        IndexedChunkDocument.class
                )
        );

        Map<String, IndexedDocumentState> states = new LinkedHashMap<>();
        response.hits().hits().stream()
                .map(hit -> hit.source())
                .filter(java.util.Objects::nonNull)
                .forEach(document -> states
                        .computeIfAbsent(valueOrEmpty(document.documentId()), ignored -> new IndexedDocumentState())
                        .add(
                                valueOrEmpty(document.sourceHash()),
                                document.documentChunkCount() == null ? 0 : document.documentChunkCount()
                        ));

        Map<String, String> hashes = new LinkedHashMap<>();
        states.forEach((documentId, state) -> hashes.put(documentId, state.completeSourceHash()));
        return Map.copyOf(hashes);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        deleteByQuery(Query.of(query -> query.term(term -> term.field("documentId").value(documentId))));
    }

    @Override
    public void deleteStaleChunks(String documentId, List<String> retainedChunkIds) {
        if (retainedChunkIds.isEmpty()) {
            deleteByDocumentId(documentId);
            return;
        }

        deleteByQuery(Query.of(query -> query.bool(bool -> bool
                .must(must -> must.term(term -> term.field("documentId").value(documentId)))
                .mustNot(mustNot -> mustNot.ids(ids -> ids.values(retainedChunkIds)))
        )));
    }

    @Override
    public void bulkIndex(List<KnowledgeChunk> chunks) {
        if (chunks.isEmpty()) {
            return;
        }

        Map<String, Long> chunkCounts = chunks.stream().collect(Collectors.groupingBy(
                KnowledgeChunk::documentId,
                Collectors.counting()
        ));
        BulkRequest.Builder request = new BulkRequest.Builder().refresh(Refresh.True);
        chunks.forEach(chunk -> request.operations(operation -> operation.index(index -> index
                .index(indexName())
                .id(chunk.chunkId())
                .document(IndexedChunkDocument.from(
                        chunk,
                        chunkCounts.get(chunk.documentId()).intValue()
                ))
        )));

        BulkResponse response = execute(
                "Elasticsearch 벌크 요청에 실패했습니다.",
                () -> client.bulk(request.build())
        );
        if (response.errors()) {
            throw new ElasticsearchAccessException("Elasticsearch 벌크 색인 실패: " + bulkFailureSummary(response));
        }
    }

    @Override
    public List<SearchHit> searchBm25(String query, KnowledgeFilter filter, int limit) {
        List<Query> filters = filters(filter);
        Query bm25Query = Query.of(root -> root.bool(bool -> {
            bool.must(must -> must.multiMatch(multiMatch -> multiMatch
                    .query(query)
                    .fields("title^3", "heading^2", "projectName^2", "content")
                    .type(TextQueryType.BestFields)
            ));
            if (!filters.isEmpty()) {
                bool.filter(filters);
            }
            return bool;
        }));

        return search(request -> request
                .index(indexName())
                .size(limit)
                .source(source -> source.filter(sourceFilter -> sourceFilter.excludes("embedding")))
                .query(bm25Query)
        );
    }

    @Override
    public List<SearchHit> searchKnn(List<Float> queryVector, KnowledgeFilter filter, int limit, int candidates) {
        List<Query> filters = filters(filter);
        return search(request -> request
                .index(indexName())
                .size(limit)
                .source(source -> source.filter(sourceFilter -> sourceFilter.excludes("embedding")))
                .knn(knn -> {
                    knn.field("embedding")
                            .queryVector(queryVector)
                            .k(limit)
                            .numCandidates(Math.max(candidates, limit));
                    if (!filters.isEmpty()) {
                        knn.filter(query -> query.bool(bool -> bool.filter(filters)));
                    }
                    return knn;
                })
        );
    }

    @PreDestroy
    void close() {
        try {
            transport.close();
        } catch (IOException exception) {
            throw new ElasticsearchAccessException("Elasticsearch 연결을 종료하지 못했습니다.", exception);
        }
    }

    private void deleteByQuery(Query query) {
        DeleteByQueryResponse response = execute(
                "Elasticsearch 문서 삭제 요청에 실패했습니다.",
                () -> client.deleteByQuery(request -> request
                        .index(indexName())
                        .refresh(true)
                        .conflicts(Conflicts.Proceed)
                        .query(query)
                )
        );
        verifyDeleteByQueryResponse(
                Boolean.TRUE.equals(response.timedOut()),
                response.versionConflicts() == null ? 0 : response.versionConflicts(),
                response.failures().size()
        );
    }

    private List<SearchHit> search(
            Function<SearchRequest.Builder, ObjectBuilder<SearchRequest>> requestFactory
    ) {
        SearchResponse<IndexedChunkDocument> response = execute(
                "Elasticsearch 검색에 실패했습니다.",
                () -> client.search(requestFactory, IndexedChunkDocument.class)
        );
        List<SearchHit> results = new ArrayList<>();
        response.hits().hits().forEach(hit -> {
            if (hit.source() != null) {
                results.add(new SearchHit(
                        toChunk(hit.source()),
                        hit.score() == null ? 0 : hit.score()
                ));
            }
        });
        return List.copyOf(results);
    }

    private boolean indexExists() {
        return execute(
                "Elasticsearch 인덱스를 확인하지 못했습니다.",
                () -> client.indices().exists(request -> request.index(indexName())).value()
        );
    }

    private void verifyIndexCompatibility(String embeddingModelId, int dimensions, String chunkingFingerprint) {
        GetMappingResponse response = execute(
                "Elasticsearch 매핑을 조회하지 못했습니다.",
                () -> client.indices().getMapping(request -> request.index(indexName()))
        );
        var indexMapping = response.result().get(indexName());
        Map<String, JsonData> metadata = indexMapping == null
                ? Map.of()
                : indexMapping.mappings().meta();
        JsonData modelValue = metadata.get("embeddingModelId");
        JsonData dimensionsValue = metadata.get("embeddingDimensions");
        JsonData chunkingValue = metadata.get("chunkingFingerprint");
        JsonData analyzerValue = metadata.get("textAnalyzer");
        String currentModel = modelValue == null ? "" : modelValue.to(String.class);
        int currentDimensions = dimensionsValue == null ? 0 : dimensionsValue.to(Integer.class);
        String currentChunkingFingerprint = chunkingValue == null ? "" : chunkingValue.to(String.class);
        if (!embeddingModelId.equals(currentModel)
                || currentDimensions != dimensions
                || !chunkingFingerprint.equals(currentChunkingFingerprint)
                || analyzerValue == null || !"nori".equals(analyzerValue.to(String.class))) {
            throw new ElasticsearchAccessException(
                    "현재 인덱스의 임베딩 모델, 차원, 청크 설정 또는 한국어 분석기가 다릅니다. 새 인덱스 이름으로 전체 색인하세요."
            );
        }
    }

    private Property analyzedText() {
        return Property.of(property -> property.text(text -> text
                .analyzer("nori")
                .searchAnalyzer("nori")
        ));
    }

    private Property textWithKeyword() {
        return Property.of(property -> property.text(text -> text
                .analyzer("nori")
                .fields("raw", raw -> raw.keyword(keyword -> keyword))
        ));
    }

    private Property keyword() {
        return Property.of(property -> property.keyword(keyword -> keyword.ignoreAbove(2048)));
    }

    private List<Query> filters(KnowledgeFilter filter) {
        List<Query> filters = new ArrayList<>();
        if (!filter.projectIds().isEmpty()) {
            filters.add(termsQuery("projectId", filter.projectIds()));
        }
        if (!filter.documentTypes().isEmpty()) {
            filters.add(termsQuery("documentType", filter.documentTypes()));
        }
        return List.copyOf(filters);
    }

    private Query termsQuery(String field, List<String> values) {
        return Query.of(query -> query.terms(terms -> terms
                .field(field)
                .terms(termsField -> termsField.value(values.stream().map(FieldValue::of).toList()))
        ));
    }

    private KnowledgeChunk toChunk(IndexedChunkDocument source) {
        return new KnowledgeChunk(
                valueOrEmpty(source.chunkId()),
                valueOrEmpty(source.documentId()),
                valueOrEmpty(source.projectId()),
                valueOrEmpty(source.projectName()),
                source.serviceId(),
                valueOrEmpty(source.documentType()),
                valueOrEmpty(source.title()),
                source.heading(),
                valueOrEmpty(source.content()),
                source.sourceUrl(),
                source.route(),
                source.evidenceLevel(),
                source.sourceRevision(),
                source.sourceHash(),
                valueOrEmpty(source.contentHash()),
                valueOrEmpty(source.chunkHash()),
                source.embeddingModelId(),
                List.of()
        );
    }

    private String bulkFailureSummary(BulkResponse response) {
        String summary = response.items().stream()
                .filter(item -> item.status() >= 300)
                .limit(3)
                .map(this::bulkFailure)
                .collect(Collectors.joining("; "));
        return summary.isEmpty() ? "상세 응답 없음" : summary;
    }

    private String bulkFailure(BulkResponseItem item) {
        String reason = item.error() == null ? "" : valueOrEmpty(item.error().reason());
        return "id=%s, status=%d, reason=%s".formatted(valueOrEmpty(item.id()), item.status(), reason);
    }

    static void verifyDeleteByQueryResponse(boolean timedOut, long versionConflicts, int failureCount) {
        if (timedOut || versionConflicts > 0 || failureCount > 0) {
            throw new ElasticsearchAccessException(
                    "Elasticsearch 문서 삭제가 완료되지 않았습니다. timedOut=%s, versionConflicts=%d, failures=%d"
                            .formatted(timedOut, versionConflicts, failureCount)
            );
        }
    }

    private RestClient createRestClient(KnowledgeProperties.Elasticsearch configuration) {
        RestClientBuilder builder = RestClient.builder(HttpHost.create(configuration.baseUrl()))
                .setRequestConfigCallback(request -> request
                        .setConnectTimeout(configuration.connectTimeoutSeconds() * 1_000)
                        .setSocketTimeout(configuration.readTimeoutSeconds() * 1_000)
                );
        if (StringUtils.hasText(configuration.username())) {
            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(
                    configuration.username(),
                    configuration.password(),
                    StandardCharsets.UTF_8
            );
            builder.setDefaultHeaders(new BasicHeader[]{
                    new BasicHeader(HttpHeaders.AUTHORIZATION, headers.getFirst(HttpHeaders.AUTHORIZATION))
            });
        }
        return builder.build();
    }

    private <T> T execute(String message, ElasticsearchCall<T> call) {
        try {
            return call.execute();
        } catch (IOException | ElasticsearchException exception) {
            throw accessException(message, exception);
        }
    }

    private ElasticsearchAccessException accessException(String message, Exception exception) {
        if (exception instanceof ElasticsearchException elasticsearchException) {
            return new ElasticsearchAccessException(
                    message + " 상태 코드: " + elasticsearchException.status(),
                    exception
            );
        }
        if (exception instanceof ResponseException responseException) {
            return new ElasticsearchAccessException(
                    message + " 상태 코드: " + responseException.getResponse().getStatusLine().getStatusCode(),
                    exception
            );
        }
        return new ElasticsearchAccessException(message, exception);
    }

    private String indexName() {
        return properties.elasticsearch().indexName();
    }

    private static String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }

    @FunctionalInterface
    private interface ElasticsearchCall<T> {

        T execute() throws IOException;
    }

    private record IndexedChunkDocument(
            String chunkId,
            String documentId,
            String projectId,
            String projectName,
            String serviceId,
            String documentType,
            String title,
            String heading,
            String content,
            String sourceUrl,
            String route,
            String evidenceLevel,
            String sourceRevision,
            String sourceHash,
            String contentHash,
            String chunkHash,
            @JsonInclude(JsonInclude.Include.NON_NULL)
            String embeddingModelId,
            @JsonInclude(JsonInclude.Include.NON_NULL)
            List<Float> embedding,
            Integer documentChunkCount
    ) {

        private static IndexedChunkDocument from(KnowledgeChunk chunk, int documentChunkCount) {
            return new IndexedChunkDocument(
                    chunk.chunkId(),
                    chunk.documentId(),
                    chunk.projectId(),
                    chunk.projectName(),
                    chunk.serviceId(),
                    chunk.documentType(),
                    chunk.title(),
                    chunk.heading(),
                    chunk.content(),
                    chunk.sourceUrl(),
                    chunk.route(),
                    chunk.evidenceLevel(),
                    chunk.sourceRevision(),
                    chunk.sourceHash(),
                    chunk.contentHash(),
                    chunk.chunkHash(),
                    StringUtils.hasText(chunk.embeddingModelId()) ? chunk.embeddingModelId() : null,
                    chunk.embedding().isEmpty() ? null : List.copyOf(chunk.embedding()),
                    documentChunkCount
            );
        }
    }

    private static final class IndexedDocumentState {

        private final Set<String> sourceHashes = new HashSet<>();
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
