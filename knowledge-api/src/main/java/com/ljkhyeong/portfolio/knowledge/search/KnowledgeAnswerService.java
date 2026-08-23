package com.ljkhyeong.portfolio.knowledge.search;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

@Service
public class KnowledgeAnswerService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeAnswerService.class);
    private static final Pattern CITATION_PATTERN = Pattern.compile("\\[(\\d+)]");

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
        int limit = requestedLimit == null ? properties.getAi().getAnswerContextLimit() : requestedLimit;
        KnowledgeSearchResult searchResult = searchService.search(question, projectIds, documentTypes, limit);
        List<SearchHit> hits = searchResult.hits();
        var searchResults = responseMapper.toSearchResults(hits, question);

        if (!searchResult.hasBm25Evidence()) {
            return new AnswerResponse(
                    question,
                    AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE,
                    null,
                    List.of(),
                    searchResults
            );
        }

        List<AnswerGenerationPort.AnswerContext> contexts = new ArrayList<>(hits.size());
        for (int index = 0; index < hits.size(); index++) {
            SearchHit hit = hits.get(index);
            contexts.add(new AnswerGenerationPort.AnswerContext(
                    String.valueOf(index + 1),
                    hit.chunk().title(),
                    hit.chunk().heading(),
                    hit.chunk().content()
            ));
        }

        try {
            String answer = answerGenerationPort.generate(question, contexts);
            if (answer.contains("공개된 자료에서 확인할 수 없습니다.")) {
                return new AnswerResponse(
                        question,
                        AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE,
                        null,
                        List.of(),
                        searchResults
                );
            }
            Set<Integer> citedIndexes = extractAndValidateCitations(answer, hits.size());
            List<AnswerResponse.CitationResponse> citations = citedIndexes.stream()
                    .map(index -> citation(hits.get(index - 1), question))
                    .toList();
            return new AnswerResponse(
                    question,
                    AnswerResponse.AnswerStatus.GENERATED,
                    answer,
                    citations,
                    searchResults
            );
        } catch (AnswerGenerationUnavailableException exception) {
            log.warn("AI 답변을 제공하지 못해 검색 결과만 반환합니다: {}", exception.getMessage());
            return generationUnavailable(question, searchResults);
        } catch (RuntimeException exception) {
            log.warn("AI 답변 제공자 호출에 실패해 검색 결과만 반환합니다: {}", exception.getMessage());
            return generationUnavailable(question, searchResults);
        }
    }

    private Set<Integer> extractAndValidateCitations(String answer, int contextCount) {
        Matcher matcher = CITATION_PATTERN.matcher(answer);
        Set<Integer> citedIndexes = new LinkedHashSet<>();
        while (matcher.find()) {
            int citation = Integer.parseInt(matcher.group(1));
            if (citation < 1 || citation > contextCount) {
                throw new AnswerGenerationUnavailableException("AI 답변에 제공하지 않은 인용 번호가 포함됐습니다.");
            }
            citedIndexes.add(citation);
        }
        if (citedIndexes.isEmpty()) {
            throw new AnswerGenerationUnavailableException("AI 답변에 근거 인용이 없습니다.");
        }
        return citedIndexes;
    }

    private AnswerResponse.CitationResponse citation(SearchHit hit, String question) {
        return new AnswerResponse.CitationResponse(
                hit.chunk().chunkId(),
                hit.chunk().title(),
                hit.chunk().heading(),
                hit.chunk().sourceUrl(),
                hit.chunk().route(),
                responseMapper.snippet(hit.chunk().content(), question)
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
