// @vitest-environment node

import { readFile } from "node:fs/promises"
import path from "node:path"
import { describe, expect, test } from "vitest"
import {
    FONTS,
    collectSiteCharacters,
    missingCharacters,
    repositoryRoot,
    sha256,
    stripComments,
    toCharacterSet,
} from "./font-subset-core.mjs"

describe("사이트 전용 글꼴 서브셋", () => {
    test("주석은 빼고 문자열 안의 주소는 남긴다", () => {
        const source = `// 주석
const url = "https://example.com" /* 블록 주석 */
{/* JSX 주석 */}<p>화면</p>`

        const stripped = stripComments(source)

        expect(stripped).toContain("https://example.com")
        expect(stripped).toContain("화면")
        expect(stripped).not.toMatch(/주석/)
    })

    test("글자 집합은 중복과 공백을 빼고 코드 순서로 정렬한다", () => {
        expect(toCharacterSet("나가 가\n나a")).toBe("a가나")
        expect(missingCharacters("가나다", "가다")).toEqual(["나"])
    })

    test.each(Object.entries(FONTS))(
        "저장한 %s 서브셋이 현재 화면 문구의 글자를 모두 담고 생성 기록과 같다",
        async (_, font) => {
            const manifest = JSON.parse(
                await readFile(path.join(repositoryRoot, font.manifest), "utf8"),
            )
            const artifact = await readFile(path.join(repositoryRoot, manifest.artifact.path))

            expect(manifest.family).toBe(font.family)
            expect(sha256(artifact)).toBe(manifest.artifact.sha256)
            // 실패하면 npm run font:subset으로 서브셋을 다시 만든다.
            expect(missingCharacters(await collectSiteCharacters(), manifest.characters)).toEqual(
                [],
            )
        },
    )
})
