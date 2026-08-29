// @vitest-environment node

import { describe, expect, test } from "vitest"
import { validatePdfArtifact, validatePngArtifact } from "./artifact-validation.mjs"

const createPngHeader = () => {
    const png = Buffer.alloc(24)
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(png)
    png.writeUInt32BE(1200, 16)
    png.writeUInt32BE(630, 20)
    return png
}

describe("PNG 산출물 검증", () => {
    test.each([0, 8, 23])("%i바이트 파일을 안전하게 거부한다", (length) => {
        expect(() =>
            validatePngArtifact(Buffer.alloc(length), {
                expectedHeight: 630,
                expectedWidth: 1200,
                minimumSize: 24,
            }),
        ).toThrow("헤더를 읽을 수 없을 만큼 짧습니다")
    })

    test("잘못된 PNG 서명을 거부한다", () => {
        const png = createPngHeader()
        png[0] = 0

        expect(() =>
            validatePngArtifact(png, {
                expectedHeight: 630,
                expectedWidth: 1200,
                minimumSize: 24,
            }),
        ).toThrow("PNG 파일 서명이 올바르지 않습니다")
    })

    test("서명과 치수가 맞는 PNG를 승인한다", () => {
        expect(
            validatePngArtifact(createPngHeader(), {
                expectedHeight: 630,
                expectedWidth: 1200,
                minimumSize: 24,
            }),
        ).toEqual({ height: 630, size: 24, width: 1200 })
    })
})

describe("PDF 산출물 검증", () => {
    test("생성기와 검사기가 사용할 PDF 서명 및 크기 조건을 확인한다", () => {
        expect(validatePdfArtifact(Buffer.from("%PDF-content"), { minimumSize: 5 })).toEqual({
            size: 12,
        })
        expect(() => validatePdfArtifact(Buffer.from("not-pdf"), { minimumSize: 5 })).toThrow(
            "PDF 파일 서명이 올바르지 않습니다",
        )
    })
})
