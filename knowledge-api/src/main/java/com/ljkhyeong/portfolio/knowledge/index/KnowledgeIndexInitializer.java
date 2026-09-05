package com.ljkhyeong.portfolio.knowledge.index;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.port.EmbeddingPort;
import com.ljkhyeong.portfolio.knowledge.port.KnowledgeIndexPort;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeIndexInitializer {

    private final KnowledgeProperties properties;
    private final EmbeddingPort embeddingPort;
    private final KnowledgeIndexPort indexPort;
    private boolean initialized;

    public KnowledgeIndexInitializer(
            KnowledgeProperties properties, EmbeddingPort embeddingPort, KnowledgeIndexPort indexPort
    ) {
        this.properties = properties;
        this.embeddingPort = embeddingPort;
        this.indexPort = indexPort;
    }

    public synchronized void ensureInitialized() {
        if (!initialized) {
            indexPort.ensureIndex(
                    embeddingPort.modelId(), embeddingPort.dimensions(), properties.source().chunkingFingerprint()
            );
            initialized = true;
        }
    }

    public synchronized void refresh() {
        initialized = false;
        ensureInitialized();
    }
}
