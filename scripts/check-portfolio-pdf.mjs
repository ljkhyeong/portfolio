import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
    createPortfolioPdfFingerprint,
    portfolioPdfFingerprintPath,
} from "./portfolio-pdf-fingerprint.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pdfPath = path.join(repositoryRoot, "public", "포트폴리오최신.pdf")

const [savedFingerprint, currentFingerprint, pdfHeader, pdfStat] = await Promise.all([
    readFile(portfolioPdfFingerprintPath, "utf8").then((value) => value.trim()),
    createPortfolioPdfFingerprint(),
    readFile(pdfPath).then((value) => value.subarray(0, 5).toString("ascii")),
    stat(pdfPath),
])

if (savedFingerprint !== currentFingerprint) {
    throw new Error(
        "포트폴리오 PDF가 현재 소스와 다릅니다. `npm run pdf:generate`를 실행해 주세요.",
    )
}

if (pdfHeader !== "%PDF-" || pdfStat.size < 100_000) {
    throw new Error(`포트폴리오 PDF 파일이 유효하지 않습니다: ${pdfStat.size} bytes`)
}

console.log(`Verified current portfolio PDF (${pdfStat.size} bytes)`)
