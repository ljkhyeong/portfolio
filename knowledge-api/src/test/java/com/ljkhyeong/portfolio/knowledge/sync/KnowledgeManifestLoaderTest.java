package com.ljkhyeong.portfolio.knowledge.sync;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.document;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

class KnowledgeManifestLoaderTest {

    @Test
    void public_문서만_동기화_대상으로_남긴다() {
        String json = """
                {
                  "schemaVersion":"1.0",
                  "sourceRevision":"sha256:revision",
                  "documents":[
                    {
                      "documentId":"public-doc",
                      "projectId":"baton",
                      "projectName":"BATON",
                      "documentType":"project_overview",
                      "title":"공개 문서",
                      "content":"공개된 프로젝트 설명입니다.",
                      "route":"/projects/baton/",
                      "visibility":"public",
                      "sourceHash":"sha256:public-source",
                      "contentHash":"sha256:public"
                    },
                    {
                      "documentId":"private-doc",
                      "visibility":"private"
                    }
                  ]
                }
                """;
        ResourceLoader resourceLoader = new ResourceLoader() {
            @Override
            public ByteArrayResource getResource(String location) {
                return new ByteArrayResource(json.getBytes(StandardCharsets.UTF_8));
            }

            @Override
            public ClassLoader getClassLoader() {
                return getClass().getClassLoader();
            }
        };
        try (LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean()) {
            validator.afterPropertiesSet();
            KnowledgeManifestLoader loader = new KnowledgeManifestLoader(
                    resourceLoader, new JsonMapper(), validator, knowledgeProperties());

            var manifest = loader.load("memory:portfolio.json");

            assertThat(manifest.documents()).extracting(document -> document.documentId())
                    .containsExactly("public-doc");
        }
    }

    @Test
    void 공개_문서의_필수값을_표준_검증으로_확인한다() {
        var mapper = new JsonMapper();
        var document = document("doc-1", "sha256:content");
        var invalidDocument = mapper.valueToTree(document).deepCopy();
        ((ObjectNode) invalidDocument).put("title", " ");
        byte[] json = mapper.writeValueAsBytes(Map.of(
                "schemaVersion", "1.0",
                "sourceRevision", "sha256:revision",
                "documents", List.of(invalidDocument)
        ));
        ResourceLoader resources = mock(ResourceLoader.class);
        when(resources.getResource("memory:invalid.json")).thenReturn(new ByteArrayResource(json));
        try (LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean()) {
            validator.afterPropertiesSet();
            var loader = new KnowledgeManifestLoader(resources, mapper, validator, knowledgeProperties());

            assertThatThrownBy(() -> loader.load("memory:invalid.json"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("title");
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"null", "{\"schemaVersion\":", "invalid-json"})
    void 잘못된_JSON과_빈_자료를_거부한다(String json) {
        ResourceLoader resources = mock(ResourceLoader.class);
        when(resources.getResource("memory:invalid.json"))
                .thenReturn(new ByteArrayResource(json.getBytes(StandardCharsets.UTF_8)));
        try (LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean()) {
            validator.afterPropertiesSet();
            var loader = new KnowledgeManifestLoader(resources, new JsonMapper(), validator, knowledgeProperties());

            assertThatThrownBy(() -> loader.load("memory:invalid.json"))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }

    @Test
    void 로컬_자료에도_동일한_용량_제한을_적용한다() {
        ResourceLoader resources = mock(ResourceLoader.class);
        when(resources.getResource("memory:large.json")).thenReturn(new ByteArrayResource(new byte[65]));
        try (LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean()) {
            validator.afterPropertiesSet();
            var loader = new KnowledgeManifestLoader(resources, new JsonMapper(), validator,
                    knowledgeProperties("source.max-bytes", "64"));

            assertThatThrownBy(() -> loader.load("memory:large.json"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("용량 제한");
        }
    }

}
