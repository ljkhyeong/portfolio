package com.ljkhyeong.portfolio.knowledge.search;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeAnswer;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeAnswer.Status;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.cache.CaffeineCacheMetrics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class KnowledgeAnswerService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeAnswerService.class);
    private static final int MAX_CHUNKS_PER_DOCUMENT = 3;
    private static final int MAX_CONTEXT_CHARACTERS = 12_000;

    private final KnowledgeProperties properties;
    private final KnowledgeSearchService searchService;
    private final AnswerGenerationPort answerGenerationPort;
    private final MeterRegistry meters;
    private final Cache<AnswerCacheKey, GeneratedContent> generatedAnswers;

    public KnowledgeAnswerService(
            KnowledgeProperties properties,
            KnowledgeSearchService searchService,
            AnswerGenerationPort answerGenerationPort,
            MeterRegistry meters
    ) {
        this.properties = properties;
        this.searchService = searchService;
        this.answerGenerationPort = answerGenerationPort;
        this.meters = meters;
        // TTL이 0이면 저장한 답변을 다시 읽지 않고, 같은 키의 동시 요청만 한 번 생성한다.
        this.generatedAnswers = CaffeineCacheMetrics.monitor(meters, Caffeine.newBuilder()
                .maximumSize(properties.ai().answerCacheMaxEntries())
                .expireAfterWrite(Duration.ofSeconds(properties.ai().answerCacheTtlSeconds()))
                .recordStats()
                .build(), "answer");
    }

    public KnowledgeAnswer answer(String question, KnowledgeFilter filter, Integer requestedLimit) {
        KnowledgeAnswer answer = createAnswer(question, filter, requestedLimit);
        meters.counter("knowledge.answers", "status", answer.status().name()).increment();
        return answer;
    }

    private KnowledgeAnswer createAnswer(String question, KnowledgeFilter filter, Integer requestedLimit) {
        int limit = requestedLimit == null ? properties.ai().answerContextLimit() : requestedLimit;
        KnowledgeSearchResult searchResult = searchService.search(question, filter, limit);
        List<SearchHit> hits = selectEvidence(searchResult);

        if (!searchResult.hasBm25Evidence(hits)) {
            return KnowledgeAnswer.withoutAnswer(Status.INSUFFICIENT_EVIDENCE, searchResult.hits());
        }

        Map<String, SearchHit> evidenceById = new LinkedHashMap<>();
        List<AnswerGenerationPort.AnswerContext> contexts = new ArrayList<>(hits.size());
        for (int index = 0; index < hits.size(); index++) {
            SearchHit hit = hits.get(index);
            evidenceById.put(String.valueOf(index + 1), hit);
            contexts.add(new AnswerGenerationPort.AnswerContext(
                    String.valueOf(index + 1),
                    hit.chunk().title(),
                    hit.chunk().heading(),
                    hit.chunk().content()
            ));
        }

        try {
            GeneratedContent generated = generatedAnswers.get(
                    new AnswerCacheKey(question, List.copyOf(contexts)),
                    key -> generateContent(question, contexts, evidenceById.keySet())
            );
            if (!generated.answerable()) {
                return KnowledgeAnswer.withoutAnswer(Status.INSUFFICIENT_EVIDENCE, searchResult.hits());
            }
            List<SearchHit> citations = generated.citationIds().stream().map(evidenceById::get).toList();
            return new KnowledgeAnswer(Status.GENERATED, generated.answer(), citations, searchResult.hits());
        } catch (AnswerGenerationUnavailableException exception) {
            log.warn("AI 답변을 제공하지 못해 검색 결과만 반환합니다.", exception);
            return KnowledgeAnswer.withoutAnswer(Status.GENERATION_UNAVAILABLE, searchResult.hits());
        }
    }

    private GeneratedContent generateContent(
            String question,
            List<AnswerGenerationPort.AnswerContext> contexts,
            Set<String> evidenceIds
    ) {
        var generated = answerGenerationPort.generate(question, contexts);
        if (generated == null || generated.answerable() == null) {
            throw new AnswerGenerationUnavailableException("AI 답변의 답변 가능 여부가 없습니다.");
        }
        if (!generated.answerable()) {
            return new GeneratedContent(false, null, List.of());
        }
        Map<String, Integer> citationNumbers = new LinkedHashMap<>();
        String answer = renderAnswer(generated.paragraphs(), evidenceIds, citationNumbers);
        return new GeneratedContent(true, answer, List.copyOf(citationNumbers.keySet()));
    }

    private List<SearchHit> selectEvidence(KnowledgeSearchResult result) {
        Set<String> documentIds = result.hits().stream()
                .map(hit -> hit.chunk().documentId()).collect(Collectors.toSet());
        List<SearchHit> candidates = result.candidates().stream()
                .filter(hit -> documentIds.contains(hit.chunk().documentId())).toList();

        // 키워드 근거 한 건을 먼저 확보하고 문서별 대표 문단과 추가 문단을 배분한다.
        Map<String, SearchHit> ordered = new LinkedHashMap<>();
        candidates.stream().filter(hit -> result.bm25ChunkIds().contains(hit.chunk().chunkId()))
                .findFirst().ifPresent(hit -> ordered.put(hit.chunk().chunkId(), hit));
        result.hits().forEach(hit -> ordered.putIfAbsent(hit.chunk().chunkId(), hit));
        candidates.forEach(hit -> ordered.putIfAbsent(hit.chunk().chunkId(), hit));

        List<SearchHit> selected = new ArrayList<>();
        Map<String, Integer> chunksPerDocument = new HashMap<>();
        int characters = 0;
        for (SearchHit hit : ordered.values()) {
            String documentId = hit.chunk().documentId();
            int count = chunksPerDocument.getOrDefault(documentId, 0);
            int length = hit.chunk().content().length();
            if (count >= MAX_CHUNKS_PER_DOCUMENT || characters + length > MAX_CONTEXT_CHARACTERS) {
                continue;
            }
            selected.add(hit);
            chunksPerDocument.put(documentId, count + 1);
            characters += length;
        }
        return selected;
    }

    private String renderAnswer(
            List<AnswerGenerationPort.AnswerParagraph> paragraphs,
            Set<String> evidenceIds,
            Map<String, Integer> citationNumbers
    ) {
        if (paragraphs == null || paragraphs.isEmpty()) {
            throw new AnswerGenerationUnavailableException("AI가 빈 답변을 반환했습니다.");
        }
        List<String> rendered = new ArrayList<>(paragraphs.size());
        for (var paragraph : paragraphs) {
            if (paragraph == null || !StringUtils.hasText(paragraph.text())
                    || paragraph.citationIds() == null || paragraph.citationIds().isEmpty()) {
                throw new AnswerGenerationUnavailableException("AI 답변의 문단 또는 근거 인용이 없습니다.");
            }
            if (!evidenceIds.containsAll(paragraph.citationIds())) {
                throw new AnswerGenerationUnavailableException("AI 답변에 제공하지 않은 인용 ID가 포함됐습니다.");
            }
            String references = paragraph.citationIds().stream()
                    .distinct()
                    .map(id -> citationNumbers.computeIfAbsent(id, ignored -> citationNumbers.size() + 1))
                    .map(number -> "[" + number + "]")
                    .collect(Collectors.joining(" "));
            rendered.add(paragraph.text().strip() + " " + references);
        }
        return String.join("\n\n", rendered);
    }

    // 질문과 실제 전달한 근거 전체를 값으로 비교해 같은 입력의 답변만 재사용한다.
    private record AnswerCacheKey(String question, List<AnswerGenerationPort.AnswerContext> contexts) {
    }

    private record GeneratedContent(boolean answerable, String answer, List<String> citationIds) {
    }
}
