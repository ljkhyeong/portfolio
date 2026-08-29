const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const pdfSignature = Buffer.from("%PDF-", "ascii")

export const validatePngArtifact = (
    artifact,
    { expectedHeight, expectedWidth, minimumSize = 50_000 },
) => {
    if (artifact.length < 24) {
        throw new Error(`PNG 파일이 헤더를 읽을 수 없을 만큼 짧습니다: ${artifact.length} bytes`)
    }

    if (!artifact.subarray(0, pngSignature.length).equals(pngSignature)) {
        throw new Error("PNG 파일 서명이 올바르지 않습니다.")
    }

    const width = artifact.readUInt32BE(16)
    const height = artifact.readUInt32BE(20)

    if (artifact.length < minimumSize || width !== expectedWidth || height !== expectedHeight) {
        throw new Error(
            `PNG 파일이 유효하지 않습니다: ${width}x${height}, ${artifact.length} bytes`,
        )
    }

    return { height, size: artifact.length, width }
}

export const validatePdfArtifact = (artifact, { minimumSize = 100_000 } = {}) => {
    if (artifact.length < pdfSignature.length) {
        throw new Error(`PDF 파일이 헤더를 읽을 수 없을 만큼 짧습니다: ${artifact.length} bytes`)
    }

    if (!artifact.subarray(0, pdfSignature.length).equals(pdfSignature)) {
        throw new Error("PDF 파일 서명이 올바르지 않습니다.")
    }

    if (artifact.length < minimumSize) {
        throw new Error(`PDF 파일 크기가 비정상적으로 작습니다: ${artifact.length} bytes`)
    }

    return { size: artifact.length }
}
