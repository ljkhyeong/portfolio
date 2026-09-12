import { describe, expect, test } from "vitest"
import {
    classifyChanges,
    findCompanionTests,
    findTextIssues,
    javaTestPatterns,
    normalizeRequestedFiles,
} from "./agent-feedback-check.mjs"

describe("에이전트 피드백 검사 범위", () => {
    test("프런트엔드 코드 변경은 전체 테스트와 빌드 대상으로 분류한다", () => {
        expect(classifyChanges(["src/component/Header.jsx"])).toMatchObject({
            buildRequired: true,
            frontendTestsRequired: true,
            javaTestsRequired: false,
        })
    })

    test("패키지 설정 변경은 프런트엔드 전체 테스트 대상으로 분류한다", () => {
        expect(classifyChanges(["package.json"])).toMatchObject({
            buildRequired: true,
            frontendTestsRequired: true,
        })
    })

    test("Java 변경은 Java 테스트 대상으로 분류한다", () => {
        expect(
            classifyChanges([
                "knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeSearchService.java",
            ]),
        ).toMatchObject({
            frontendTestsRequired: false,
            javaTestsRequired: true,
        })
    })

    test("일반 문서 변경은 제품 테스트와 빌드를 실행하지 않는다", () => {
        expect(classifyChanges(["docs/agent-validation.md"])).toMatchObject({
            buildRequired: false,
            frontendTestsRequired: false,
            javaTestsRequired: false,
        })
    })

    test("수정한 프런트엔드 파일과 같은 위치의 테스트를 찾는다", () => {
        const existing = new Set([
            "src/component/Header.test.jsx",
            "scripts/agent-feedback-check.test.mjs",
        ])
        const tests = findCompanionTests(
            ["src/component/Header.jsx", "scripts/agent-feedback-check.mjs"],
            (file) => existing.has(normalizeRequestedFiles([file])[0]),
        )

        expect(tests).toEqual([
            "scripts/agent-feedback-check.test.mjs",
            "src/component/Header.test.jsx",
        ])
    })

    test("Java 파일은 아키텍처 규칙과 대응 테스트를 함께 선택한다", () => {
        const source =
            "knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeSearchService.java"
        const companion =
            "knowledge-api/src/test/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeSearchServiceTest.java"

        expect(javaTestPatterns([source], (file) => file.endsWith(companion))).toEqual([
            "*DependencyRulesTest",
            "com.ljkhyeong.portfolio.knowledge.search.KnowledgeSearchServiceTest",
        ])
    })

    test("저장소 밖 경로는 검사 대상으로 받지 않는다", () => {
        expect(() => normalizeRequestedFiles(["../outside.txt"])).toThrow(
            /저장소 밖의 파일은 검사할 수 없습니다/,
        )
    })

    test("한글 파일 경로를 변경 없이 유지한다", () => {
        expect(normalizeRequestedFiles(["public/임정규_포트폴리오.pdf"])).toEqual([
            "public/임정규_포트폴리오.pdf",
        ])
    })

    test("미추적 파일도 확인할 수 있도록 줄 끝 공백과 끝 개행을 직접 검사한다", () => {
        expect(findTextIssues("Example.java", "class Example { }  \nnext")).toEqual([
            "Example.java:1 줄 끝 공백",
            "Example.java: 파일 끝 개행 없음",
        ])
    })
})
