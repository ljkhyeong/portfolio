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
        return new SpringAiAnswerGenerationAdapter(chatClientBuilderProvider.getObject());
    }

    @Bean
    EmbeddingPort embeddingPort(
            ObjectProvider<EmbeddingModel> embeddingModelProvider,
            KnowledgeProperties properties
    ) {
        if (properties.ai().provider() == KnowledgeProperties.AiProvider.DISABLED) {
            return new UnavailableEmbeddingAdapter(properties.ai().embeddingDimensions());
        }
        return new SpringAiEmbeddingAdapter(
                embeddingModelProvider.getObject(),
                properties.ai().embeddingModelId(),
                properties.ai().embeddingDimensions()
        );
    }
}
