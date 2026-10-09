import { withAssetVersion } from "../src/utils/assetVersion.js"

// 지연 로딩 화면은 앱 JS가 실행된 뒤에야 청크와 CSS, 첫 화면 이미지를 요청한다.
// 경로별 HTML에 이 자원을 미리 알려 상세 화면의 첫 이미지 표시 시점을 앞당긴다.
const ENTRY_KEY = "index.html"
const DESKTOP_IMAGE_MEDIA = "(min-width: 1024px)"

const ROUTE_ENTRIES = [
    {
        test: (pathname) => pathname.startsWith("/projects/baton/"),
        module: "BatonServiceCaseStudy",
    },
    { test: (pathname) => pathname.startsWith("/projects/"), module: "ProjectCaseStudy" },
    { test: (pathname) => pathname === "/search", module: "PortfolioKnowledgePage" },
    { test: (pathname) => pathname === "/portfolio/print", module: "PortfolioPrintPage" },
]

export const routeEntryModule = (manifest, pathname) => {
    const entry = ROUTE_ENTRIES.find((candidate) => candidate.test(pathname))
    if (!entry) {
        return null
    }
    const key = Object.keys(manifest).find(
        (candidate) =>
            manifest[candidate].isDynamicEntry && candidate.endsWith(`/${entry.module}.jsx`),
    )
    if (!key) {
        throw new Error(
            `${pathname} 경로의 ${entry.module} 청크를 빌드 매니페스트에서 찾지 못했습니다.`,
        )
    }
    return key
}

// 진입 HTML이 이미 불러오는 청크는 빼고, 화면 청크와 그 정적 의존 청크의 JS·CSS를 모은다.
export const collectRouteAssets = (manifest, moduleKey) => {
    const loaded = new Set()
    const markLoaded = (key) => {
        if (loaded.has(key)) return
        loaded.add(key)
        manifest[key].imports?.forEach(markLoaded)
    }
    markLoaded(ENTRY_KEY)

    const scripts = []
    const styles = []
    const visit = (key) => {
        if (loaded.has(key)) return
        loaded.add(key)
        const chunk = manifest[key]
        scripts.push(chunk.file)
        styles.push(...(chunk.css ?? []))
        chunk.imports?.forEach(visit)
    }
    visit(moduleKey)

    return { scripts, styles: [...new Set(styles)] }
}

// 대표 화면 캡처가 있는 프로젝트 상세만 첫 캡처를 미리 받는다. 모바일에서는 첫 화면 밖이라 넓은 화면에 한정한다.
// 넓은 화면에서도 첫 캡처는 첫 화면 아래쪽에 걸치므로 제목 글꼴보다 앞서지 않게 우선순위는 높이지 않는다.
export const firstScreenshotPath = (projects, pathname) => {
    const projectId = pathname.match(/^\/projects\/([^/]+)$/)?.[1]
    const project = projects.find(
        (candidate) => candidate.route === pathname || candidate.id === projectId,
    )
    return project?.screenshots?.[0]?.src ?? null
}

const escapeAttribute = (value) =>
    String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;")

export const renderPreloadTags = ({
    base = "/",
    scripts = [],
    styles = [],
    image = null,
    assetVersions = {},
}) => {
    const href = (file) => escapeAttribute(`${base}${file}`)
    return [
        ...scripts.map((file) => `<link rel="modulepreload" crossorigin href="${href(file)}" />`),
        ...styles.map(
            (file) => `<link rel="preload" as="style" crossorigin href="${href(file)}" />`,
        ),
        ...(image
            ? [
                  `<link rel="preload" as="image" media="${DESKTOP_IMAGE_MEDIA}" href="${href(withAssetVersion(encodeURI(image), image, assetVersions))}" />`,
              ]
            : []),
    ].join("\n        ")
}

export const injectPreloadTags = (html, tags) =>
    tags ? html.replace(/\n?(\s*)<\/head>/i, `\n        ${tags}\n    </head>`) : html
