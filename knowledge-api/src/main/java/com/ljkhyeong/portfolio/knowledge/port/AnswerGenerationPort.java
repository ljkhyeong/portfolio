package com.ljkhyeong.portfolio.knowledge.port;

import java.util.List;

public interface AnswerGenerationPort {

    GeneratedAnswer generate(String question, List<AnswerContext> contexts);

    record GeneratedAnswer(Boolean answerable, List<AnswerParagraph> paragraphs) {
    }

    record AnswerParagraph(String text, List<String> citationIds) {
    }

    record AnswerContext(
            String citationId,
            String title,
            String heading,
            String content
    ) {
    }
}
