package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.sync.KnowledgeSyncService;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;

class InternalKnowledgeControllerTest {

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
    }
}
