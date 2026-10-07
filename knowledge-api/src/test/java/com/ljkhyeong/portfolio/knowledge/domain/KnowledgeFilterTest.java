package com.ljkhyeong.portfolio.knowledge.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class KnowledgeFilterTest {

    @Test
    void 누락된_필터는_빈_목록으로_만든다() {
        KnowledgeFilter filter = new KnowledgeFilter(null, null, null);

        assertThat(filter.projectIds()).isEmpty();
        assertThat(filter.serviceIds()).isEmpty();
        assertThat(filter.documentTypes()).isEmpty();
    }

    @Test
    void 프로젝트와_서비스와_문서_종류에_같은_정규화_규칙을_적용한다() {
        KnowledgeFilter filter = new KnowledgeFilter(
                List.of(" BATON ", "baton", ""),
                List.of(" GO ", "go", " "),
                List.of(" PROJECT_OVERVIEW ", "project_overview", " ")
        );

        assertThat(filter.projectIds()).containsExactly("baton");
        assertThat(filter.serviceIds()).containsExactly("go");
        assertThat(filter.documentTypes()).containsExactly("project_overview");
        assertThat(filter).isEqualTo(new KnowledgeFilter(List.of("baton"), List.of("go"), List.of("project_overview")));
    }
}
