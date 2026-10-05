// @vitest-environment node

import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, test } from "vitest"
import {
    createSourceFingerprint,
    ogCoverSourceTargets,
    portfolioPdfSourceTargets,
    projectOgSourceTargets,
    repositoryRoot,
} from "./artifact-inputs.mjs"

const temporaryDirectories = []
const RELATIVE_IMPORT_PATTERN = /(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+)["']/g

const resolveImport = async (fromFile, specifier) => {
    const base = path.join(path.dirname(fromFile), specifier)
    for (const candidate of [base, `${base}.js`, `${base}.jsx`]) {
        const exists = await access(path.join(repositoryRoot, candidate)).then(
            () => path.extname(candidate) !== "",
            () => false,
        )
        if (exists) {
            return candidate
        }
    }
    throw new Error(`${fromFile}에서 ${specifier}를 찾지 못했습니다.`)
}

// 진입 파일에서 상대 경로 import를 따라가며 렌더에 쓰이는 저장소 파일을 모은다.
const collectRenderFiles = async (entry) => {
    const files = new Set()
    const pending = [entry]
    while (pending.length > 0) {
        const file = pending.pop()
        if (files.has(file)) {
            continue
        }
        files.add(file)
        if (!/\.jsx?$/.test(file)) {
            continue
        }
        const source = await readFile(path.join(repositoryRoot, file), "utf8")
        for (const [, specifier] of source.matchAll(RELATIVE_IMPORT_PATTERN)) {
            pending.push(await resolveImport(file, specifier))
        }
    }
    return files
}

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

    test.each([
        ["홈 공유 이미지", "src/component/Main.jsx", ogCoverSourceTargets],
        ["PDF", "src/component/print/PortfolioPrintPage.jsx", portfolioPdfSourceTargets],
    ])("%s 지문은 화면이 불러오는 파일을 모두 포함한다", async (_, entry, targets) => {
        const missing = [...(await collectRenderFiles(entry))].filter(
            (file) => !targets.includes(file),
        )

        expect(missing).toEqual([])
    })
})
