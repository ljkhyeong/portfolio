package com.ljkhyeong.portfolio.knowledge.search;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.chunk;
import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import com.ljkhyeong.portfolio.knowledge.api.AnswerResponse;
import com.ljkhyeong.portfolio.knowledge.api.ResponseMapper;
import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSearchResult;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort.AnswerParagraph;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort.GeneratedAnswer;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

class KnowledgeAnswerServiceTest {

    private final KnowledgeProperties properties = knowledgeProperties();
    private final KnowledgeSearchService searchService = mock(KnowledgeSearchService.class);
    private final AnswerGenerationPort answerGenerationPort = mock(AnswerGenerationPort.class);
    private final KnowledgeAnswerService service = new KnowledgeAnswerService(
            properties,
            searchService,
            answerGenerationPort,
            new ResponseMapper()
    );

    @BeforeEach
    void setUp() {
        when(searchService.search(anyString(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(
                        List.of(new SearchHit(chunk("evidence-1"), 0.000_001)),
                        Set.of("evidence-1")
                ));
    }

    @Test
    void AI_제공자에_실패해도_검색_결과를_유지한다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenThrow(new AnswerGenerationUnavailableException("provider error"));

        AnswerResponse response = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE);
        assertThat(response.answer()).isNull();
        assertThat(response.results()).hasSize(1);
    }

    @Test
    void 제공한_근거_ID만_인용으로_반환한다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated("1"));

        AnswerResponse response = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATED);
        assertThat(response.answer()).isEqualTo("알림 이벤트를 DB에 기록해 다시 처리합니다. [1]");
        assertThat(response.citations()).extracting(AnswerResponse.CitationResponse::chunkId)
                .containsExactly("evidence-1");
    }

    @Test
    void 인용이_없는_AI_답변은_노출하지_않는다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated());

        AnswerResponse response = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE);
        assertThat(response.answer()).isNull();
        assertThat(response.citations()).isEmpty();
    }

    @Test
    void 전달하지_않은_번호를_인용한_AI_답변은_노출하지_않는다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated("2"));

        AnswerResponse response = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE);
        assertThat(response.answer()).isNull();
        assertThat(response.citations()).isEmpty();
    }

    @Test
    void 임의의_긴_인용_ID도_제공한_근거가_아니면_노출하지_않는다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated("99999999999999999999"));

        AnswerResponse response = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE);
        assertThat(response.answer()).isNull();
        assertThat(response.citations()).isEmpty();
    }

    @Test
    void 모델이_공개_근거로_답할_수_없다고_하면_근거_부족으로_반환한다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(new GeneratedAnswer(false, List.of()));

        AnswerResponse response = service.answer("공개되지 않은 내부 설정은?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE);
        assertThat(response.answer()).isNull();
        assertThat(response.results()).hasSize(1);
    }

    @Test
    void BM25에서_적중한_검색_결과가_없으면_AI를_호출하지_않는다() {
        when(searchService.search(anyString(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(
                        List.of(new SearchHit(chunk("vector-only"), 0.9)),
                        Set.of()
                ));

        AnswerResponse response = service.answer("공개되지 않은 내부 설정은?", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE);
        assertThat(response.results()).hasSize(1);
        verify(answerGenerationPort, never()).generate(anyString(), anyList());
    }

    @Test
    void 임의의_코드_오류는_검색_결과로_대체하지_않고_전파한다() {
        IllegalStateException programmingError = new IllegalStateException("programming error");
        when(answerGenerationPort.generate(anyString(), anyList())).thenThrow(programmingError);

        assertThatThrownBy(() -> service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6))
                .isSameAs(programmingError);
    }
    @Test
    void 본문의_인용_번호와_출처_목록을_사용한_순서대로_맞춘다() {
        when(searchService.search(anyString(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(
                        List.of(new SearchHit(chunk("evidence-1"), 1), new SearchHit(chunk("evidence-2"), 1)),
                        Set.of("evidence-1")
                ));
        when(answerGenerationPort.generate(anyString(), anyList())).thenReturn(new GeneratedAnswer(true, List.of(
                new AnswerParagraph("  두 번째 근거의 설명입니다.  ", List.of("2", "2")),
                new AnswerParagraph("두 근거를 함께 설명합니다.", List.of("1", "2"))
        )));

        AnswerResponse response = service.answer("알림 복구", List.of(), List.of(), 6);

        assertThat(response.answer()).isEqualTo(
                "두 번째 근거의 설명입니다. [1]\n\n두 근거를 함께 설명합니다. [2] [1]"
        );
        assertThat(response.citations()).extracting(AnswerResponse.CitationResponse::chunkId)
                .containsExactly("evidence-2", "evidence-1");
    }

    @ParameterizedTest
    @MethodSource("incompleteAnswers")
    void 필수_답변_정보가_없으면_검색_결과만_반환한다(GeneratedAnswer answer) {
        when(answerGenerationPort.generate(anyString(), anyList())).thenReturn(answer);

        AnswerResponse response = service.answer("알림 복구", List.of(), List.of(), 6);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE);
        assertThat(response.answer()).isNull();
        assertThat(response.results()).hasSize(1);
    }

    private static Stream<GeneratedAnswer> incompleteAnswers() {
        return Stream.of(
                null,
                new GeneratedAnswer(null, List.of()),
                new GeneratedAnswer(true, null),
                new GeneratedAnswer(true, List.of()),
                new GeneratedAnswer(true, List.of(new AnswerParagraph(" ", List.of("1")))),
                new GeneratedAnswer(true, List.of(new AnswerParagraph("설명", null)))
        );
    }

    private GeneratedAnswer generated(String... citationIds) {
        return new GeneratedAnswer(true, List.of(new AnswerParagraph(
                "알림 이벤트를 DB에 기록해 다시 처리합니다.", List.of(citationIds)
        )));
    }
}
