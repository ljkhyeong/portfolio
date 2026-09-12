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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
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
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.mockito.ArgumentCaptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

class KnowledgeAnswerServiceTest {

    private final KnowledgeProperties properties = knowledgeProperties();
    private final SimpleMeterRegistry meters = new SimpleMeterRegistry();
    private final KnowledgeSearchService searchService = mock(KnowledgeSearchService.class);
    private final AnswerGenerationPort answerGenerationPort = mock(AnswerGenerationPort.class);
    private final KnowledgeAnswerService service = new KnowledgeAnswerService(
            properties,
            searchService,
            answerGenerationPort,
            new ResponseMapper(),
            meters
    );

    @BeforeEach
    void setUp() {
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(
                        List.of(new SearchHit(chunk("evidence-1"), 0.000_001)),
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
    void 같은_질문과_근거의_검증된_답변을_재사용한다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated("1"));

        AnswerResponse first = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);
        AnswerResponse second = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(second.answer()).isEqualTo(first.answer());
        assertThat(second.citations()).isEqualTo(first.citations());
        assertThat(cacheLookups("answer", "miss")).isEqualTo(1);
        assertThat(cacheLookups("answer", "hit")).isEqualTo(1);
        verify(answerGenerationPort).generate(anyString(), anyList());
    }

    @Test
    void 같은_질문과_근거의_동시_요청을_한_번만_생성한다() throws Exception {
        CountDownLatch searchesCompleted = new CountDownLatch(2);
        CountDownLatch generationStarted = new CountDownLatch(1);
        CountDownLatch generationRelease = new CountDownLatch(1);
        KnowledgeSearchResult result = new KnowledgeSearchResult(
                List.of(new SearchHit(chunk("evidence-1"), 1)),
                List.of(new SearchHit(chunk("evidence-1"), 1)),
                Set.of("evidence-1")
        );
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenAnswer(invocation -> {
                    searchesCompleted.countDown();
                    return result;
                });
        when(answerGenerationPort.generate(anyString(), anyList())).thenAnswer(invocation -> {
            generationStarted.countDown();
            if (!generationRelease.await(2, TimeUnit.SECONDS)) {
                throw new IllegalStateException("동시 요청 대기 시간이 초과됐습니다.");
            }
            return generated("1");
        });

        try (var executor = Executors.newFixedThreadPool(2)) {
            var first = executor.submit(() -> service.answer(
                    "알림은 어떻게 복구하나요?", List.of(), List.of(), 6
            ));
            assertThat(generationStarted.await(2, TimeUnit.SECONDS)).isTrue();
            var second = executor.submit(() -> service.answer(
                    "알림은 어떻게 복구하나요?", List.of(), List.of(), 6
            ));
            assertThat(searchesCompleted.await(2, TimeUnit.SECONDS)).isTrue();
            generationRelease.countDown();

            assertThat(first.get(2, TimeUnit.SECONDS).status())
                    .isEqualTo(AnswerResponse.AnswerStatus.GENERATED);
            assertThat(second.get(2, TimeUnit.SECONDS).status())
                    .isEqualTo(AnswerResponse.AnswerStatus.GENERATED);
        }
        assertThat(cacheLookups("answer", "miss")).isEqualTo(1);
        assertThat(cacheLookups("answer", "hit")).isEqualTo(1);
        verify(answerGenerationPort).generate(anyString(), anyList());
    }

    @Test
    void 같은_질문이어도_전달_근거가_바뀌면_답변을_다시_생성한다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated("1"));

        service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        SearchHit changed = new SearchHit(chunk(
                "evidence-1", "doc-1", "알림 처리 상태를 조회해 실패 건만 다시 처리합니다."
        ), 1);
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(List.of(changed), List.of(changed), Set.of("evidence-1")));

        service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        verify(answerGenerationPort, times(2)).generate(anyString(), anyList());
    }

    @Test
    void AI_제공자_실패는_캐시하지_않는다() {
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenThrow(new AnswerGenerationUnavailableException("provider error"))
                .thenReturn(generated("1"));

        AnswerResponse first = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);
        AnswerResponse second = service.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(first.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATION_UNAVAILABLE);
        assertThat(second.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATED);
        verify(answerGenerationPort, times(2)).generate(anyString(), anyList());
    }

    @Test
    void 답변_캐시_상한이_0이면_답변을_재사용하지_않는다() {
        KnowledgeProperties noCacheProperties = knowledgeProperties("ai.answer-cache-max-entries", "0");
        KnowledgeAnswerService noCacheService = new KnowledgeAnswerService(
                noCacheProperties, searchService, answerGenerationPort, new ResponseMapper(), meters
        );
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated("1"));

        noCacheService.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);
        noCacheService.answer("알림은 어떻게 복구하나요?", List.of(), List.of(), 6);

        assertThat(cacheLookups("answer", "disabled")).isEqualTo(2);
        verify(answerGenerationPort, times(2)).generate(anyString(), anyList());
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
    void 인용은_검색_발췌문_뒤의_내용까지_전체_근거를_반환한다() {
        String passage = "**실패한 알림**은 DB에서 읽어 재처리합니다.";
        String lastSentence = "단, 이미 처리한 이벤트는 같은 키로 다시 실행하지 않습니다.";
        String content = passage + "\n\n" + "처리 상태와 이벤트 ID를 함께 기록합니다. ".repeat(25)
                + "\n\n" + lastSentence;
        SearchHit hit = new SearchHit(chunk("evidence-1", "doc", content), 1, passage);
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(List.of(hit), List.of(hit), Set.of("evidence-1")));
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(new GeneratedAnswer(true, List.of(new AnswerParagraph(lastSentence, List.of("1")))));

        AnswerResponse response = service.answer("알림 재처리", List.of(), List.of(), 1);

        assertThat(response.citations().getFirst().excerpt()).hasSizeGreaterThan(280)
                .startsWith("실패한 알림은 DB에서 읽어 재처리합니다.")
                .endsWith(lastSentence).doesNotContain("**", "…");
        assertThat(response.results().getFirst().snippet())
                .isEqualTo("실패한 알림은 DB에서 읽어 재처리합니다.…");
        assertThat(generatedContexts()).extracting(AnswerGenerationPort.AnswerContext::content)
                .containsExactly(content);
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
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(
                        List.of(new SearchHit(chunk("vector-only"), 0.9)),
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
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(
                        List.of(new SearchHit(chunk("evidence-1"), 1)),
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

    @Test
    void 대표_문단과_다른_키워드_근거도_답변에_전달하고_인용한다() {
        var index = mock(com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort.class);
        var embedding = mock(com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort.class);
        SearchHit semantic = new SearchHit(chunk("doc#000", "doc", "작업자가 알림을 처리합니다."), 1);
        SearchHit keyword = new SearchHit(chunk("doc#001", "doc", "실패한 이벤트는 DB에서 읽어 재처리합니다."), 1);
        when(embedding.available()).thenReturn(true);
        when(embedding.embed(anyList())).thenReturn(List.of(List.of(1f, 0f)));
        when(index.searchBm25(anyString(), any(), org.mockito.ArgumentMatchers.anyInt()))
                .thenReturn(List.of(keyword));
        when(index.searchKnn(anyList(), any(), org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt()))
                .thenReturn(List.of(semantic));
        var realSearch = new KnowledgeSearchService(properties, embedding,
                mock(com.ljkhyeong.portfolio.knowledge.index.KnowledgeIndexInitializer.class), index,
                new RrfRanker(), new io.micrometer.core.instrument.simple.SimpleMeterRegistry());
        var answerService = new KnowledgeAnswerService(
                properties, realSearch, answerGenerationPort, new ResponseMapper(), meters
        );
        when(answerGenerationPort.generate(anyString(), anyList())).thenReturn(generated("1", "2"));

        AnswerResponse response = answerService.answer("실패한 알림 재처리", List.of(), List.of(), 1);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.GENERATED);
        assertThat(response.results()).extracting(result -> result.chunkId()).containsExactly("doc#000");
        assertThat(response.citations()).extracting(AnswerResponse.CitationResponse::chunkId)
                .containsExactly("doc#001", "doc#000");
        assertThat(generatedContexts()).extracting(AnswerGenerationPort.AnswerContext::content)
                .containsExactly(keyword.chunk().content(), semantic.chunk().content());
    }

    @Test
    void 선택한_문서_밖의_키워드_근거로_AI_답변을_허용하지_않는다() {
        SearchHit selected = new SearchHit(chunk("selected#0", "selected"), 1);
        SearchHit outside = new SearchHit(chunk("outside#0", "outside"), 0.1);
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(List.of(selected), List.of(selected, outside), Set.of("outside#0")));

        AnswerResponse response = service.answer("공개되지 않은 내용", List.of(), List.of(), 1);

        assertThat(response.status()).isEqualTo(AnswerResponse.AnswerStatus.INSUFFICIENT_EVIDENCE);
        verify(answerGenerationPort, never()).generate(anyString(), anyList());
    }

    @Test
    void 문서별_문단_상한과_전체_본문_예산_안에서_근거를_전달한다() {
        List<SearchHit> candidates = new ArrayList<>();
        List<SearchHit> hits = new ArrayList<>();
        for (int document = 0; document < 6; document++) {
            for (int part = 0; part < 4; part++) {
                SearchHit hit = new SearchHit(chunk(document + "#" + part, "doc-" + document,
                        "복구 정책을 설명합니다. ".repeat(75)), 1);
                candidates.add(hit);
                if (part == 0) {
                    hits.add(hit);
                }
            }
        }
        when(searchService.search(anyString(), anyList(), anyList(), anyList(), any()))
                .thenReturn(new KnowledgeSearchResult(hits, candidates, Set.of("0#3")));
        when(answerGenerationPort.generate(anyString(), anyList())).thenReturn(generated("1"));

        service.answer("복구 정책", List.of(), List.of(), 6);

        List<AnswerGenerationPort.AnswerContext> contexts = generatedContexts();
        assertThat(contexts).hasSizeGreaterThan(hits.size());
        assertThat(contexts.stream().mapToInt(context -> context.content().length()).sum()).isLessThanOrEqualTo(12_000);
        // 인용 ID로 실제 전달한 청크를 확인해 문서별 상한과 키워드 근거 확보를 검증한다.
        when(answerGenerationPort.generate(anyString(), anyList()))
                .thenReturn(generated(contexts.stream().map(AnswerGenerationPort.AnswerContext::citationId).toArray(String[]::new)));
        AnswerResponse response = service.answer("복구 정책 전체", List.of(), List.of(), 6);
        assertThat(response.citations()).extracting(AnswerResponse.CitationResponse::chunkId)
                .contains("0#3").doesNotHaveDuplicates();
        assertThat(response.citations().stream().collect(java.util.stream.Collectors.groupingBy(
                citation -> citation.chunkId().split("#")[0], java.util.stream.Collectors.counting())).values())
                .allMatch(count -> count <= 3);
        assertThat(response.results()).hasSize(6);
    }

    private List<AnswerGenerationPort.AnswerContext> generatedContexts() {
        ArgumentCaptor<List<AnswerGenerationPort.AnswerContext>> captor = ArgumentCaptor.forClass(List.class);
        verify(answerGenerationPort).generate(anyString(), captor.capture());
        return captor.getValue();
    }

    private double cacheLookups(String cache, String result) {
        return meters.get("knowledge.cache.lookups")
                .tag("cache", cache)
                .tag("result", result)
                .counter()
                .count();
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
