package com.ljkhyeong.portfolio.knowledge.sync;

import java.util.ArrayList;
import java.util.List;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeChunk;
import com.ljkhyeong.portfolio.knowledge.domain.KnowledgeSourceDocument;
import com.ljkhyeong.portfolio.knowledge.util.Hashing;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeChunker {

    private final int maxCharacters;
    private final int overlapCharacters;

    public KnowledgeChunker(KnowledgeProperties properties) {
        this.maxCharacters = properties.source().maxChunkCharacters();
        this.overlapCharacters = properties.source().overlapCharacters();
    }

    public List<KnowledgeChunk> split(KnowledgeSourceDocument document) {
        String content = document.content().strip();
        List<String> texts = splitText(content);
        List<KnowledgeChunk> chunks = new ArrayList<>(texts.size());
        for (int index = 0; index < texts.size(); index++) {
            String chunkContent = texts.get(index);
            String chunkId = "%s#%03d".formatted(document.documentId(), index);
            chunks.add(new KnowledgeChunk(
                    chunkId,
                    document.documentId(),
                    document.projectId(),
                    document.projectName(),
                    document.serviceId(),
                    document.documentType(),
                    document.title(),
                    document.heading(),
                    chunkContent,
                    document.sourceUrl(),
                    document.route(),
                    document.evidenceLevel(),
                    document.sourceRevision(),
                    document.sourceHash(),
                    document.contentHash(),
                    Hashing.sha256(chunkContent),
                    null,
                    List.of()
            ));
        }
        return List.copyOf(chunks);
    }

    private List<String> splitText(String content) {
        if (content.length() <= maxCharacters) {
            return List.of(content);
        }

        List<String> chunks = new ArrayList<>();
        int start = 0;
        while (start < content.length()) {
            int proposedEnd = Math.min(start + maxCharacters, content.length());
            int end = findNaturalBoundary(content, start, proposedEnd);
            String chunk = content.substring(start, end).strip();
            if (!chunk.isBlank()) {
                chunks.add(chunk);
            }
            if (end >= content.length()) {
                break;
            }
            start = Math.max(end - overlapCharacters, start + 1);
            while (start < end && !Character.isWhitespace(content.charAt(start))) {
                start++;
            }
        }
        return List.copyOf(chunks);
    }

    private int findNaturalBoundary(String content, int start, int proposedEnd) {
        if (proposedEnd == content.length()) {
            return proposedEnd;
        }
        int minimumEnd = start + (maxCharacters * 2 / 3);
        for (int index = proposedEnd; index >= minimumEnd; index--) {
            char previous = content.charAt(index - 1);
            if (previous == '\n' || previous == '.' || previous == '。' || previous == '다') {
                return index;
            }
        }
        for (int index = proposedEnd; index >= minimumEnd; index--) {
            if (Character.isWhitespace(content.charAt(index - 1))) {
                return index;
            }
        }
        return proposedEnd;
    }
}
