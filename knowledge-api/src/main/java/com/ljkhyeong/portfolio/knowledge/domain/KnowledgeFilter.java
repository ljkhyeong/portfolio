package com.ljkhyeong.portfolio.knowledge.domain;

import java.util.List;
import java.util.Locale;

// 필터 값은 앞뒤 공백을 지우고 소문자로 바꾼 뒤 빈 값과 중복을 뺀다. 누락된 필터는 빈 목록이다.
public record KnowledgeFilter(
        List<String> projectIds,
        List<String> serviceIds,
        List<String> documentTypes
) {

    public KnowledgeFilter {
        projectIds = normalize(projectIds);
        serviceIds = normalize(serviceIds);
        documentTypes = normalize(documentTypes);
    }

    private static List<String> normalize(List<String> values) {
        if (values == null) {
            return List.of();
        }
        return values.stream()
                .map(String::strip)
                .map(value -> value.toLowerCase(Locale.ROOT))
                .filter(value -> !value.isEmpty())
                .distinct()
                .toList();
    }
}
