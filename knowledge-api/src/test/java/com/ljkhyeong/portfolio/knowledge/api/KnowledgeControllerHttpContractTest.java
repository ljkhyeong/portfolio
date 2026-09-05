package com.ljkhyeong.portfolio.knowledge.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ljkhyeong.portfolio.knowledge.search.KnowledgeAnswerService;
import com.ljkhyeong.portfolio.knowledge.search.KnowledgeSearchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.ErrorResponseException;

class KnowledgeControllerHttpContractTest {

    private final KnowledgeSearchService searchService = mock(KnowledgeSearchService.class);
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        KnowledgeController controller = new KnowledgeController(
                searchService,
                mock(KnowledgeAnswerService.class),
                new ResponseMapper()
        );
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void 없는_API_주소는_404를_반환한다() throws Exception {
        mockMvc.perform(get("/api/v1/knowledge/not-found").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("요청한 주소를 찾을 수 없습니다."));
    }

    @Test
    void Spring_HTTP_예외의_상태와_헤더를_유지한다() throws Exception {
        var exception = new ErrorResponseException(HttpStatus.TOO_MANY_REQUESTS);
        exception.getHeaders().set(HttpHeaders.RETRY_AFTER, "60");
        when(searchService.search(anyString(), any(), any(), any())).thenThrow(exception);

        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string(HttpHeaders.RETRY_AFTER, "60"))
                .andExpect(jsonPath("$.code").value("HTTP_ERROR"));
    }

    @Test
    void 예상하지_못한_코드_오류는_500을_반환한다() throws Exception {
        when(searchService.search(anyString(), any(), any(), any()))
                .thenThrow(new IllegalStateException("내부 오류 세부 정보"));

        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("INTERNAL_ERROR"))
                .andExpect(jsonPath("$.message").value("요청을 처리하지 못했습니다."));
    }

    @Test
    void 지원하지_않는_응답_형식은_406을_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_XML)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isNotAcceptable());
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
                .andExpect(header().string(HttpHeaders.ALLOW, "POST"))
                .andExpect(jsonPath("$.code").value("METHOD_NOT_ALLOWED"));
    }

    @Test
    void JSON이_아닌_본문을_전송하면_415를_반환한다() throws Exception {
        mockMvc.perform(post("/api/v1/knowledge/search")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("검색어"))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(header().string(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
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
