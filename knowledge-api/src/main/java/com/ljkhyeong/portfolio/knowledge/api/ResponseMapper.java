package com.ljkhyeong.portfolio.knowledge.api;

import java.text.BreakIterator;
import java.util.List;
import java.util.Locale;

import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeAnswer;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.SearchHit;
import org.commonmark.Extension;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.node.Link;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.text.CoreTextContentNodeRenderer;
import org.commonmark.renderer.text.LineBreakRendering;
import org.commonmark.renderer.text.TextContentRenderer;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ResponseMapper {

    private static final int SNIPPET_LENGTH = 280;
    private static final List<Extension> MARKDOWN_EXTENSIONS = List.of(TablesExtension.create());
    private final Parser markdown = Parser.builder().extensions(MARKDOWN_EXTENSIONS).build();
    private final TextContentRenderer plainText = TextContentRenderer.builder()
            .extensions(MARKDOWN_EXTENSIONS)
            .lineBreakRendering(LineBreakRendering.STRIP)
            .nodeRendererFactory(context -> new CoreTextContentNodeRenderer(context) {
                @Override
                public void visit(Link link) {
                    visitChildren(link);
                }
            })
            .build();

    public SearchResponse toSearchResponse(List<SearchHit> hits) {
        List<SearchResultResponse> results = toSearchResults(hits);
        return new SearchResponse(results.size(), results);
    }

    public AnswerResponse toAnswerResponse(KnowledgeAnswer answer) {
        return new AnswerResponse(
                answer.status(),
                answer.answer(),
                answer.citations().stream().map(this::toCitation).toList(),
                toSearchResults(answer.results())
        );
    }

    private List<SearchResultResponse> toSearchResults(List<SearchHit> hits) {
        return hits.stream().map(this::toSearchResult).toList();
    }

    // 인용은 검색 발췌문이 아니라 AI에 전달한 근거 전체를 평문으로 보여 준다.
    private AnswerResponse.CitationResponse toCitation(SearchHit hit) {
        KnowledgeChunk chunk = hit.chunk();
        return new AnswerResponse.CitationResponse(
                chunk.chunkId(),
                chunk.title(),
                chunk.heading(),
                chunk.sourceUrl(),
                chunk.route(),
                toPlainText(chunk.content())
        );
    }

    SearchResultResponse toSearchResult(SearchHit hit) {
        KnowledgeChunk chunk = hit.chunk();
        return new SearchResultResponse(
                chunk.chunkId(),
                chunk.projectId(),
                chunk.projectName(),
                chunk.serviceId(),
                chunk.documentType(),
                chunk.title(),
                chunk.heading(),
                snippet(hit),
                chunk.sourceUrl(),
                chunk.route()
        );
    }

    String snippet(SearchHit hit) {
        String passage = StringUtils.hasText(hit.matchedPassage()) ? hit.matchedPassage() : hit.chunk().content();
        String content = toPlainText(passage);
        if (content.length() <= SNIPPET_LENGTH) {
            return content + (hit.chunk().content().stripTrailing().endsWith(passage.stripTrailing()) ? "" : "…");
        }

        BreakIterator sentences = BreakIterator.getSentenceInstance(Locale.KOREAN);
        sentences.setText(content);
        int end = sentences.preceding(SNIPPET_LENGTH + 1);
        if (end < SNIPPET_LENGTH / 2) {
            BreakIterator words = BreakIterator.getWordInstance(Locale.KOREAN);
            words.setText(content);
            end = words.preceding(SNIPPET_LENGTH + 1);
        }
        if (end <= 0) {
            end = SNIPPET_LENGTH;
        }
        return content.substring(0, end).stripTrailing() + "…";
    }

    private String toPlainText(String content) {
        return plainText.render(markdown.parse(content)).strip();
    }
}
