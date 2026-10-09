import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { readAssetVersions } from "./asset-versions.mjs"
import { withAssetVersion } from "../src/utils/assetVersion.js"

describe("화면 캡처 주소 버전", () => {
    it("이미지 내용이 바뀌면 버전이 바뀌고 PDF와 하위 폴더는 넣지 않는다", () => {
        const directory = mkdtempSync(path.join(tmpdir(), "asset-versions-"))
        try {
            writeFileSync(path.join(directory, "a.webp"), "first")
            writeFileSync(path.join(directory, "b.pdf"), "pdf")
            const before = readAssetVersions(directory)
            writeFileSync(path.join(directory, "a.webp"), "second")
            const after = readAssetVersions(directory)

            expect(Object.keys(before)).toEqual(["a.webp"])
            expect(before["a.webp"]).toMatch(/^[0-9a-f]{10}$/)
            expect(after["a.webp"]).not.toBe(before["a.webp"])
        } finally {
            rmSync(directory, { recursive: true, force: true })
        }
    })

    it("버전이 있는 파일에만 주소 뒤에 붙인다", () => {
        const versions = { "a b.webp": "0123456789" }

        expect(withAssetVersion("/a%20b.webp", "a b.webp", versions)).toBe(
            "/a%20b.webp?v=0123456789",
        )
        expect(withAssetVersion("/c.pdf", "c.pdf", versions)).toBe("/c.pdf")
    })
})
