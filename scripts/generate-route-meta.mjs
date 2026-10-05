import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import {
    notFoundRouteMeta,
    routeMeta,
    toAbsoluteUrl,
    toCanonicalUrl,
} from "../src/data/routeMeta.js"
import {
    collectRouteAssets,
    firstScreenshotPath,
    injectPreloadTags,
    renderPreloadTags,
    routeEntryModule,
} from "./route-preload.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const buildDirectory = path.join(repositoryRoot, "build")
const entryPath = path.join(buildDirectory, "index.html")
const manifestDirectory = path.join(buildDirectory, ".vite")
const baseHtml = await readFile(entryPath, "utf8")
const manifest = JSON.parse(await readFile(path.join(manifestDirectory, "manifest.json"), "utf8"))

const loadProjects = async () => {
    const vite = await createServer({
        root: repositoryRoot,
        appType: "custom",
        logLevel: "silent",
        server: { middlewareMode: true },
    })

    try {
        const { projectList } = await vite.ssrLoadModule("/src/data/projects.js")
        return projectList
    } finally {
        await vite.close()
    }
}

const projects = await loadProjects()

const preloadTagsFor = (pathname) => {
    const moduleKey = routeEntryModule(manifest, pathname)
    if (!moduleKey) {
        return ""
    }
    return renderPreloadTags({
        ...collectRouteAssets(manifest, moduleKey),
        image: firstScreenshotPath(projects, pathname),
    })
}

const escapeAttribute = (value) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")

const replaceTitle = (html, value) =>
    html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(value)}</title>`)

const replaceMeta = (html, attribute, key, value) => {
    const expression = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, "i")
    const replacement = `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`

    return html.replace(expression, replacement)
}

const replaceCanonical = (html, value) =>
    html.replace(
        /<link\s+rel=["']canonical["'][^>]*>/i,
        `<link rel="canonical" href="${escapeAttribute(value)}" />`,
    )

const renderRouteHtml = (pathname, meta) => {
    const canonicalUrl = toCanonicalUrl(pathname)
    const imageUrl = toAbsoluteUrl(meta.image)
    let html = replaceTitle(baseHtml, meta.title)

    html = replaceMeta(html, "name", "description", meta.description)
    html = replaceMeta(html, "name", "robots", meta.noindex ? "noindex, nofollow" : "index, follow")
    html = replaceMeta(html, "property", "og:title", meta.title)
    html = replaceMeta(html, "property", "og:description", meta.description)
    html = replaceMeta(html, "property", "og:url", canonicalUrl)
    html = replaceMeta(html, "property", "og:image", imageUrl)
    html = replaceMeta(html, "property", "og:image:alt", meta.imageAlt ?? "임정규 포트폴리오")
    html = replaceMeta(html, "name", "twitter:title", meta.title)
    html = replaceMeta(html, "name", "twitter:description", meta.description)
    html = replaceMeta(html, "name", "twitter:image", imageUrl)
    html = replaceMeta(html, "name", "twitter:image:alt", meta.imageAlt ?? "임정규 포트폴리오")
    html = replaceCanonical(html, canonicalUrl)

    return injectPreloadTags(html, preloadTagsFor(pathname))
}

await writeFile(entryPath, renderRouteHtml("/", routeMeta["/"]))

for (const [pathname, meta] of Object.entries(routeMeta)) {
    if (pathname === "/") {
        continue
    }

    const routeDirectory = path.join(buildDirectory, pathname.slice(1))

    await mkdir(routeDirectory, { recursive: true })
    await writeFile(path.join(routeDirectory, "index.html"), renderRouteHtml(pathname, meta))
}

await writeFile(path.join(buildDirectory, "404.html"), renderRouteHtml("/404", notFoundRouteMeta))

// 매니페스트는 빌드 중에만 쓰므로 배포 파일에 남기지 않는다.
await rm(manifestDirectory, { recursive: true, force: true })

console.log(`Generated ${Object.keys(routeMeta).length} route metadata pages and 404.html`)
