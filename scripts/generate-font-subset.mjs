import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"
import { FONTS, collectSiteCharacters, repositoryRoot, sha256 } from "./font-subset-core.mjs"

// 사이트 전용 글꼴 서브셋을 다시 만든다. 원본 글꼴과 Python 도구는 저장소에 두지 않는다.
//   python3 -m venv .venv-font && .venv-font/bin/pip install fonttools==4.66.1 brotli==1.2.0
//   본문(sans): https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2
//   제목(display): https://raw.githubusercontent.com/google/fonts/main/ofl/hahmlet/Hahmlet%5Bwght%5D.ttf
//   npm run font:subset -- --source <PretendardVariable.woff2> --python .venv-font/bin/python
//   npm run font:subset -- --font display --source <Hahmlet[wght].ttf> --python .venv-font/bin/python
const { values } = parseArgs({
    options: {
        font: { type: "string", default: "sans" },
        source: { type: "string" },
        python: { type: "string", default: "python3" },
    },
})

const font = FONTS[values.font]

if (!font) {
    console.error(`--font는 ${Object.keys(FONTS).join(", ")} 중 하나여야 합니다.`)
    process.exit(1)
}

if (!values.source) {
    console.error(`--source로 원본 글꼴 경로를 지정하세요. (${font.sourceName})`)
    process.exit(1)
}

const characters = await collectSiteCharacters()
const workDirectory = await mkdtemp(path.join(os.tmpdir(), "portfolio-font-"))
const outputPath = path.join(repositoryRoot, font.output)

try {
    const textFile = path.join(workDirectory, "characters.txt")
    await writeFile(textFile, characters)
    await mkdir(path.dirname(outputPath), { recursive: true })

    const result = spawnSync(
        values.python,
        [
            path.join(repositoryRoot, "scripts", "subset-font.py"),
            "--source",
            path.resolve(values.source),
            "--text-file",
            textFile,
            "--output",
            outputPath,
            "--family",
            font.family,
            ...font.originalNames.flatMap((name) => ["--original-name", name]),
            ...(font.weightRange ? ["--weight-range", font.weightRange] : []),
        ],
        { stdio: "inherit" },
    )
    if (result.status !== 0) {
        throw new Error("글꼴 서브셋을 만들지 못했습니다. fonttools와 brotli 설치를 확인하세요.")
    }

    const source = await readFile(path.resolve(values.source))
    const artifact = await readFile(outputPath)
    const manifest = {
        family: font.family,
        source: { name: font.sourceName, sha256: sha256(source), bytes: source.length },
        artifact: { path: font.output, sha256: sha256(artifact), bytes: artifact.length },
        characters,
    }
    await writeFile(
        path.join(repositoryRoot, font.manifest),
        `${JSON.stringify(manifest, null, 4)}\n`,
    )
    console.log(
        `글꼴 서브셋 생성: ${font.output} (${artifact.length} bytes, ${[...characters].length}자)`,
    )
} finally {
    await rm(workDirectory, { recursive: true, force: true })
}
