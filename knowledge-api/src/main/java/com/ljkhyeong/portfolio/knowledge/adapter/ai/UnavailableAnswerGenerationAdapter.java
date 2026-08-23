package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationUnavailableException;

public class UnavailableAnswerGenerationAdapter implements AnswerGenerationPort {

    @Override
    public String generate(String question, List<AnswerContext> contexts) {
        throw new AnswerGenerationUnavailableException("현재 AI 답변 제공자가 설정되지 않았습니다.");
    }
}
