import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { notFoundRouteMeta, routeMeta, siteUrl, toAbsoluteUrl } from "../src/data/routeMeta.js"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const buildDirectory = path.join(repositoryRoot, "build")
const entryPath = path.join(buildDirectory, "index.html")
const baseHtml = await readFile(entryPath, "utf8")

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
    const canonicalUrl = new URL(pathname, siteUrl).toString()
    const imageUrl = toAbsoluteUrl(meta.image)
    let html = replaceTitle(baseHtml, meta.title)

    html = replaceMeta(html, "name", "description", meta.description)
    html = replaceMeta(html, "name", "robots", meta.noindex ? "noindex, nofollow" : "index, follow")
    html = replaceMeta(html, "property", "og:title", meta.title)
    html = replaceMeta(html, "property", "og:description", meta.description)
    html = replaceMeta(html, "property", "og:url", canonicalUrl)
    html = replaceMeta(html, "property", "og:image", imageUrl)
    html = replaceMeta(html, "name", "twitter:title", meta.title)
    html = replaceMeta(html, "name", "twitter:description", meta.description)
    html = replaceMeta(html, "name", "twitter:image", imageUrl)
    html = replaceCanonical(html, canonicalUrl)

    return html
}

for (const [pathname, meta] of Object.entries(routeMeta)) {
    if (pathname === "/" || meta.noindex) {
        continue
    }

    const routeDirectory = path.join(buildDirectory, pathname.slice(1))

    await mkdir(routeDirectory, { recursive: true })
    await writeFile(path.join(routeDirectory, "index.html"), renderRouteHtml(pathname, meta))
}

await writeFile(path.join(buildDirectory, "404.html"), renderRouteHtml("/404", notFoundRouteMeta))

console.log(`Generated ${Object.keys(routeMeta).length - 2} route metadata pages and 404.html`)

await import("./prune-legacy-assets.mjs")
