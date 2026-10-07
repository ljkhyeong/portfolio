package com.ljkhyeong.portfolio.knowledge;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.mock.env.MockEnvironment;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;

public final class TestFixtures {

    private TestFixtures() {
    }

    public static KnowledgeProperties knowledgeProperties(String... entries) {
        MockEnvironment environment = new MockEnvironment();
        for (int index = 0; index < entries.length; index += 2) {
            environment.withProperty("knowledge." + entries[index], entries[index + 1]);
        }
        return Binder.get(environment).bindOrCreate("knowledge", KnowledgeProperties.class);
    }

    public static KnowledgeSourceDocument document(String documentId) {
        return new KnowledgeSourceDocument(
                documentId,
                "baton",
                "BATON",
                null,
                "problem_solution",
                "알림 재처리",
                "알림 아웃박스",
                "알림 처리 중단 시 DB에 기록된 이벤트를 다시 처리합니다.",
                null,
                "/projects/baton/#notification",
                KnowledgeSourceDocument.Visibility.PUBLIC
        );
    }

    public static KnowledgeChunk chunk(String chunkId) {
        return chunk(chunkId, "doc-1");
    }

    public static KnowledgeChunk chunk(String chunkId, String documentId) {
        return chunk(chunkId, documentId, "알림 처리 중단 시 DB에 기록된 이벤트를 다시 처리합니다.");
    }

    public static KnowledgeChunk chunk(String chunkId, String documentId, String content) {
        return new KnowledgeChunk(
                chunkId,
                documentId,
                "baton",
                "BATON",
                null,
                "problem_solution",
                "알림 재처리",
                "알림 아웃박스",
                content,
                null,
                "/projects/baton/#notification",
                "test-model",
                List.of(1.0f, 0.0f)
        );
    }
}
