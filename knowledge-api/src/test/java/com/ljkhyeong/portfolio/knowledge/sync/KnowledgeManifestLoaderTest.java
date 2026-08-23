package com.ljkhyeong.portfolio.knowledge.sync;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ResourceLoader;
import tools.jackson.databind.json.JsonMapper;

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
        KnowledgeManifestLoader loader = new KnowledgeManifestLoader(resourceLoader, new JsonMapper());

        var manifest = loader.load("memory:portfolio.json");

        assertThat(manifest.documents()).extracting(document -> document.documentId())
                .containsExactly("public-doc");
    }
}
