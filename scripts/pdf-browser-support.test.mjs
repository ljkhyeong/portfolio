import { describe, expect, test } from "vitest"
import {
    assertCanonicalPdfRenderer,
    getPdfBrowserCandidates,
    getPdfBrowserLabel,
    readCliOption,
    resolvePdfBrowser,
} from "./pdf-browser-support.mjs"

describe("PDF 생성 브라우저 선택", () => {
    test("기본 브라우저와 명시한 브라우저를 구분한다", () => {
        expect(resolvePdfBrowser([], {})).toBe("chrome")
        expect(resolvePdfBrowser(["--browser=edge"], {})).toBe("edge")
        expect(resolvePdfBrowser(["--browser", "webkit"], {})).toBe("webkit")
        expect(resolvePdfBrowser(["--browser=safari"], {})).toBe("webkit")
        expect(resolvePdfBrowser([], { PDF_BROWSER: "edge" })).toBe("edge")
    })

    test("지원하지 않는 브라우저와 비어 있는 옵션을 거부한다", () => {
        expect(() => resolvePdfBrowser(["--browser=firefox"], {})).toThrow(
            "지원하지 않는 PDF 브라우저",
        )
        expect(() => readCliOption(["--browser"], "browser")).toThrow(
            "--browser 값을 입력해 주세요.",
        )
    })

    test("사용자 지정 실행 파일을 기본 설치 경로보다 먼저 사용한다", () => {
        expect(
            getPdfBrowserCandidates(
                "edge",
                { PDF_BROWSER_PATH: "/custom/edge", EDGE_PATH: "/legacy/edge" },
                "darwin",
            ).slice(0, 3),
        ).toEqual([
            "/custom/edge",
            "/legacy/edge",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        ])

        expect(
            getPdfBrowserCandidates(
                "chrome",
                { PDF_BROWSER_PATH: "/custom/chrome", CHROME_PATH: "/legacy/chrome" },
                "linux",
            ).slice(0, 3),
        ).toEqual(["/custom/chrome", "/legacy/chrome", "/usr/bin/google-chrome"])
    })

    test("Windows와 Linux의 Edge 기본 경로를 제공한다", () => {
        expect(
            getPdfBrowserCandidates(
                "edge",
                { "PROGRAMFILES(X86)": "C:\\Program Files (x86)" },
                "win32",
            ),
        ).toContain("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe")
        expect(getPdfBrowserCandidates("edge", {}, "linux")).toContain("/usr/bin/microsoft-edge")
        expect(getPdfBrowserCandidates("webkit", {}, "darwin")).toEqual([])
    })

    test("사용자에게 표시할 브라우저 이름을 반환한다", () => {
        expect(getPdfBrowserLabel("chrome")).toBe("Chrome 또는 Chromium")
        expect(getPdfBrowserLabel("edge")).toBe("Microsoft Edge")
        expect(getPdfBrowserLabel("webkit")).toBe("Safari WebKit")
    })

    test("Edge와 Safari가 배포용 PDF를 덮어쓰지 못하게 한다", () => {
        const canonicalOutputPath = "/repository/public/임정규_포트폴리오.pdf"

        expect(() =>
            assertCanonicalPdfRenderer({
                browser: "edge",
                canonicalOutputPath,
                outputPath: canonicalOutputPath,
            }),
        ).toThrow("배포용 PDF는 Chrome으로만 생성할 수 있습니다")
        expect(() =>
            assertCanonicalPdfRenderer({
                browser: "webkit",
                canonicalOutputPath,
                outputPath: "/repository/output/pdf-preview/임정규_포트폴리오-safari.pdf",
            }),
        ).not.toThrow()
    })
})
