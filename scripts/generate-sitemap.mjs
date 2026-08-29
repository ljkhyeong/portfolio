import { writeFile } from "node:fs/promises"
import path from "node:path"
import { routeMeta, toCanonicalUrl } from "../src/data/routeMeta.js"
import { repositoryRoot } from "./artifact-inputs.mjs"
import { createSitemapXml } from "./sitemap-core.mjs"

const sitemapPath = path.join(repositoryRoot, "public", "sitemap.xml")
const sitemap = createSitemapXml({ routeMeta, toCanonicalUrl })

await writeFile(sitemapPath, sitemap)
console.log(
    `Generated sitemap.xml with ${Object.values(routeMeta).filter((meta) => !meta.noindex).length} URLs`,
)
