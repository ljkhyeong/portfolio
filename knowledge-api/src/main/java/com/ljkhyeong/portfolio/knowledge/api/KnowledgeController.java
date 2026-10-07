package com.ljkhyeong.portfolio.knowledge.api;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.search.KnowledgeAnswerService;
import com.ljkhyeong.portfolio.knowledge.search.KnowledgeSearchService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/knowledge", produces = MediaType.APPLICATION_JSON_VALUE)
public class KnowledgeController {

    private final KnowledgeSearchService searchService;
    private final KnowledgeAnswerService answerService;
    private final ResponseMapper responseMapper;

    public KnowledgeController(
            KnowledgeSearchService searchService,
            KnowledgeAnswerService answerService,
            ResponseMapper responseMapper
    ) {
        this.searchService = searchService;
        this.answerService = answerService;
        this.responseMapper = responseMapper;
    }

    @PostMapping(path = "/search", consumes = MediaType.APPLICATION_JSON_VALUE)
    public SearchResponse search(@Valid @RequestBody SearchRequest request) {
        var filter = new KnowledgeFilter(request.projectIds(), request.serviceIds(), request.documentTypes());
        return responseMapper.toSearchResponse(searchService.search(request.query(), filter, request.limit()).hits());
    }

    @PostMapping(path = "/answers", consumes = MediaType.APPLICATION_JSON_VALUE)
    public AnswerResponse answer(@Valid @RequestBody AnswerRequest request) {
        var filter = new KnowledgeFilter(request.projectIds(), request.serviceIds(), request.documentTypes());
        return responseMapper.toAnswerResponse(answerService.answer(request.question(), filter, request.limit()));
    }
}
