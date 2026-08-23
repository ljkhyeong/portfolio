package com.ljkhyeong.portfolio.knowledge.port;

import java.util.List;

public interface AnswerGenerationPort {

    String generate(String question, List<AnswerContext> contexts);

    record AnswerContext(
            String citationId,
            String title,
            String heading,
            String content
    ) {
    }
}
