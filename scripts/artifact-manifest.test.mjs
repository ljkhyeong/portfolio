// @vitest-environment node

import path from "node:path"
import os from "node:os"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import {
    createArtifactManifest,
    isArtifactCurrent,
    verifyArtifactManifest,
    writeArtifactManifest,
} from "./artifact-manifest.mjs"
import { validatePdfArtifact } from "./artifact-validation.mjs"

describe("산출물 manifest", () => {
    test("생성 뒤 산출물 바이트가 하나라도 달라지면 검증에 실패한다", () => {
        const root = path.resolve("/repository")
        const artifactPath = path.join(root, "public", "artifact.pdf")
        const artifact = Buffer.from("%PDF-content")
        const manifest = createArtifactManifest({
            artifact,
            artifactPath,
            renderer: {
                id: "chrome",
                name: "Chrome",
                version: "Chrome 1",
                platform: "darwin",
                architecture: "arm64",
            },
            root,
            sourceSha256: "a".repeat(64),
        })
        const changedArtifact = Buffer.from(artifact)
        changedArtifact[changedArtifact.length - 1] ^= 1

        expect(() =>
            verifyArtifactManifest({
                artifact,
                artifactPath,
                expectedRendererId: "chrome",
                manifest,
                root,
                sourceSha256: "a".repeat(64),
            }),
        ).not.toThrow()
        expect(() =>
            verifyArtifactManifest({
                artifact: changedArtifact,
                artifactPath,
                expectedRendererId: "chrome",
                manifest,
                root,
                sourceSha256: "a".repeat(64),
            }),
        ).toThrow("산출물 파일이 생성 당시 바이트와 다릅니다")
    })
})

describe("산출물 재생성 판단", () => {
    let options
    let artifact

    beforeEach(async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-current-artifact-"))
        options = {
            root,
            artifactPath: path.join(root, "portfolio.pdf"),
            manifestPath: path.join(root, "portfolio.manifest.json"),
            sourceSha256: "a".repeat(64),
            expectedRendererId: "chrome",
            validateArtifact: validatePdfArtifact,
        }
        artifact = Buffer.alloc(100_000)
        artifact.write("%PDF-")
        await writeFile(options.artifactPath, artifact)
        await writeArtifactManifest(
            options.manifestPath,
            createArtifactManifest({
                ...options,
                artifact,
                renderer: {
                    id: "chrome",
                    name: "Chrome",
                    version: "Chrome 1",
                    platform: "darwin",
                    architecture: "arm64",
                },
            }),
        )
    })

    afterEach(async () => {
        await rm(options.root, { recursive: true, force: true })
    })

    test("원본, 파일과 렌더러가 같으면 재생성을 생략한다", async () => {
        expect(await isArtifactCurrent(options)).toBe(true)
        expect(await isArtifactCurrent({ ...options, sourceSha256: "b".repeat(64) })).toBe(false)
        expect(await isArtifactCurrent({ ...options, expectedRendererId: "edge" })).toBe(false)
    })

    test("형식이 유효해도 파일 바이트가 달라지면 재생성한다", async () => {
        artifact[artifact.length - 1] ^= 1
        await writeFile(options.artifactPath, artifact)
        expect(await isArtifactCurrent(options)).toBe(false)
    })

    test("파일이나 생성 기록이 없거나 손상되면 재생성한다", async () => {
        await rm(options.artifactPath)
        expect(await isArtifactCurrent(options)).toBe(false)
        await writeFile(options.artifactPath, artifact)
        await writeFile(options.manifestPath, "broken json")
        expect(await isArtifactCurrent(options)).toBe(false)
        await rm(options.manifestPath)
        expect(await isArtifactCurrent(options)).toBe(false)
    })

    test("파일 해시가 일치해도 형식 검증을 통과하지 못하면 재생성한다", async () => {
        expect(
            await isArtifactCurrent({
                ...options,
                validateArtifact: (value) => validatePdfArtifact(value, { minimumSize: 200_000 }),
            }),
        ).toBe(false)
    })
})
