import { execFile } from "node:child_process"
import { access } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import { projectSummaries } from "../src/data/projectSummaries.js"
import { coverImageOf, coverVariantsOf } from "../src/utils/coverImage.js"

// 메인 카드 화면의 작은 사본과 잘라 둔 이미지를 원본 WebP에서 만든다. cwebp(libwebp)가 필요하다.
const run = promisify(execFile)
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicPath = (fileName) => path.join(repositoryRoot, "public", fileName)
const QUALITY = "82"

const exists = (filePath) =>
    access(filePath).then(
        () => true,
        () => false,
    )

for (const project of projectSummaries.filter((candidate) => candidate.coverScreenshot)) {
    const shot = project.coverScreenshot
    const image = coverImageOf(shot)

    if (image !== shot) {
        const { x = 0, y = 0 } = image.crop ?? {}
        await run("cwebp", [
            "-quiet",
            "-q",
            QUALITY,
            "-crop",
            String(x),
            String(y),
            String(image.width),
            String(image.height),
            publicPath(shot.src),
            "-o",
            publicPath(image.src),
        ])
        console.log(`잘라 둔 이미지: ${image.src} (${image.width}x${image.height})`)
    }

    for (const variant of coverVariantsOf(image)) {
        if (!(await exists(publicPath(image.src)))) {
            throw new Error(`원본 이미지가 없습니다: ${image.src}`)
        }

        await run("cwebp", [
            "-quiet",
            "-q",
            QUALITY,
            "-resize",
            String(variant.width),
            "0",
            publicPath(image.src),
            "-o",
            publicPath(variant.src),
        ])
        console.log(`작은 사본: ${variant.src}`)
    }
}
