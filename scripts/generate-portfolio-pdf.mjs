import { spawn } from "node:child_process"
import { access, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import {
    createPortfolioPdfFingerprint,
    portfolioPdfFingerprintPath,
} from "./portfolio-pdf-fingerprint.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = path.join(repositoryRoot, "public", "포트폴리오최신.pdf")
const temporaryOutputPath = path.join(repositoryRoot, "public", ".portfolio-latest.pdf.tmp")

const chromeCandidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
].filter(Boolean)

const findChrome = async () => {
    for (const candidate of chromeCandidates) {
        try {
            await access(candidate)
            return candidate
        } catch {
            // 다음 후보를 확인합니다.
        }
    }

    throw new Error("Chrome 또는 Chromium을 찾지 못했습니다. CHROME_PATH를 지정해 주세요.")
}

const runChrome = (chromePath, args, { capture = false } = {}) =>
    new Promise((resolve, reject) => {
        const child = spawn(chromePath, args, {
            cwd: repositoryRoot,
            stdio: capture ? ["ignore", "pipe", "pipe"] : ["ignore", "inherit", "inherit"],
        })
        let stdout = ""
        let stderr = ""

        if (capture) {
            child.stdout.setEncoding("utf8")
            child.stderr.setEncoding("utf8")
            child.stdout.on("data", (chunk) => {
                stdout += chunk
            })
            child.stderr.on("data", (chunk) => {
                stderr += chunk
            })
        }

        child.on("error", reject)
        child.on("exit", (code) => {
            if (code === 0) {
                resolve({ stdout, stderr })
                return
            }

            reject(new Error(`Chrome이 종료 코드 ${code}로 실패했습니다.\n${stderr}`))
        })
    })

const server = await createServer({
    root: repositoryRoot,
    logLevel: "error",
    server: {
        host: "127.0.0.1",
        port: 0,
        strictPort: false,
    },
})

try {
    await server.listen()
    const address = server.httpServer.address()
    const port = typeof address === "object" && address ? address.port : 5173
    const printUrl = `http://127.0.0.1:${port}/portfolio/print`
    const chromePath = await findChrome()

    const commonArgs = [
        "--headless=new",
        "--disable-background-networking",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--incognito",
        "--no-default-browser-check",
        "--no-first-run",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=6000",
    ]

    const { stdout: renderedHtml } = await runChrome(
        chromePath,
        [...commonArgs, "--dump-dom", printUrl],
        { capture: true },
    )

    const ready = /data-print-ready="true"/.test(renderedHtml)
    const overflowMatch = renderedHtml.match(/data-print-overflow-count="(\d+)"/)
    const overflowCount = Number(overflowMatch?.[1] ?? -1)
    const overflowPages =
        renderedHtml.match(/data-print-overflow-pages="([^"]*)"/)?.[1] || "확인 불가"

    if (!ready) {
        throw new Error("인쇄 화면의 이미지와 폰트가 준비되기 전에 검증이 종료됐습니다.")
    }

    if (overflowCount !== 0) {
        throw new Error(`A4 영역을 넘는 페이지가 있습니다: ${overflowPages}`)
    }

    await rm(temporaryOutputPath, { force: true })
    await runChrome(chromePath, [
        ...commonArgs,
        "--no-pdf-header-footer",
        "--generate-pdf-document-outline",
        `--print-to-pdf=${temporaryOutputPath}`,
        printUrl,
    ])

    const generatedFile = await stat(temporaryOutputPath)
    if (generatedFile.size < 100_000) {
        throw new Error(`생성된 PDF 크기가 비정상적으로 작습니다: ${generatedFile.size} bytes`)
    }

    await rename(temporaryOutputPath, outputPath)
    const fingerprint = await createPortfolioPdfFingerprint()
    await writeFile(portfolioPdfFingerprintPath, `${fingerprint}\n`)
    process.stdout.write(`PDF 생성 완료: ${outputPath} (${generatedFile.size} bytes)\n`)
} finally {
    await server.close()
    await rm(temporaryOutputPath, { force: true })
}
