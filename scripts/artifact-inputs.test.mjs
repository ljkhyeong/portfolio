// @vitest-environment node

import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, test } from "vitest"
import { createSourceFingerprint } from "./artifact-inputs.mjs"

const temporaryDirectories = []

afterEach(async () => {
    await Promise.all(
        temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
    )
})

describe("산출물 소스 지문", () => {
    test("입력 파일 집합이 달라지면 지문도 달라진다", async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-artifact-inputs-"))
        temporaryDirectories.push(root)
        await mkdir(path.join(root, "src"))
        await writeFile(path.join(root, "src", "main.jsx"), "main")
        await writeFile(path.join(root, "src", "App.jsx"), "app")

        const entryOnly = await createSourceFingerprint({ root, targets: ["src/main.jsx"] })
        const fullApp = await createSourceFingerprint({
            root,
            targets: ["src/main.jsx", "src/App.jsx"],
        })

        expect(fullApp).not.toBe(entryOnly)
    })
})
