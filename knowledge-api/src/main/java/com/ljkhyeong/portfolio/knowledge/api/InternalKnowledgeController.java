package com.ljkhyeong.portfolio.knowledge.api;

import static com.ljkhyeong.portfolio.knowledge.api.KnowledgeHumanVerificationInterceptor.OPERATOR_KEY_HEADER;

import com.ljkhyeong.portfolio.knowledge.config.KnowledgeProperties;
import com.ljkhyeong.portfolio.knowledge.sync.KnowledgeSyncService;
import com.ljkhyeong.portfolio.knowledge.util.SecretMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            @RequestHeader(name = OPERATOR_KEY_HEADER, required = false) String syncKey
    ) {
        verifySyncKey(syncKey);
        return syncService.syncConfiguredManifest();
    }

    private void verifySyncKey(String suppliedKey) {
        if (!SecretMatcher.matches(properties.sync().key(), suppliedKey)) {
            throw new KnowledgeApiException(HttpStatus.FORBIDDEN, "SYNC_FORBIDDEN", "공개 지식 문서 동기화 권한이 없습니다.");
        }
    }

    @GetMapping("/status")
    public KnowledgeSyncService.IndexStatus status(
            @RequestHeader(name = OPERATOR_KEY_HEADER, required = false) String syncKey
    ) {
        verifySyncKey(syncKey);
        return syncService.status();
    }
}
