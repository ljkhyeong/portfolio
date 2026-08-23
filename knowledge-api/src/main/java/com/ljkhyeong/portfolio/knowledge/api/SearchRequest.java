package com.ljkhyeong.portfolio.knowledge.api;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SearchRequest(
        @NotBlank(message = "검색어를 입력해 주세요.")
        @Size(min = 2, max = 300, message = "검색어는 2자 이상 300자 이하로 입력해 주세요.")
        String query,
        @Size(max = 10, message = "프로젝트 필터는 최대 10개까지 선택할 수 있습니다.")
        List<@NotBlank(message = "프로젝트 필터 값을 확인해 주세요.") String> projectIds,
        @Size(max = 6, message = "문서 종류 필터는 최대 6개까지 선택할 수 있습니다.")
        List<@NotBlank(message = "문서 종류 필터 값을 확인해 주세요.") String> documentTypes,
        @Min(value = 1, message = "검색 결과 수는 1개 이상이어야 합니다.")
        @Max(value = 20, message = "검색 결과는 최대 20개까지 요청할 수 있습니다.")
        Integer limit
) {
}
