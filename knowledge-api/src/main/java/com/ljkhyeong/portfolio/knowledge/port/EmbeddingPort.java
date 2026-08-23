package com.ljkhyeong.portfolio.knowledge.port;

import java.util.List;

public interface EmbeddingPort {

    List<List<Float>> embed(List<String> texts);

    boolean available();

    String modelId();

    int dimensions();
}
