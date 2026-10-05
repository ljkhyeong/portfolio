import { readFile } from "node:fs/promises"
import path from "node:path"
import {
    FONT_MANIFEST,
    collectSiteCharacters,
    missingCharacters,
    repositoryRoot,
    sha256,
} from "./font-subset-core.mjs"

// 화면 문구에 서브셋에 없는 글자가 생기면 그 글자만 시스템 글꼴로 보인다. 빌드 전에 막는다.
const manifest = JSON.parse(await readFile(path.join(repositoryRoot, FONT_MANIFEST), "utf8"))
const artifact = await readFile(path.join(repositoryRoot, manifest.artifact.path))
const failures = []

if (sha256(artifact) !== manifest.artifact.sha256) {
    failures.push(`${manifest.artifact.path}가 생성 기록과 다릅니다.`)
}

const missing = missingCharacters(await collectSiteCharacters(), manifest.characters)
if (missing.length > 0) {
    failures.push(
        `서브셋에 없는 글자 ${missing.length}개: ${missing.join("")}\n` +
            "npm run font:subset으로 다시 만드세요(scripts/generate-font-subset.mjs 참고).",
    )
}

if (failures.length > 0) {
    console.error(failures.join("\n"))
    process.exit(1)
}

console.log(
    `글꼴 서브셋 확인: ${manifest.artifact.path} (${artifact.length} bytes, ${[...manifest.characters].length}자)`,
)
