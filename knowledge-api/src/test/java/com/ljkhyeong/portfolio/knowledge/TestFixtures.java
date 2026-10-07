package com.ljkhyeong.portfolio.knowledge;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mock.env.MockEnvironment;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeFilter;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;

public final class TestFixtures {

    public static final KnowledgeFilter NO_FILTER = new KnowledgeFilter(null, null, null);

    private TestFixtures() {
    }

    public static KnowledgeProperties knowledgeProperties(String... entries) {
        MockEnvironment environment = new MockEnvironment();
        for (int index = 0; index < entries.length; index += 2) {
            environment.withProperty("knowledge." + entries[index], entries[index + 1]);
        }
        return Binder.get(environment).bindOrCreate("knowledge", KnowledgeProperties.class);
    }

    // standalone MockMvc는 Boot 자동 설정 없이 실행되므로 오류 문구 파일을 직접 연결한다.
    public static MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
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

    public static SearchHit hit(KnowledgeChunk chunk) {
        return new SearchHit(chunk, null);
    }
}
