package com.ljkhyeong.portfolio.knowledge.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

@AnalyzeClasses(
        packages = "com.ljkhyeong.portfolio.knowledge",
        importOptions = ImportOption.DoNotIncludeTests.class
)
class DependencyRulesTest {

    private static final String BASE = "com.ljkhyeong.portfolio.knowledge";

    @ArchTest
    static final ArchRule 도메인은_외부_계층에_의존하지_않는다 = noClasses()
            .that().resideInAPackage(BASE + ".domain..")
            .should().dependOnClassesThat().resideInAnyPackage(
                    BASE + ".adapter..",
                    BASE + ".api..",
                    BASE + ".config..",
                    BASE + ".index..",
                    BASE + ".port..",
                    BASE + ".search..",
                    BASE + ".sync.."
            )
            .because("도메인 모델은 웹, 저장소와 애플리케이션 실행 방식에서 독립적이어야 한다");

    @ArchTest
    static final ArchRule 컨트롤러는_어댑터나_포트를_직접_호출하지_않는다 = noClasses()
            .that().areAnnotatedWith(RestController.class)
            .should().dependOnClassesThat().resideInAnyPackage(
                    BASE + ".adapter..",
                    BASE + ".port.."
            )
            .because("컨트롤러는 검색과 동기화 서비스만 호출해야 한다");

    @ArchTest
    static final ArchRule 서비스는_어댑터_구현체에_의존하지_않는다 = noClasses()
            .that().areAnnotatedWith(Service.class)
            .should().dependOnClassesThat().resideInAPackage(BASE + ".adapter..")
            .because("서비스는 포트를 통해 저장소와 AI 구현을 사용해야 한다");

    @ArchTest
    static final ArchRule 포트는_외부_계층에_의존하지_않는다 = noClasses()
            .that().resideInAPackage(BASE + ".port..")
            .should().dependOnClassesThat().resideInAnyPackage(
                    BASE + ".adapter..",
                    BASE + ".api..",
                    BASE + ".config..",
                    BASE + ".index..",
                    BASE + ".search..",
                    BASE + ".sync.."
            )
            .because("포트 계약은 구현체와 호출 계층에서 독립적이어야 한다");
}
