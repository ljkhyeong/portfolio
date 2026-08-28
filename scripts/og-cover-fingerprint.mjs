import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

export const ogCoverFingerprintPath = path.join(repositoryRoot, "scripts", "og-cover-source.sha256")

const sourceTargets = [
    "src/App.jsx",
    "src/App.css",
    "src/index.css",
    "src/component/Main.jsx",
    "src/component/Header.jsx",
    "src/component/Projects.jsx",
    "src/component/About.jsx",
    "src/css/Main.css",
    "src/css/Projects.css",
    "src/data/profile.js",
    "src/data/homeHero.js",
    "src/data/homeSkills.js",
    "src/data/projectSummaries.js",
    "src/utils/assetPath.js",
    "public/ljkhyeong-avatar.png",
]

export const createOgCoverFingerprint = async () => {
    const hash = createHash("sha256")

    for (const target of sourceTargets.sort()) {
        hash.update(target)
        hash.update("\0")
        hash.update(await readFile(path.join(repositoryRoot, target)))
        hash.update("\0")
    }

    return hash.digest("hex")
}
