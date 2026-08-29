import { readFile } from "node:fs/promises"
import path from "node:path"
import { routeMeta, toCanonicalUrl } from "../src/data/routeMeta.js"
import { repositoryRoot } from "./artifact-inputs.mjs"
import { createSitemapXml } from "./sitemap-core.mjs"

const sitemapPath = path.join(repositoryRoot, "public", "sitemap.xml")
const [savedSitemap, currentSitemap] = await Promise.all([
    readFile(sitemapPath, "utf8"),
    Promise.resolve(createSitemapXml({ routeMeta, toCanonicalUrl })),
])

if (savedSitemap !== currentSitemap) {
    throw new Error(
        "sitemap.xml이 현재 공개 경로와 다릅니다. `npm run sitemap:generate`를 실행해 주세요.",
    )
}

console.log(
    `Verified sitemap.xml (${Object.values(routeMeta).filter((meta) => !meta.noindex).length} URLs)`,
)
