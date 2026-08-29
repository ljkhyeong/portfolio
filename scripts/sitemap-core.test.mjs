// @vitest-environment node

import { describe, expect, test } from "vitest"
import { createSitemapXml } from "./sitemap-core.mjs"

describe("sitemap 생성", () => {
    test("검색 허용 경로만 canonical URL로 만든다", () => {
        const sitemap = createSitemapXml({
            routeMeta: {
                "/": { title: "홈" },
                "/projects/demo": { title: "프로젝트" },
                "/portfolio/print": { noindex: true, title: "인쇄" },
            },
            toCanonicalUrl: (pathname) =>
                pathname === "/" ? "https://example.com/" : `https://example.com${pathname}/`,
        })

        expect(sitemap).toContain("https://example.com/")
        expect(sitemap).toContain("https://example.com/projects/demo/")
        expect(sitemap).not.toContain("portfolio/print")
    })
})
