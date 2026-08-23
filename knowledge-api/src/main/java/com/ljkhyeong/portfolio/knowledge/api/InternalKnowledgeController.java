package com.ljkhyeong.portfolio.knowledge.api;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.sync.KnowledgeSyncService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/internal/v1/knowledge")
public class InternalKnowledgeController {

    private final KnowledgeProperties properties;
    private final KnowledgeSyncService syncService;

    public InternalKnowledgeController(KnowledgeProperties properties, KnowledgeSyncService syncService) {
        this.properties = properties;
        this.syncService = syncService;
    }

    @PostMapping("/sync")
    public KnowledgeSyncService.SyncResult sync(
            @RequestHeader(name = "X-Knowledge-Sync-Key", required = false) String syncKey
    ) {
        verifySyncKey(syncKey);
        return syncService.syncConfiguredManifest();
    }

    private void verifySyncKey(String suppliedKey) {
        String configuredKey = properties.getSource().getSyncKey();
        if (!StringUtils.hasText(configuredKey) || !StringUtils.hasText(suppliedKey)) {
            throw new SyncForbiddenException();
        }
        boolean matches = MessageDigest.isEqual(
                configuredKey.getBytes(StandardCharsets.UTF_8),
                suppliedKey.getBytes(StandardCharsets.UTF_8)
        );
        if (!matches) {
            throw new SyncForbiddenException();
        }
    }
}
