package com.ljkhyeong.portfolio.knowledge.port;

import java.util.List;

public interface EmbeddingPort {

    // 입력과 같은 개수와 순서로 dimensions() 차원의 유한한 0이 아닌 벡터를 반환한다.
    // 지키지 못하면 EmbeddingUnavailableException을 던진다.
    List<List<Float>> embed(List<String> texts);

    boolean available();

    String modelId();

    int dimensions();
}
