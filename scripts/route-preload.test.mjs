// @vitest-environment node

import { describe, expect, test } from "vitest"
import {
    collectRouteAssets,
    firstScreenshotPath,
    injectPreloadTags,
    renderPreloadTags,
    routeEntryModule,
} from "./route-preload.mjs"

const manifest = {
    "index.html": {
        file: "assets/index-a.js",
        css: ["assets/index-a.css"],
        imports: ["_vendor-b.js"],
        isEntry: true,
    },
    "_vendor-b.js": { file: "assets/vendor-b.js" },
    "_CaseShowcase-c.js": { file: "assets/CaseShowcase-c.js", css: ["assets/CaseShowcase-c.css"] },
    "src/component/project/ProjectCaseStudy.jsx": {
        file: "assets/ProjectCaseStudy-d.js",
        css: ["assets/ProjectCaseStudy-d.css"],
        imports: ["_vendor-b.js", "index.html", "_CaseShowcase-c.js"],
        isDynamicEntry: true,
    },
    "src/component/project/BatonServiceCaseStudy.jsx": {
        file: "assets/BatonServiceCaseStudy-e.js",
        imports: ["index.html", "_CaseShowcase-c.js"],
        isDynamicEntry: true,
    },
}

describe("경로별 미리 불러오기", () => {
    test("경로에 맞는 화면 청크를 찾고 홈은 대상이 아니다", () => {
        expect(routeEntryModule(manifest, "/projects/happygallery")).toBe(
            "src/component/project/ProjectCaseStudy.jsx",
        )
        expect(routeEntryModule(manifest, "/projects/baton/relay")).toBe(
            "src/component/project/BatonServiceCaseStudy.jsx",
        )
        expect(routeEntryModule(manifest, "/")).toBeNull()
        expect(() => routeEntryModule(manifest, "/search")).toThrow("PortfolioKnowledgePage")
    })

    test("진입 HTML이 이미 불러오는 청크를 빼고 화면 청크와 의존 청크의 JS·CSS를 모은다", () => {
        expect(collectRouteAssets(manifest, "src/component/project/ProjectCaseStudy.jsx")).toEqual({
            scripts: ["assets/ProjectCaseStudy-d.js", "assets/CaseShowcase-c.js"],
            styles: ["assets/ProjectCaseStudy-d.css", "assets/CaseShowcase-c.css"],
        })
    })

    test("대표 캡처가 있는 프로젝트 상세만 첫 캡처를 넓은 화면용으로 미리 받는다", () => {
        const projects = [
            {
                id: "happygallery",
                route: "/projects/happygallery",
                screenshots: [{ src: "a b.webp" }],
            },
            { id: "warrant", route: "/projects/e-warrant" },
        ]
        expect(firstScreenshotPath(projects, "/projects/happygallery")).toBe("a b.webp")
        expect(firstScreenshotPath(projects, "/projects/e-warrant")).toBeNull()
        expect(firstScreenshotPath(projects, "/projects/baton/relay")).toBeNull()

        const tags = renderPreloadTags({
            scripts: ["assets/x.js"],
            styles: ["assets/x.css"],
            image: "a b.webp",
        })
        expect(tags).toContain('<link rel="modulepreload" crossorigin href="/assets/x.js" />')
        expect(tags).toContain('<link rel="preload" as="style" crossorigin href="/assets/x.css" />')
        expect(tags).toContain('media="(min-width: 1024px)" href="/a%20b.webp"')
        expect(
            renderPreloadTags({ image: "a b.webp", assetVersions: { "a b.webp": "0123456789" } }),
        ).toContain('href="/a%20b.webp?v=0123456789"')
        expect(injectPreloadTags("<head>\n    </head>", tags)).toMatch(/x\.js[\s\S]*<\/head>/)
        expect(injectPreloadTags("<head></head>", "")).toBe("<head></head>")
    })
})
