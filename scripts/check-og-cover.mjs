import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readArtifactManifest, verifyArtifactManifest } from "./artifact-manifest.mjs"
import { validatePngArtifact } from "./artifact-validation.mjs"
import {
    createOgCoverFingerprint,
    createProjectOgFingerprint,
    ogCoverManifestPath,
    projectOgManifestPath,
} from "./og-cover-fingerprint.mjs"
import { projectOgCards } from "../src/data/projectOg.js"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const coverPath = path.join(repositoryRoot, "public", "og-cover.png")

const [manifest, currentFingerprint, cover] = await Promise.all([
    readArtifactManifest(ogCoverManifestPath),
    createOgCoverFingerprint(),
    readFile(coverPath),
])

const { height, size, width } = validatePngArtifact(cover, {
    expectedHeight: 630,
    expectedWidth: 1200,
})

verifyArtifactManifest({
    artifact: cover,
    artifactPath: coverPath,
    expectedRendererId: "chrome",
    manifest,
    sourceSha256: currentFingerprint,
})

console.log(`홈 공유 이미지 확인: ${width}x${height}, ${size} bytes`)

const projectFingerprint = await createProjectOgFingerprint()
for (const card of projectOgCards) {
    const artifactPath = path.join(repositoryRoot, "public", card.image)
    const [artifact, projectManifest] = await Promise.all([
        readFile(artifactPath),
        readArtifactManifest(projectOgManifestPath(card.id)),
    ])
    validatePngArtifact(artifact, { expectedHeight: 630, expectedWidth: 1200 })
    verifyArtifactManifest({
        artifact,
        artifactPath,
        expectedRendererId: "chrome",
        manifest: projectManifest,
        sourceSha256: projectFingerprint,
    })
}
console.log(`프로젝트 및 BATON 서비스 공유 이미지 ${projectOgCards.length}개 확인`)
