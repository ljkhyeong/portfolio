package com.ljkhyeong.portfolio.knowledge.adapter.elasticsearch;

import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class ElasticsearchHealthIndicator implements HealthIndicator {

    private final ElasticsearchKnowledgeRepository repository;

    public ElasticsearchHealthIndicator(ElasticsearchKnowledgeRepository repository) {
        this.repository = repository;
    }

    @Override
    public Health health() {
        try {
            repository.checkHealth();
            return Health.up().build();
        } catch (ElasticsearchAccessException exception) {
            return Health.down(exception).build();
        }
    }
}
