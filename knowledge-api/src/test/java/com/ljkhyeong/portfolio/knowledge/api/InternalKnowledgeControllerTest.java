package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.sync.KnowledgeSyncService;
import com.ljkhyeong.portfolio.knowledge.sync.KnowledgeSyncInProgressException;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class InternalKnowledgeControllerTest {

    @Test
    void 이미_동기화_중이면_409와_진행_중_코드를_반환한다() throws Exception {
        KnowledgeProperties properties = knowledgeProperties("source.sync-key", "configured-key");
        KnowledgeSyncService service = mock(KnowledgeSyncService.class);
        when(service.syncConfiguredManifest()).thenThrow(new KnowledgeSyncInProgressException());
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new InternalKnowledgeController(properties, service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/internal/v1/knowledge/sync").header("X-Knowledge-Sync-Key", "configured-key"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("SYNC_IN_PROGRESS"))
                .andExpect(jsonPath("$.message").value("공개 자료 동기화가 이미 실행 중입니다. 완료 후 자료 상태를 확인해 주세요."));
    }

    @Test
    void 동기화_키가_없으면_403을_반환한다() throws Exception {
        KnowledgeProperties properties = knowledgeProperties("source.sync-key", "configured-key");
        InternalKnowledgeController controller = new InternalKnowledgeController(
                properties,
                mock(KnowledgeSyncService.class)
        );
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/internal/v1/knowledge/sync"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("SYNC_FORBIDDEN"));
        mockMvc.perform(get("/internal/v1/knowledge/status"))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/internal/v1/knowledge/status").header("X-Knowledge-Sync-Key", "wrong-key"))
                .andExpect(status().isForbidden());
    }
}
