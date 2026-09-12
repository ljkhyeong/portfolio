package com.ljkhyeong.portfolio.knowledge.verification;

import static com.ljkhyeong.portfolio.knowledge.TestFixtures.knowledgeProperties;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationPort;
import com.ljkhyeong.portfolio.knowledge.port.HumanVerificationUnavailableException;
import org.junit.jupiter.api.Test;

class KnowledgeHumanVerificationServiceTest {

    private final HumanVerificationPort port = mock(HumanVerificationPort.class);

    @Test
    void 기능을_끄면_외부_API를_호출하지_않는다() {
        var service = new KnowledgeHumanVerificationService(port, knowledgeProperties());

        assertThat(service.verify(null, null))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.NOT_REQUIRED);
        verify(port, never()).verify(null);
    }

    @Test
    void 성공_응답의_호스트와_action까지_검증한다() {
        var service = enabledService();
        when(port.verify("valid-token")).thenReturn(new HumanVerificationPort.Result(
                true,
                "LJKPORTFOLIO.NETLIFY.APP",
                KnowledgeHumanVerificationService.EXPECTED_ACTION
        ));

        assertThat(service.verify("valid-token", null))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.VERIFIED);
    }

    @Test
    void 토큰이_없거나_호스트와_action이_다르면_거절한다() {
        var service = enabledService();
        assertThat(service.verify(" ", null)).isEqualTo(KnowledgeHumanVerificationService.Decision.REJECTED);
        verify(port, never()).verify(" ");

        when(port.verify("wrong-host")).thenReturn(new HumanVerificationPort.Result(
                true,
                "attacker.example.com",
                KnowledgeHumanVerificationService.EXPECTED_ACTION
        ));
        when(port.verify("wrong-action")).thenReturn(new HumanVerificationPort.Result(
                true,
                "ljkportfolio.netlify.app",
                "another_action"
        ));

        assertThat(service.verify("wrong-host", null))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.REJECTED);
        assertThat(service.verify("wrong-action", null))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.REJECTED);
    }

    @Test
    void 외부_API_장애를_사용자_검증_실패와_구분한다() {
        var service = enabledService();
        when(port.verify("valid-token")).thenThrow(new HumanVerificationUnavailableException("장애"));

        assertThat(service.verify("valid-token", null))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.UNAVAILABLE);
    }

    @Test
    void 운영_키가_일치하면_자동_평가_요청을_허용한다() {
        var service = new KnowledgeHumanVerificationService(
                port,
                knowledgeProperties(
                        "source.sync-key", "operator-key",
                        "human-verification.enabled", "true",
                        "human-verification.secret-key", "server-secret"
                )
        );

        assertThat(service.verify(null, "operator-key"))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.VERIFIED);
        assertThat(service.verify(null, "wrong-key"))
                .isEqualTo(KnowledgeHumanVerificationService.Decision.REJECTED);
        verify(port, never()).verify(null);
    }

    private KnowledgeHumanVerificationService enabledService() {
        return new KnowledgeHumanVerificationService(
                port,
                knowledgeProperties(
                        "human-verification.enabled", "true",
                        "human-verification.secret-key", "server-secret",
                        "human-verification.expected-hostnames", "ljkportfolio.netlify.app"
                )
        );
    }
}
