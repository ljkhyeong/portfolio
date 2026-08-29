import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

export const portfolioPdfFingerprintPath = path.join(
    repositoryRoot,
    "scripts",
    "portfolio-pdf-source.sha256",
)

const sourceTargets = [
    "src/component/Main.jsx",
    "src/component/Header.jsx",
    "src/component/Projects.jsx",
    "src/component/About.jsx",
    "src/component/print/PortfolioPrintPage.jsx",
    "src/App.css",
    "src/index.css",
    "src/css/Main.css",
    "src/css/Projects.css",
    "src/css/PortfolioPrint.css",
    "src/data/profile.js",
    "src/data/homeHero.js",
    "src/data/homeSkills.js",
    "src/data/projectSummaries.js",
    "src/utils/assetPath.js",
    "public/ljkhyeong-avatar.png",
]

export const createPortfolioPdfFingerprint = async () => {
    const files = sourceTargets.map((target) => path.join(repositoryRoot, target)).sort()
    const hash = createHash("sha256")

    for (const filePath of files) {
        hash.update(path.relative(repositoryRoot, filePath))
        hash.update("\0")
        hash.update(await readFile(filePath))
        hash.update("\0")
    }

    return hash.digest("hex")
}
