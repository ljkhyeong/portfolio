package com.ljkhyeong.portfolio.knowledge.adapter.ai;

import java.util.List;

import com.openai.errors.OpenAIException;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingUnavailableException;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.ai.retry.TransientAiException;
import org.springframework.web.client.RestClientException;

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
        try {
            EmbeddingResponse response = embeddingModel.embedForResponse(texts);
            List<Embedding> results = response == null ? null : response.getResults();
            if (results == null || results.size() != texts.size()) {
                throw new EmbeddingUnavailableException("임베딩 응답 수가 요청 수와 다릅니다.");
            }
            List<List<Float>> vectors = new java.util.ArrayList<>(java.util.Collections.nCopies(texts.size(), null));
            for (Embedding result : results) {
                Integer index = result == null ? null : result.getIndex();
                if (index == null || index < 0 || index >= texts.size() || vectors.get(index) != null) {
                    throw new EmbeddingUnavailableException("임베딩 응답 순번이 누락·중복됐거나 요청 범위를 벗어났습니다.");
                }
                // 응답 배열 위치가 아닌 제공자의 순번으로 원문과 벡터를 연결한다.
                vectors.set(index, toFloatList(result.getOutput()));
            }
            return List.copyOf(vectors);
        } catch (TransientAiException
                 | NonTransientAiException
                 | OpenAIException
                 | RestClientException exception) {
            throw new EmbeddingUnavailableException("임베딩을 생성하지 못했습니다.", exception);
        }
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
        if (vector == null || vector.length != dimensions) {
            throw new EmbeddingUnavailableException("임베딩 벡터 차원이 설정과 다릅니다.");
        }
        List<Float> values = new java.util.ArrayList<>(vector.length);
        boolean nonZero = false;
        for (float value : vector) {
            if (!Float.isFinite(value)) {
                throw new EmbeddingUnavailableException("임베딩 벡터에 유효하지 않은 수가 포함됐습니다.");
            }
            nonZero |= value != 0;
            values.add(value);
        }
        if (!nonZero) {
            throw new EmbeddingUnavailableException("코사인 검색에 사용할 수 없는 영벡터입니다.");
        }
        return List.copyOf(values);
    }
}
