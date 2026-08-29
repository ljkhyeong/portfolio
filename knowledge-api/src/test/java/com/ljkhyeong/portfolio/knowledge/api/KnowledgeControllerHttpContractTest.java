package com.ljkhyeong.portfolio.knowledge.api;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ljkhyeong.portfolio.knowledge.search.KnowledgeAnswerService;
import com.ljkhyeong.portfolio.knowledge.search.KnowledgeSearchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class KnowledgeControllerHttpContractTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        KnowledgeController controller = new KnowledgeController(
                mock(KnowledgeSearchService.class),
                mock(KnowledgeAnswerService.class),
                new ResponseMapper()
        );
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void JSON_형식이_잘못되면_400을_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
    }

    @Test
    void GET으로_검색을_요청하면_405를_반환한다() throws Exception {
        mockMvc.perform(get("/api/v1/knowledge/search"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.code").value("METHOD_NOT_ALLOWED"));
    }

    @Test
    void JSON이_아닌_본문을_전송하면_415를_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("검색어"))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(jsonPath("$.code").value("UNSUPPORTED_MEDIA_TYPE"));
    }

    @Test
    void 검색_필터에_빈_값이_있으면_400을_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "query": "알림 재처리",
                                  "projectIds": [" "],
                                  "documentTypes": ["problem_solution"]
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
    }

    @Test
    void 답변_필터에_null이_있으면_400을_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/answers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "question": "알림은 어떻게 복구하나요?",
                                  "projectIds": ["baton"],
                                  "documentTypes": [null]
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
    }

    @Test
    void 공백을_제거한_검색어와_질문이_한_글자면_400을_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "query": " a"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.query")
                        .value("검색어는 2자 이상 300자 이하로 입력해 주세요."));

        mockMvc.perform(post("/api/v1/knowledge/answers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "question": " 가"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.question")
                        .value("질문은 2자 이상 300자 이하로 입력해 주세요."));
    }
}
