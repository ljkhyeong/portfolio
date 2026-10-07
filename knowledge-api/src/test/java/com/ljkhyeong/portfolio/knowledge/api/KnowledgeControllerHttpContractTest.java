package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.messageSource;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ljkhyeong.portfolio.knowledge.search.KnowledgeAnswerService;
import com.ljkhyeong.portfolio.knowledge.search.KnowledgeSearchService;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.verification.KnowledgeHumanVerificationService;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.setup.StandaloneMockMvcBuilder;
import org.springframework.web.ErrorResponseException;

class KnowledgeControllerHttpContractTest {

    private static final String SEARCH_PATH = "/api/v1/knowledge/search";
    private static final String ANSWER_PATH = "/api/v1/knowledge/answers";

    private final KnowledgeSearchService searchService = mock(KnowledgeSearchService.class);
    private final KnowledgeAnswerService answerService = mock(KnowledgeAnswerService.class);
    private final SimpleMeterRegistry meters = new SimpleMeterRegistry();
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = mockMvcBuilder().build();
    }

    private StandaloneMockMvcBuilder mockMvcBuilder() {
        KnowledgeController controller = new KnowledgeController(
                searchService,
                answerService,
                new ResponseMapper(),
                meters
        );
        GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();
        exceptionHandler.setMessageSource(messageSource());
        return MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(exceptionHandler);
    }

    @ParameterizedTest
    @EnumSource(AnswerResponse.AnswerStatus.class)
    void HTTP_성공과_별개로_AI_답변_결과를_구분한다(AnswerResponse.AnswerStatus answerStatus) throws Exception {
        when(answerService.answer(anyString(), any(), any(), any(), any())).thenReturn(
                new AnswerResponse("복구 방법", answerStatus, null, List.of(), List.of()));

        mockMvc.perform(post(ANSWER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"복구 방법\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(answerStatus.name()));

        assertThat(meters.get("knowledge.answers").tag("status", answerStatus.name())
                .counter().count()).isEqualTo(1);
    }

    @Test
    void 없는_API_주소는_404를_RFC_9457_형식으로_반환한다() throws Exception {
        mockMvc.perform(get("/api/v1/knowledge/not-found").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.code").value("NOT_FOUND"))
                .andExpect(jsonPath("$.detail").value("요청한 주소를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.fieldErrors").doesNotExist());
    }

    @Test
    void Spring_HTTP_예외의_상태와_헤더를_유지한다() throws Exception {
        var exception = new ErrorResponseException(HttpStatus.TOO_MANY_REQUESTS);
        exception.getHeaders().set(HttpHeaders.RETRY_AFTER, "60");
        when(searchService.search(anyString(), any(), any(), any(), any())).thenThrow(exception);

        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string(HttpHeaders.RETRY_AFTER, "60"))
                .andExpect(jsonPath("$.code").value("TOO_MANY_REQUESTS"));
    }

    @Test
    void 호출_제한_인터셉터의_거절은_코드와_Retry_After를_반환한다() throws Exception {
        KnowledgeRateLimiter limiter = new KnowledgeRateLimiter(
                knowledgeProperties("rate-limit.client-searches-per-minute", "1"),
                Clock.fixed(Instant.parse("2026-10-07T12:00:30Z"), ZoneOffset.UTC)
        );
        MockMvc limited = mockMvcBuilder()
                .addMappedInterceptors(
                        new String[]{SEARCH_PATH},
                        new KnowledgeRateLimitInterceptor(limiter, KnowledgeRateLimiter.RequestKind.SEARCH)
                )
                .build();
        when(searchService.search(anyString(), any(), any(), any(), any()))
                .thenReturn(new KnowledgeSearchResult(List.of(), List.of(), Set.of()));

        limited.perform(post(SEARCH_PATH).contentType(MediaType.APPLICATION_JSON).content("{\"query\":\"알림\"}"))
                .andExpect(status().isOk());
        limited.perform(post(SEARCH_PATH).contentType(MediaType.APPLICATION_JSON).content("{\"query\":\"알림\"}"))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string(HttpHeaders.RETRY_AFTER, "30"))
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.code").value("SEARCH_RATE_LIMITED"))
                .andExpect(jsonPath("$.detail").value("요청이 많습니다. 잠시 후 다시 시도해 주세요."));
    }

    @Test
    void 자동_요청_방지_확인_장애는_503과_전용_코드를_반환한다() throws Exception {
        KnowledgeHumanVerificationService verificationService = mock(KnowledgeHumanVerificationService.class);
        when(verificationService.verify(any(), any()))
                .thenReturn(KnowledgeHumanVerificationService.Decision.UNAVAILABLE);
        MockMvc verified = mockMvcBuilder()
                .addMappedInterceptors(
                        new String[]{ANSWER_PATH},
                        new KnowledgeHumanVerificationInterceptor(verificationService)
                )
                .build();

        verified.perform(post(ANSWER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"복구 방법\"}"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.code").value("HUMAN_VERIFICATION_UNAVAILABLE"));
        verifyNoInteractions(answerService);
    }

    @Test
    void 예상하지_못한_코드_오류는_500을_반환한다() throws Exception {
        when(searchService.search(anyString(), any(), any(), any(), any()))
                .thenThrow(new IllegalStateException("내부 오류 세부 정보"));

        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("INTERNAL_SERVER_ERROR"))
                .andExpect(jsonPath("$.detail").value("요청을 처리하지 못했습니다."));
    }

    @Test
    void 서비스의_IllegalArgumentException은_입력_오류가_아니라_500으로_숨긴다() throws Exception {
        when(searchService.search(anyString(), any(), any(), any(), any()))
                .thenThrow(new IllegalArgumentException("내부 세부 정보"));

        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("INTERNAL_SERVER_ERROR"))
                .andExpect(content().string(not(containsString("내부 세부 정보"))));
    }

    @Test
    void 지원하지_않는_응답_형식은_406을_반환한다() throws Exception {
        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_XML)
                        .content("{\"query\":\"알림\"}"))
                .andExpect(status().isNotAcceptable())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.code").value("NOT_ACCEPTABLE"))
                .andExpect(jsonPath("$.detail").value("응답 형식은 application/json만 지원합니다."));
    }

    @Test
    void JSON_형식이_잘못되면_400을_반환한다() throws Exception {
        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.detail").value("JSON 요청 형식을 확인해 주세요."));
    }

    @Test
    void GET으로_검색을_요청하면_405를_반환한다() throws Exception {
        mockMvc.perform(get(SEARCH_PATH))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(header().string(HttpHeaders.ALLOW, "POST"))
                .andExpect(jsonPath("$.code").value("METHOD_NOT_ALLOWED"))
                .andExpect(jsonPath("$.detail").value("지원하지 않는 HTTP 메소드입니다."));
    }

    @Test
    void JSON이_아닌_본문을_전송하면_415를_반환한다() throws Exception {
        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("검색어"))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(header().string(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.code").value("UNSUPPORTED_MEDIA_TYPE"));
    }

    @Test
    void 검색_필터에_빈_값이_있으면_400을_반환한다() throws Exception {
        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "query": "알림 재처리",
                                  "projectIds": [" "],
                                  "documentTypes": ["problem_solution"]
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.detail").value("요청 값을 확인해 주세요."))
                .andExpect(jsonPath("$.fieldErrors['projectIds[0]']").value("프로젝트 필터 값을 확인해 주세요."));
    }

    @Test
    void 답변_필터에_null이_있으면_400을_반환한다() throws Exception {
        mockMvc.perform(post(ANSWER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "question": "알림은 어떻게 복구하나요?",
                                  "projectIds": ["baton"],
                                  "documentTypes": [null]
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @ParameterizedTest
    @CsvSource({SEARCH_PATH + ", query", ANSWER_PATH + ", question"})
    void 지원하지_않는_문서_종류는_서비스_호출_전에_400으로_거부한다(String path, String textField) throws Exception {
        mockMvc.perform(post(path)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "%s": "알림 재처리",
                                  "documentTypes": [" PROBLEM_SOLUTION ", "private"]
                                }
                                """.formatted(textField)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.fieldErrors['documentTypes[1]']").value("지원하지 않는 문서 종류입니다."))
                .andExpect(jsonPath("$.fieldErrors['documentTypes[0]']").doesNotExist());
        verifyNoInteractions(searchService, answerService);
    }

    @Test
    void 검색과_답변에_서비스_필터를_전달한다() throws Exception {
        when(searchService.search(anyString(), any(), any(), any(), any()))
                .thenReturn(new KnowledgeSearchResult(List.of(), List.of(), Set.of()));
        when(answerService.answer(anyString(), any(), any(), any(), any()))
                .thenReturn(new AnswerResponse(
                        "링크 중복 생성",
                        AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE,
                        null,
                        List.of(),
                        List.of()
                ));

        String filters = """
                "projectIds": ["baton"],
                "serviceIds": ["go"],
                "documentTypes": ["problem_solution"],
                "limit": 6
                """;
        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"링크 중복 생성\"," + filters + "}"))
                .andExpect(status().isOk());
        mockMvc.perform(post(ANSWER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"링크 중복 생성\"," + filters + "}"))
                .andExpect(status().isOk());

        verify(searchService).search(
                "링크 중복 생성",
                List.of("baton"),
                List.of("go"),
                List.of("problem_solution"),
                6
        );
        verify(answerService).answer(
                "링크 중복 생성",
                List.of("baton"),
                List.of("go"),
                List.of("problem_solution"),
                6
        );
    }

    @Test
    void 공백을_제거한_검색어와_질문이_한_글자면_400을_반환한다() throws Exception {
        mockMvc.perform(post(SEARCH_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "query": " a"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.query")
                        .value("검색어는 2자 이상 300자 이하로 입력해 주세요."));

        mockMvc.perform(post(ANSWER_PATH)
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
