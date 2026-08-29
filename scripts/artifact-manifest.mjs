import { createHash } from "node:crypto"
import { readFile, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { repositoryRoot } from "./artifact-inputs.mjs"

const manifestSchemaVersion = 1
const sha256Pattern = /^[a-f0-9]{64}$/
const toRepositoryPath = (root, filePath) =>
    path.relative(root, filePath).split(path.sep).join(path.posix.sep)

export const createArtifactSha256 = (artifact) =>
    createHash("sha256").update(artifact).digest("hex")

export const createArtifactManifest = ({
    artifact,
    artifactPath,
    renderer,
    root = repositoryRoot,
    sourceSha256,
}) => ({
    schemaVersion: manifestSchemaVersion,
    artifactPath: toRepositoryPath(root, artifactPath),
    sourceSha256,
    artifactSha256: createArtifactSha256(artifact),
    renderer,
})

export const writeArtifactManifest = async (manifestPath, manifest) => {
    const temporaryPath = `${manifestPath}.tmp`

    try {
        await writeFile(temporaryPath, `${JSON.stringify(manifest, null, 4)}\n`)
        await rename(temporaryPath, manifestPath)
    } finally {
        await rm(temporaryPath, { force: true })
    }
}

export const readArtifactManifest = async (manifestPath) => {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"))

    if (
        manifest.schemaVersion !== manifestSchemaVersion ||
        !sha256Pattern.test(manifest.sourceSha256 ?? "") ||
        !sha256Pattern.test(manifest.artifactSha256 ?? "") ||
        !manifest.renderer?.id ||
        !manifest.renderer?.name ||
        !manifest.renderer?.version ||
        !manifest.renderer?.platform ||
        !manifest.renderer?.architecture
    ) {
        throw new Error(`산출물 manifest 형식이 올바르지 않습니다: ${manifestPath}`)
    }

    return manifest
}

export const verifyArtifactManifest = ({
    artifact,
    artifactPath,
    expectedRendererId,
    manifest,
    root = repositoryRoot,
    sourceSha256,
}) => {
    const expectedArtifactPath = toRepositoryPath(root, artifactPath)

    if (manifest.artifactPath !== expectedArtifactPath) {
        throw new Error(
            `manifest의 산출물 경로가 다릅니다: ${manifest.artifactPath} (예상: ${expectedArtifactPath})`,
        )
    }

    if (manifest.sourceSha256 !== sourceSha256) {
        throw new Error("산출물이 현재 소스에서 생성되지 않았습니다.")
    }

    if (manifest.artifactSha256 !== createArtifactSha256(artifact)) {
        throw new Error("산출물 파일이 생성 당시 바이트와 다릅니다.")
    }

    if (expectedRendererId && manifest.renderer.id !== expectedRendererId) {
        throw new Error(
            `산출물 렌더러가 다릅니다: ${manifest.renderer.id} (예상: ${expectedRendererId})`,
        )
    }
}
