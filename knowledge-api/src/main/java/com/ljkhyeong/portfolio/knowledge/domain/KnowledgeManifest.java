package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

public record KnowledgeManifest(
        String schemaVersion,
        String sourceRevision,
        // 누락, null과 null 항목을 빈 목록으로 바꾸지 않는다.
        @JsonProperty(required = true) @JsonSetter(nulls = Nulls.FAIL, contentNulls = Nulls.FAIL)
        List<KnowledgeSourceDocument> documents
) {

    public KnowledgeManifest {
        documents = List.copyOf(documents);
    }
}
