import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const commonRenderSourceTargets = [
    "index.html",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "src/main.jsx",
    "src/App.jsx",
    "src/App.css",
    "src/index.css",
    "src/component/Main.jsx",
    "src/component/Header.jsx",
    "src/component/Projects.jsx",
    "src/component/About.jsx",
    "src/component/NotFound.jsx",
    "src/component/ScrollToTopButton.jsx",
    "src/css/HomeHero.css",
    "src/css/Main.css",
    "src/css/Projects.css",
    "src/css/ScrollToTopButton.css",
    "src/data/profile.js",
    "src/data/homeHero.js",
    "src/data/homeSkills.js",
    "src/data/projectSummaries.js",
    "src/data/routeMeta.js",
    "src/utils/assetPath.js",
    "public/ljkhyeong-avatar.png",
]

const artifactPipelineSourceTargets = [
    "scripts/artifact-inputs.mjs",
    "scripts/artifact-manifest.mjs",
    "scripts/artifact-validation.mjs",
]

export const ogCoverSourceTargets = [
    ...commonRenderSourceTargets,
    ...artifactPipelineSourceTargets,
    "scripts/generate-og-cover.mjs",
    "scripts/og-cover-fingerprint.mjs",
]

export const portfolioPdfSourceTargets = [
    ...commonRenderSourceTargets,
    ...artifactPipelineSourceTargets,
    "src/component/print/PortfolioPrintPage.jsx",
    "src/css/PortfolioPrint.css",
    "scripts/generate-portfolio-pdf.mjs",
    "scripts/generate-portfolio-pdf-webkit.swift",
    "scripts/pdf-browser-support.mjs",
    "scripts/portfolio-pdf-fingerprint.mjs",
]

export const createSourceFingerprint = async ({ root = repositoryRoot, targets }) => {
    const hash = createHash("sha256")

    for (const target of [...new Set(targets)].sort()) {
        hash.update(target)
        hash.update("\0")
        hash.update(await readFile(path.join(root, target)))
        hash.update("\0")
    }

    return hash.digest("hex")
}
