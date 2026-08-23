package com.ljkhyeong.portfolio.knowledge;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(KnowledgeProperties.class)
public class KnowledgeApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(KnowledgeApiApplication.class, args);
    }
}
