package com.ljkhyeong.portfolio.knowledge.api;

import java.text.BreakIterator;
import java.util.List;
import java.util.Locale;

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

    public List<SearchResultResponse> toSearchResults(List<SearchHit> hits) {
        return hits.stream().map(this::toSearchResult).toList();
    }

    public SearchResultResponse toSearchResult(SearchHit hit) {
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
                chunk.route(),
                hit.score()
        );
    }

    public String snippet(SearchHit hit) {
        String passage = StringUtils.hasText(hit.matchedPassage()) ? hit.matchedPassage() : hit.chunk().content();
        String content = plainText.render(markdown.parse(passage)).strip();
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
}
