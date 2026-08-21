import { createHash } from "node:crypto"
import { readdir, readFile, stat } from "node:fs/promises"
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

const collectFiles = async (target) => {
    const targetPath = path.join(repositoryRoot, target)
    const targetStat = await stat(targetPath)

    if (targetStat.isFile()) {
        return [targetPath]
    }

    const entries = await readdir(targetPath, { withFileTypes: true })
    const files = await Promise.all(
        entries.map((entry) => collectFiles(path.join(target, entry.name))),
    )

    return files.flat()
}

export const createPortfolioPdfFingerprint = async () => {
    const files = (await Promise.all(sourceTargets.map(collectFiles))).flat().sort()
    const hash = createHash("sha256")

    for (const filePath of files) {
        hash.update(path.relative(repositoryRoot, filePath))
        hash.update("\0")
        hash.update(await readFile(filePath))
        hash.update("\0")
    }

    return hash.digest("hex")
}
