package com.ljkhyeong.portfolio.knowledge.sync;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeSyncRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeSyncRunner.class);

    private final KnowledgeProperties properties;
    private final KnowledgeSyncService syncService;

    public KnowledgeSyncRunner(KnowledgeProperties properties, KnowledgeSyncService syncService) {
        this.properties = properties;
        this.syncService = syncService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!properties.source().syncOnStartup()) {
            return;
        }
        KnowledgeSyncService.SyncResult result = syncService.syncConfiguredManifest();
        log.info(
                "공개 지식 문서 동기화 완료: revision={}, indexed={}, unchanged={}, deleted={}, chunks={}",
                result.sourceRevision(),
                result.indexedDocuments(),
                result.unchangedDocuments(),
                result.deletedDocuments(),
                result.indexedChunks()
        );
    }
}
