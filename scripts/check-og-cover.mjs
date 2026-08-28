import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createOgCoverFingerprint, ogCoverFingerprintPath } from "./og-cover-fingerprint.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const coverPath = path.join(repositoryRoot, "public", "og-cover.png")

const [savedFingerprint, currentFingerprint, cover, coverStat] = await Promise.all([
    readFile(ogCoverFingerprintPath, "utf8").then((value) => value.trim()),
    createOgCoverFingerprint(),
    readFile(coverPath),
    stat(coverPath),
])

if (savedFingerprint !== currentFingerprint) {
    throw new Error("공유 이미지가 현재 홈 화면과 다릅니다. `npm run og:generate`를 실행해 주세요.")
}

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const width = cover.readUInt32BE(16)
const height = cover.readUInt32BE(20)

if (
    !cover.subarray(0, pngSignature.length).equals(pngSignature) ||
    coverStat.size < 50_000 ||
    width !== 1200 ||
    height !== 630
) {
    throw new Error(
        `공유 이미지 파일이 유효하지 않습니다: ${width}x${height}, ${coverStat.size} bytes`,
    )
}

console.log(`Verified current OG cover (${width}x${height}, ${coverStat.size} bytes)`)
