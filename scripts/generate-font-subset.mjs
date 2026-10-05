import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"
import {
    FONT_FAMILY,
    FONT_MANIFEST,
    FONT_OUTPUT,
    collectSiteCharacters,
    repositoryRoot,
    sha256,
} from "./font-subset-core.mjs"

// 사이트 전용 글꼴 서브셋을 다시 만든다. 원본 글꼴과 Python 도구는 저장소에 두지 않는다.
//   python3 -m venv .venv-font && .venv-font/bin/pip install fonttools==4.66.1 brotli==1.2.0
//   원본: https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2
//   npm run font:subset -- --source <PretendardVariable.woff2> --python .venv-font/bin/python
const SOURCE_VERSION = "pretendard@1.3.9 PretendardVariable.woff2"

const { values } = parseArgs({
    options: {
        source: { type: "string" },
        python: { type: "string", default: "python3" },
    },
})

if (!values.source) {
    console.error("--source로 PretendardVariable.woff2 경로를 지정하세요.")
    process.exit(1)
}

const characters = await collectSiteCharacters()
const workDirectory = await mkdtemp(path.join(os.tmpdir(), "portfolio-font-"))
const outputPath = path.join(repositoryRoot, FONT_OUTPUT)

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
            FONT_FAMILY,
        ],
        { stdio: "inherit" },
    )
    if (result.status !== 0) {
        throw new Error("글꼴 서브셋을 만들지 못했습니다. fonttools와 brotli 설치를 확인하세요.")
    }

    const source = await readFile(path.resolve(values.source))
    const artifact = await readFile(outputPath)
    const manifest = {
        family: FONT_FAMILY,
        source: { name: SOURCE_VERSION, sha256: sha256(source), bytes: source.length },
        artifact: { path: FONT_OUTPUT, sha256: sha256(artifact), bytes: artifact.length },
        characters,
    }
    await writeFile(
        path.join(repositoryRoot, FONT_MANIFEST),
        `${JSON.stringify(manifest, null, 4)}\n`,
    )
    console.log(
        `글꼴 서브셋 생성: ${FONT_OUTPUT} (${artifact.length} bytes, ${[...characters].length}자)`,
    )
} finally {
    await rm(workDirectory, { recursive: true, force: true })
}
