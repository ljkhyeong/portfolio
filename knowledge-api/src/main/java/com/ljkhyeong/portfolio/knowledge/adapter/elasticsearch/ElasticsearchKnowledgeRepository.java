package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import java.io.IOException;
import java.time.Clock;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.mapping.DenseVectorIndexOptionsType;
import co.elastic.clients.elasticsearch._types.mapping.DenseVectorSimilarity;
import co.elastic.clients.elasticsearch._types.mapping.DynamicMapping;
import co.elastic.clients.elasticsearch._types.mapping.Property;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkResponseItem;
import co.elastic.clients.elasticsearch.core.search.HighlightField;
import co.elastic.clients.elasticsearch.core.search.HighlighterOrder;
import co.elastic.clients.elasticsearch.indices.get.Feature;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.util.NamedValue;
import co.elastic.clients.util.ObjectBuilder;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexAccessException;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
public class ElasticsearchKnowledgeRepository implements KnowledgeIndexPort {

    // 매핑을 바꾸면 값을 올린다. 다음 동기화가 기존 색인을 쓰지 않고 새로 만든다.
    private static final int MAPPING_VERSION = 1;
    private static final List<String> META_KEYS = List.of("mappingVersion", "sourceRevision", "embeddingModelId",
            "embeddingDimensions", "chunkingFingerprint", "documentCount");
    private static final DateTimeFormatter INDEX_SUFFIX =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS").withZone(ZoneOffset.UTC);

    private final KnowledgeProperties properties;
    private final ElasticsearchClient client;
    private final Clock clock;
    private final Pattern generatedIndex;

    @Autowired
    public ElasticsearchKnowledgeRepository(KnowledgeProperties properties, ElasticsearchClient client) {
        this(properties, client, Clock.systemUTC());
    }

    ElasticsearchKnowledgeRepository(KnowledgeProperties properties, ElasticsearchClient client, Clock clock) {
        this.properties = properties;
        this.client = client;
        this.clock = clock;
        this.generatedIndex = Pattern.compile(Pattern.quote(alias()) + "-\\d{17}");
    }

    @Override
    public Optional<IndexMetadata> publishedMetadata() {
        var mappings = execute("Elasticsearch 매핑을 조회하지 못했습니다.", () -> client.indices().getMapping(request -> request
                .index(alias())
                .ignoreUnavailable(true)
                .allowNoIndices(true)
        )).mappings();
        if (mappings.size() > 1) {
            throw new KnowledgeIndexAccessException("검색 alias가 여러 색인을 가리킵니다: " + mappings.keySet());
        }
        return mappings.values().stream().findFirst().flatMap(mapping -> toMetadata(mapping.mappings().meta()));
    }

    @Override
    public String createIndex(IndexMetadata metadata) {
        String index = alias() + "-" + INDEX_SUFFIX.format(clock.instant());
        execute("Elasticsearch 인덱스를 생성하지 못했습니다.", () -> client.indices().create(request -> request
                .index(index)
                .settings(settings -> settings.numberOfReplicas("0"))
                .mappings(mapping -> mapping
                        .dynamic(DynamicMapping.Strict)
                        .meta(toMeta(metadata))
                        .properties("chunkId", keyword())
                        .properties("documentId", keyword())
                        .properties("projectId", keyword())
                        .properties("projectName", analyzedText())
                        .properties("serviceId", keyword())
                        .properties("documentType", keyword())
                        .properties("title", analyzedText())
                        .properties("heading", analyzedText())
                        .properties("content", analyzedText())
                        .properties("sourceUrl", keyword())
                        .properties("route", keyword())
                        .properties("embeddingModelId", keyword())
                        .properties("embedding", property -> property.denseVector(vector -> vector
                                .dims(metadata.embeddingDimensions())
                                .index(true)
                                .similarity(DenseVectorSimilarity.Cosine)
                                .indexOptions(options -> options.type(DenseVectorIndexOptionsType.Int8Hnsw))
                        ))
                )
        ));
        return index;
    }

    @Override
    public void bulkIndex(String index, List<KnowledgeChunk> chunks) {
        if (chunks.isEmpty()) {
            return;
        }

        BulkRequest.Builder request = new BulkRequest.Builder();
        chunks.forEach(chunk -> request.operations(operation -> operation.index(document -> document
                .index(index)
                .id(chunk.chunkId())
                .document(IndexedChunkDocument.from(chunk))
        )));

        BulkResponse response = execute(
                "Elasticsearch 벌크 요청에 실패했습니다.",
                () -> client.bulk(request.build())
        );
        if (response.errors()) {
            throw new KnowledgeIndexAccessException("Elasticsearch 벌크 색인 실패: " + bulkFailureSummary(response));
        }
    }

    @Override
    public void publish(String index, long expectedChunks) {
        execute("Elasticsearch 색인을 새로 고치지 못했습니다.", () -> client.indices().refresh(request -> request.index(index)));
        long count = execute("Elasticsearch 문서 수를 확인하지 못했습니다.",
                () -> client.count(request -> request.index(index))).count();
        if (count != expectedChunks) {
            throw new KnowledgeIndexAccessException(
                    "새 색인의 청크 수가 다릅니다. 기대=%d, 실제=%d".formatted(expectedChunks, count));
        }

        List<String> previous = previousIndices(index);
        // alias 추가와 이전 색인 삭제를 한 요청으로 보내 검색이 빈 색인이나 두 색인을 보지 않게 한다.
        execute("Elasticsearch 검색 alias를 교체하지 못했습니다.", () -> client.indices().updateAliases(request -> {
            request.actions(action -> action.add(add -> add.index(index).alias(alias())));
            previous.forEach(old -> request.actions(action -> action.removeIndex(remove -> remove.index(old))));
            return request;
        }));
    }

    @Override
    public void deleteIndex(String index) {
        execute("Elasticsearch 인덱스를 삭제하지 못했습니다.", () -> client.indices().delete(request -> request.index(index)));
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
                .size(limit)
                .source(source -> source.filter(sourceFilter -> sourceFilter.excludes("embedding")))
                .query(bm25Query)
                .highlight(highlight -> highlight.preTags("").postTags("")
                        .fields(NamedValue.of("content", HighlightField.of(field -> field.fragmentSize(280)
                                .numberOfFragments(1).noMatchSize(280).order(HighlighterOrder.Score)
                                .boundaryScannerLocale("ko-KR")))))
        );
    }

    @Override
    public List<SearchHit> searchKnn(List<Float> queryVector, KnowledgeFilter filter, int limit, int candidates) {
        // 다른 임베딩 모델로 만든 벡터는 비교하지 않는다.
        List<Query> filters = new ArrayList<>(filters(filter));
        filters.add(Query.of(query -> query.term(term -> term
                .field("embeddingModelId")
                .value(properties.ai().embeddingModelId()))));
        return search(request -> request
                .size(limit)
                .source(source -> source.filter(sourceFilter -> sourceFilter.excludes("embedding")))
                .knn(knn -> knn.field("embedding")
                        .queryVector(queryVector)
                        .k(limit)
                        .numCandidates(Math.max(candidates, limit))
                        .filter(query -> query.bool(bool -> bool.filter(filters))))
        );
    }

    private List<String> previousIndices(String index) {
        var indices = execute("Elasticsearch 이전 색인을 조회하지 못했습니다.", () -> client.indices().get(request -> request
                .index(alias(), alias() + "-*")
                .ignoreUnavailable(true)
                .allowNoIndices(true)
                .features(Feature.Aliases)
        )).indices();
        // 같은 이름의 기존 색인과 이전 동기화가 남긴 생성 시각 색인만 삭제한다.
        return indices.keySet().stream()
                .filter(name -> !name.equals(index))
                .filter(name -> name.equals(alias()) || generatedIndex.matcher(name).matches())
                .toList();
    }

    private List<SearchHit> search(
            Function<SearchRequest.Builder, ObjectBuilder<SearchRequest>> requestFactory
    ) {
        // 첫 동기화 전에는 alias가 없으므로 빈 결과를 반환한다.
        SearchResponse<IndexedChunkDocument> response = execute(
                "Elasticsearch 검색에 실패했습니다.",
                () -> client.search(request -> requestFactory.apply(request
                                .index(alias())
                                .ignoreUnavailable(true)
                                .allowPartialSearchResults(false)),
                        IndexedChunkDocument.class)
        );
        verifySearchResponse(response);
        return response.hits().hits().stream()
                .map(hit -> new SearchHit(
                        toChunk(hit.source()),
                        hit.highlight().getOrDefault("content", List.of()).stream().findFirst().orElse(null)
                ))
                .toList();
    }

    private void verifySearchResponse(SearchResponse<?> response) {
        if (response.timedOut() || response.shards().failed().longValue() > 0
                || !response.shards().failures().isEmpty() || Boolean.TRUE.equals(response.terminatedEarly())) {
            throw new KnowledgeIndexAccessException(
                    "Elasticsearch 조회가 완료되지 않았습니다: 시간 초과=%s, 실패 샤드=%s, 조기 종료=%s"
                            .formatted(response.timedOut(), response.shards().failed(), response.terminatedEarly()));
        }
        if (response.hits().hits().stream().anyMatch(hit -> hit.source() == null)) {
            throw new KnowledgeIndexAccessException("Elasticsearch 검색 응답에 문서 본문이 없습니다.");
        }
    }

    private static Map<String, JsonData> toMeta(IndexMetadata metadata) {
        return Map.of(
                "mappingVersion", JsonData.of(MAPPING_VERSION),
                "sourceRevision", JsonData.of(metadata.sourceRevision()),
                "embeddingModelId", JsonData.of(metadata.embeddingModelId()),
                "embeddingDimensions", JsonData.of(metadata.embeddingDimensions()),
                "chunkingFingerprint", JsonData.of(metadata.chunkingFingerprint()),
                "documentCount", JsonData.of(metadata.documentCount())
        );
    }

    private static Optional<IndexMetadata> toMetadata(Map<String, JsonData> meta) {
        if (!meta.keySet().containsAll(META_KEYS) || meta.get("mappingVersion").to(Integer.class) != MAPPING_VERSION) {
            return Optional.empty();
        }
        return Optional.of(new IndexMetadata(
                meta.get("sourceRevision").to(String.class),
                meta.get("embeddingModelId").to(String.class),
                meta.get("embeddingDimensions").to(Integer.class),
                meta.get("chunkingFingerprint").to(String.class),
                meta.get("documentCount").to(Integer.class)
        ));
    }

    private Property analyzedText() {
        return Property.of(property -> property.text(text -> text.analyzer("nori")));
    }

    private Property keyword() {
        return Property.of(property -> property.keyword(keyword -> keyword.ignoreAbove(2048)));
    }

    private List<Query> filters(KnowledgeFilter filter) {
        List<Query> filters = new ArrayList<>();
        if (!filter.projectIds().isEmpty()) {
            filters.add(termsQuery("projectId", filter.projectIds()));
        }
        if (!filter.serviceIds().isEmpty()) {
            filters.add(termsQuery("serviceId", filter.serviceIds()));
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

    private <T> T execute(String message, ElasticsearchCall<T> call) {
        try {
            return call.execute();
        } catch (ElasticsearchException exception) {
            throw new KnowledgeIndexAccessException(message + " 상태 코드: " + exception.status(), exception);
        } catch (IOException exception) {
            throw new KnowledgeIndexAccessException(message, exception);
        }
    }

    private String alias() {
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
            @JsonInclude(JsonInclude.Include.NON_NULL)
            String embeddingModelId,
            @JsonInclude(JsonInclude.Include.NON_NULL)
            List<Float> embedding
    ) {

        private static IndexedChunkDocument from(KnowledgeChunk chunk) {
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
                    StringUtils.hasText(chunk.embeddingModelId()) ? chunk.embeddingModelId() : null,
                    chunk.embedding().isEmpty() ? null : List.copyOf(chunk.embedding())
            );
        }
    }
}
