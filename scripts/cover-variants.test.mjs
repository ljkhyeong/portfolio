// @vitest-environment node

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"
import { projectSummaries } from "../src/data/projectSummaries.js"
import { coverImageOf, coverVariantsOf } from "../src/utils/coverImage.js"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

// WebP 머리글에서 가로·세로 크기를 읽는다(손실 VP8, 무손실 VP8L, 확장 VP8X).
const webpSize = (buffer) => {
    const chunk = buffer.toString("ascii", 12, 16)

    if (chunk === "VP8 ") {
        return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
    }

    if (chunk === "VP8L") {
        const bits = buffer.readUInt32LE(21)
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }

    if (chunk === "VP8X") {
        return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 }
    }

    throw new Error(`WebP 머리글을 읽지 못했습니다: ${chunk}`)
}

const covers = projectSummaries
    .filter((project) => project.coverScreenshot)
    .map((project) => [project.id, coverImageOf(project.coverScreenshot)])

describe("메인 카드 화면 사본", () => {
    // 실패하면 npm run cover:variants로 사본을 다시 만든다.
    test.each(covers)("%s 카드 화면과 작은 사본이 적힌 크기로 있다", async (_, image) => {
        const read = (fileName) => readFile(path.join(repositoryRoot, "public", fileName))
        const original = webpSize(await read(image.src))

        expect(original).toEqual({ width: image.width, height: image.height })

        for (const variant of coverVariantsOf(image)) {
            const size = webpSize(await read(variant.src))

            expect(size.width).toBe(variant.width)
            expect(
                Math.abs(size.height - (image.height * variant.width) / image.width),
            ).toBeLessThan(1)
        }
    })
})
