package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import java.util.List;

import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import org.springframework.ai.embedding.EmbeddingModel;

public class SpringAiEmbeddingAdapter implements EmbeddingPort {

    private final EmbeddingModel embeddingModel;
    private final String modelId;
    private final int dimensions;

    public SpringAiEmbeddingAdapter(EmbeddingModel embeddingModel, String modelId, int dimensions) {
        this.embeddingModel = embeddingModel;
        this.modelId = modelId;
        this.dimensions = dimensions;
    }

    @Override
    public List<List<Float>> embed(List<String> texts) {
        if (texts.isEmpty()) {
            return List.of();
        }
        return embeddingModel.embed(texts).stream()
                .map(this::toFloatList)
                .toList();
    }

    @Override
    public boolean available() {
        return true;
    }

    @Override
    public String modelId() {
        return modelId;
    }

    @Override
    public int dimensions() {
        return dimensions;
    }

    private List<Float> toFloatList(float[] vector) {
        List<Float> values = new java.util.ArrayList<>(vector.length);
        for (float value : vector) {
            values.add(value);
        }
        return List.copyOf(values);
    }
}
