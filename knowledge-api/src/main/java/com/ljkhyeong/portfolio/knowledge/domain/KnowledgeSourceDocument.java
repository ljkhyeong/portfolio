package com.ljkhyeong.portfolio.knowledge.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import jakarta.validation.constraints.NotBlank;

public record KnowledgeSourceDocument(
        @NotBlank String documentId,
        @NotBlank String projectId,
        @NotBlank String projectName,
        String serviceId,
        @NotBlank String documentType,
        @NotBlank String title,
        String heading,
        @NotBlank String content,
        String sourceUrl,
        String route,
        @JsonProperty(required = true) @JsonSetter(nulls = Nulls.FAIL) Visibility visibility
) {

    public enum Visibility {
        @JsonProperty("public") PUBLIC,
        @JsonProperty("private") PRIVATE
    }
}
