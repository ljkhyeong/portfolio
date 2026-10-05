import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

// 사이트 전용 글꼴 서브셋에 넣을 글자를 저장소 원본에서 모은다.
// 화면 문구는 src의 데이터·컴포넌트·CSS content와 index.html에 있으므로 이 파일들의 글자를 모두 넣고,
// 주석은 화면에 나오지 않으므로 뺀다. 빠뜨린 글자가 있으면 시스템 글꼴로 대체되므로 넉넉하게 모은다.
export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const FONT_FAMILY = "Portfolio Sans"
export const FONT_OUTPUT = "public/fonts/portfolio-sans.woff2"
export const FONT_MANIFEST = "scripts/font-subset.manifest.json"

const SOURCE_DIRECTORIES = ["src"]
const EXTRA_FILES = ["index.html"]
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".json", ".css", ".html"])
// 영문·숫자·기본 기호는 어디서 쓰일지 몰라 항상 넣는다. 화살표·구분 기호도 함께 둔다.
const ALWAYS_INCLUDED = [
    ...Array.from({ length: 0x7e - 0x20 + 1 }, (_, index) => String.fromCodePoint(0x20 + index)),
    ..."·•…–—‘’“”→←↑↓↗↘✓×±≤≥©",
].join("")

const isSourceFile = (file) =>
    SOURCE_EXTENSIONS.has(path.extname(file)) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(file)

const listFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    const nested = await Promise.all(
        entries.map((entry) => {
            const entryPath = path.join(directory, entry.name)
            return entry.isDirectory() ? listFiles(entryPath) : [entryPath]
        }),
    )
    return nested.flat()
}

// 문자열 안의 "//"(URL)는 남기고 줄 주석과 블록 주석만 지운다.
export const stripComments = (source) =>
    source
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/(^|[\s;{}(),])\/\/[^\n]*/g, "$1")

const isRenderable = (character) => {
    const codePoint = character.codePointAt(0)
    return codePoint >= 0x20 && codePoint !== 0x7f && !/\s/u.test(character)
}

export const toCharacterSet = (text) =>
    [...new Set([...text].filter(isRenderable))]
        .sort((left, right) => left.codePointAt(0) - right.codePointAt(0))
        .join("")

export const collectSiteCharacters = async ({ root = repositoryRoot } = {}) => {
    const directories = await Promise.all(
        SOURCE_DIRECTORIES.map((directory) => listFiles(path.join(root, directory))),
    )
    const files = [
        ...directories.flat().filter(isSourceFile),
        ...EXTRA_FILES.map((file) => path.join(root, file)),
    ]
    const sources = await Promise.all(files.map((file) => readFile(file, "utf8")))
    return toCharacterSet(ALWAYS_INCLUDED + sources.map(stripComments).join(""))
}

export const missingCharacters = (required, available) => {
    const availableSet = new Set(available)
    return [...required].filter((character) => !availableSet.has(character))
}

export const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex")
