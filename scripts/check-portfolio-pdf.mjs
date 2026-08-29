import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readArtifactManifest, verifyArtifactManifest } from "./artifact-manifest.mjs"
import { validatePdfArtifact } from "./artifact-validation.mjs"
import {
    createPortfolioPdfFingerprint,
    portfolioPdfManifestPath,
} from "./portfolio-pdf-fingerprint.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pdfPath = path.join(repositoryRoot, "public", "임정규_포트폴리오.pdf")

const [manifest, currentFingerprint, pdf] = await Promise.all([
    readArtifactManifest(portfolioPdfManifestPath),
    createPortfolioPdfFingerprint(),
    readFile(pdfPath),
])

const { size } = validatePdfArtifact(pdf)

verifyArtifactManifest({
    artifact: pdf,
    artifactPath: pdfPath,
    expectedRendererId: "chrome",
    manifest,
    sourceSha256: currentFingerprint,
})

console.log(`Verified current portfolio PDF (${size} bytes)`)
