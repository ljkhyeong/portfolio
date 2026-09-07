package com.ljkhyeong.portfolio.knowledge.search;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.ljkhyeong.portfolio.knowledge.api.AnswerResponse;
import com.ljkhyeong.portfolio.knowledge.api.ResponseMapper;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;
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
    private final ResponseMapper responseMapper;

    public KnowledgeAnswerService(
            KnowledgeProperties properties,
            KnowledgeSearchService searchService,
            AnswerGenerationPort answerGenerationPort,
            ResponseMapper responseMapper
    ) {
        this.properties = properties;
        this.searchService = searchService;
        this.answerGenerationPort = answerGenerationPort;
        this.responseMapper = responseMapper;
    }

    public AnswerResponse answer(
            String question,
            List<String> projectIds,
            List<String> documentTypes,
            Integer requestedLimit
    ) {
        int limit = requestedLimit == null ? properties.ai().answerContextLimit() : requestedLimit;
        KnowledgeSearchResult searchResult = searchService.search(question, projectIds, documentTypes, limit);
        List<SearchHit> hits = selectEvidence(searchResult);
        var searchResults = responseMapper.toSearchResults(searchResult.hits());

        if (!searchResult.hasBm25Evidence(hits)) {
            return new AnswerResponse(
                    question,
                    AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE,
                    null,
                    List.of(),
                    searchResults
            );
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
            var generated = answerGenerationPort.generate(question, contexts);
            if (generated == null || generated.answerable() == null) {
                throw new AnswerGenerationUnavailableException("AI 답변의 답변 가능 여부가 없습니다.");
            }
            if (!generated.answerable()) {
                return new AnswerResponse(
                        question,
                        AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE,
                        null,
                        List.of(),
                        searchResults
                );
            }
            Map<String, Integer> citationNumbers = new LinkedHashMap<>();
            String answer = renderAnswer(generated.paragraphs(), evidenceById.keySet(), citationNumbers);
            List<AnswerResponse.CitationResponse> citations = citationNumbers.keySet().stream()
                    .map(id -> citation(evidenceById.get(id)))
                    .toList();
            return new AnswerResponse(
                    question,
                    AnswerResponse.AnswerStatus.GENERATED,
                    answer,
                    citations,
                    searchResults
            );
        } catch (AnswerGenerationUnavailableException exception) {
            log.warn("AI 답변을 제공하지 못해 검색 결과만 반환합니다.", exception);
            return generationUnavailable(question, searchResults);
        }
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

    private AnswerResponse.CitationResponse citation(SearchHit hit) {
        return new AnswerResponse.CitationResponse(
                hit.chunk().chunkId(),
                hit.chunk().title(),
                hit.chunk().heading(),
                hit.chunk().sourceUrl(),
                hit.chunk().route(),
                responseMapper.toPlainText(hit.chunk().content())
        );
    }

    private AnswerResponse generationUnavailable(
            String question,
            List<com.ljkhyeong.portfolio.knowledge.api.SearchResultResponse> searchResults
    ) {
        return new AnswerResponse(
                question,
                AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE,
                null,
                List.of(),
                searchResults
        );
    }
}
