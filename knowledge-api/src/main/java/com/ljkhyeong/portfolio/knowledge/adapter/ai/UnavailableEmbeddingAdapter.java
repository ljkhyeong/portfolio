package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;

public class UnavailableEmbeddingAdapter implements EmbeddingPort {

    private final int dimensions;

    public UnavailableEmbeddingAdapter(int dimensions) {
        this.dimensions = dimensions;
    }

    @Override
    public List<List<Float>> embed(List<String> texts) {
        throw new IllegalStateException("현재 임베딩 제공자가 설정되지 않았습니다.");
    }

    @Override
    public boolean available() {
        return false;
    }

    @Override
    public String modelId() {
        return "disabled";
    }

    @Override
    public int dimensions() {
        return dimensions;
    }
}
