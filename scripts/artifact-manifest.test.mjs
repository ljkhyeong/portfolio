// @vitest-environment node

import path from "node:path"
import { describe, expect, test } from "vitest"
import { createArtifactManifest, verifyArtifactManifest } from "./artifact-manifest.mjs"

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
