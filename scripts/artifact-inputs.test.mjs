// @vitest-environment node

import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, test } from "vitest"
import {
    createSourceFingerprint,
    ogCoverSourceTargets,
    portfolioPdfSourceTargets,
    projectOgSourceTargets,
} from "./artifact-inputs.mjs"

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

    test("메인 변경은 홈 이미지와 PDF만, 상세 이미지 스타일 변경은 상세 이미지만 갱신한다", async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-artifact-scope-"))
        temporaryDirectories.push(root)
        const groups = [ogCoverSourceTargets, portfolioPdfSourceTargets, projectOgSourceTargets]
        for (const file of new Set(groups.flat())) {
            await mkdir(path.dirname(path.join(root, file)), { recursive: true })
            await writeFile(path.join(root, file), file)
        }
        const fingerprints = () =>
            Promise.all(groups.map((targets) => createSourceFingerprint({ root, targets })))
        const before = await fingerprints()

        await writeFile(path.join(root, "src/data/homeSkills.js"), "기술 설명 변경")
        const afterHome = await fingerprints()
        expect(afterHome[0]).not.toBe(before[0])
        expect(afterHome[1]).not.toBe(before[1])
        expect(afterHome[2]).toBe(before[2])

        await writeFile(path.join(root, "src/css/ProjectOg.css"), "공유 이미지 스타일 변경")
        const afterOg = await fingerprints()
        expect(afterOg[0]).toBe(afterHome[0])
        expect(afterOg[1]).toBe(afterHome[1])
        expect(afterOg[2]).not.toBe(afterHome[2])
    })
})
