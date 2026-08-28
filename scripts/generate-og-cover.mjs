import { spawn } from "node:child_process"
import { access, readFile, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import { createOgCoverFingerprint, ogCoverFingerprintPath } from "./og-cover-fingerprint.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = path.join(repositoryRoot, "public", "og-cover.png")
const temporaryOutputPath = path.join(repositoryRoot, "public", ".og-cover.tmp.png")
const expectedWidth = 1200
const expectedHeight = 630

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

const runChrome = (chromePath, args) =>
    new Promise((resolve, reject) => {
        const child = spawn(chromePath, args, {
            cwd: repositoryRoot,
            stdio: ["ignore", "inherit", "inherit"],
        })

        child.on("error", reject)
        child.on("exit", (code) => {
            if (code === 0) {
                resolve()
                return
            }

            reject(new Error(`Chrome이 종료 코드 ${code}로 실패했습니다.`))
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
    const homeUrl = `http://127.0.0.1:${port}/`
    const chromePath = await findChrome()

    await rm(temporaryOutputPath, { force: true })
    await runChrome(chromePath, [
        "--headless=new",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--force-device-scale-factor=1",
        "--hide-scrollbars",
        "--incognito",
        "--no-default-browser-check",
        "--no-first-run",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=6000",
        `--window-size=${expectedWidth},${expectedHeight}`,
        `--screenshot=${temporaryOutputPath}`,
        homeUrl,
    ])

    const generatedFile = await stat(temporaryOutputPath)
    const png = await readFile(temporaryOutputPath)
    const width = png.readUInt32BE(16)
    const height = png.readUInt32BE(20)

    if (generatedFile.size < 50_000 || width !== expectedWidth || height !== expectedHeight) {
        throw new Error(
            `공유 이미지가 올바르지 않습니다: ${width}x${height}, ${generatedFile.size} bytes`,
        )
    }

    await rename(temporaryOutputPath, outputPath)
    const fingerprint = await createOgCoverFingerprint()
    await writeFile(ogCoverFingerprintPath, `${fingerprint}\n`)
    process.stdout.write(
        `공유 이미지 생성 완료: ${outputPath} (${width}x${height}, ${generatedFile.size} bytes)\n`,
    )
} finally {
    await server.close()
    await rm(temporaryOutputPath, { force: true })
}
