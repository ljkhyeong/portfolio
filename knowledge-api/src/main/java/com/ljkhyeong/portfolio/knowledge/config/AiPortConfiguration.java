package com.ljkhyeong.portfolio.knowledge.config;

import com.ljkhyeong.portfolio.knowledge.adapter.ai.SpringAiAnswerGenerationAdapter;
import com.ljkhyeong.portfolio.knowledge.adapter.ai.SpringAiEmbeddingAdapter;
import com.ljkhyeong.portfolio.knowledge.adapter.ai.UnavailableAnswerGenerationAdapter;
import com.ljkhyeong.portfolio.knowledge.adapter.ai.UnavailableEmbeddingAdapter;
import com.ljkhyeong.portfolio.knowledge.port.AnswerGenerationPort;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiPortConfiguration {

    @Bean
    AnswerGenerationPort answerGenerationPort(
            ObjectProvider<ChatClient.Builder> chatClientBuilderProvider,
            KnowledgeProperties properties
    ) {
        if (properties.ai().provider() == KnowledgeProperties.AiProvider.DISABLED) {
            return new UnavailableAnswerGenerationAdapter();
        }
        ChatClient.Builder builder = chatClientBuilderProvider.getIfAvailable();
        if (builder == null) {
            throw new IllegalStateException("AI provider가 설정되었지만 ChatClient.Builder를 찾을 수 없습니다.");
        }
        return new SpringAiAnswerGenerationAdapter(builder);
    }

    @Bean
    EmbeddingPort embeddingPort(
            ObjectProvider<EmbeddingModel> embeddingModelProvider,
            KnowledgeProperties properties
    ) {
        if (properties.ai().provider() == KnowledgeProperties.AiProvider.DISABLED) {
            return new UnavailableEmbeddingAdapter(properties.ai().embeddingDimensions());
        }
        EmbeddingModel embeddingModel = embeddingModelProvider.getIfAvailable();
        if (embeddingModel == null) {
            throw new IllegalStateException("AI provider가 설정되었지만 EmbeddingModel을 찾을 수 없습니다.");
        }
        return new SpringAiEmbeddingAdapter(
                embeddingModel,
                properties.ai().embeddingModelId(),
                properties.ai().embeddingDimensions()
        );
    }
}
