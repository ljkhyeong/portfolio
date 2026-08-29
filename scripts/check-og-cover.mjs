import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readArtifactManifest, verifyArtifactManifest } from "./artifact-manifest.mjs"
import { validatePngArtifact } from "./artifact-validation.mjs"
import { createOgCoverFingerprint, ogCoverManifestPath } from "./og-cover-fingerprint.mjs"

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

console.log(`Verified current OG cover (${width}x${height}, ${size} bytes)`)
