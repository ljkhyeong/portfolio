package com.ljkhyeong.portfolio.knowledge;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;

public final class TestFixtures {

    private TestFixtures() {
    }

    public static KnowledgeSourceDocument document(String documentId, String contentHash) {
        return new KnowledgeSourceDocument(
                "1.0",
                "sha256:revision",
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
                "public",
                "verified",
                "sha256:source",
                contentHash
        );
    }

    public static KnowledgeChunk chunk(String chunkId) {
        return new KnowledgeChunk(
                chunkId,
                "doc-1",
                "baton",
                "BATON",
                null,
                "problem_solution",
                "알림 재처리",
                "알림 아웃박스",
                "알림 처리 중단 시 DB에 기록된 이벤트를 다시 처리합니다.",
                null,
                "/projects/baton/#notification",
                "verified",
                "sha256:revision",
                "sha256:source",
                "sha256:content",
                "sha256:chunk",
                "test-model",
                List.of(1.0f, 0.0f)
        );
    }
}
