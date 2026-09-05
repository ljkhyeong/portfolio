import { spawn } from "node:child_process"
import { access, mkdir, mkdtemp, readFile, rename, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import {
    createArtifactManifest,
    isArtifactCurrent,
    writeArtifactManifest,
} from "./artifact-manifest.mjs"
import { validatePngArtifact } from "./artifact-validation.mjs"
import {
    createOgCoverFingerprint,
    createProjectOgFingerprint,
    ogCoverManifestPath,
    projectOgManifestPath,
} from "./og-cover-fingerprint.mjs"
import { projectOgCards } from "../src/data/projectOg.js"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
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

const readChromeVersion = (chromePath) =>
    new Promise((resolve, reject) => {
        const child = spawn(chromePath, ["--version"], {
            cwd: repositoryRoot,
            stdio: ["ignore", "pipe", "pipe"],
        })
        let output = ""

        child.stdout.setEncoding("utf8")
        child.stderr.setEncoding("utf8")
        child.stdout.on("data", (chunk) => {
            output += chunk
        })
        child.stderr.on("data", (chunk) => {
            output += chunk
        })
        child.on("error", reject)
        child.on("exit", (code) => {
            const version = output.trim()

            if (code === 0 && version) {
                resolve(version)
                return
            }

            reject(new Error("Chrome 또는 Chromium 버전을 확인하지 못했습니다."))
        })
    })

const force = process.argv.includes("--force")
const projectFingerprint = await createProjectOgFingerprint()
const targets = [
    {
        id: "cover",
        image: "/og-cover.png",
        manifestPath: ogCoverManifestPath,
        fingerprint: await createOgCoverFingerprint(),
    },
    ...projectOgCards.map((card) => ({
        ...card,
        manifestPath: projectOgManifestPath(card.id),
        fingerprint: projectFingerprint,
    })),
]
const pendingTargets = []

for (const target of targets) {
    const current =
        !force &&
        (await isArtifactCurrent({
            artifactPath: path.join(repositoryRoot, "public", target.image),
            manifestPath: target.manifestPath,
            sourceSha256: target.fingerprint,
            expectedRendererId: "chrome",
            validateArtifact: (artifact) =>
                validatePngArtifact(artifact, {
                    expectedHeight,
                    expectedWidth,
                }),
        }))
    if (!current) pendingTargets.push(target)
}

process.stdout.write(
    `공유 이미지: ${targets.length - pendingTargets.length}개 최신, ${pendingTargets.length}개 생성 필요\n`,
)

if (pendingTargets.length > 0) {
    const server = await createServer({
        root: repositoryRoot,
        logLevel: "error",
        server: {
            host: "127.0.0.1",
            port: 0,
            strictPort: false,
        },
    })

    let captureDirectory

    try {
        await server.listen()
        const address = server.httpServer.address()
        const port = typeof address === "object" && address ? address.port : 5173
        const homeUrl = `http://127.0.0.1:${port}/`
        const chromePath = await findChrome()
        const chromeVersion = await readChromeVersion(chromePath)
        captureDirectory = await mkdtemp(path.join(os.tmpdir(), "portfolio-og-"))
        await mkdir(path.join(repositoryRoot, "public", "og"), { recursive: true })
        await mkdir(path.join(repositoryRoot, "scripts", "og-manifests"), { recursive: true })
        for (const target of pendingTargets) {
            const outputPath = path.join(repositoryRoot, "public", target.image)
            const temporaryOutputPath = path.join(captureDirectory, `${target.id}.png`)
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
                `--user-data-dir=${path.join(captureDirectory, "chrome-profile")}`,
                `--window-size=${expectedWidth},${expectedHeight}`,
                `--screenshot=${temporaryOutputPath}`,
                target.id === "cover" ? homeUrl : `${homeUrl}og-preview.html?project=${target.id}`,
            ])

            const png = await readFile(temporaryOutputPath)
            const { height, size, width } = validatePngArtifact(png, {
                expectedHeight,
                expectedWidth,
            })

            await rename(temporaryOutputPath, outputPath)
            const manifest = createArtifactManifest({
                artifact: png,
                artifactPath: outputPath,
                renderer: {
                    id: "chrome",
                    name: "Chrome 또는 Chromium",
                    version: chromeVersion,
                    platform: process.platform,
                    architecture: process.arch,
                },
                sourceSha256: target.fingerprint,
            })
            await writeArtifactManifest(target.manifestPath, manifest)
            process.stdout.write(
                `공유 이미지 생성 완료: ${outputPath} (${width}x${height}, ${size} bytes)\n`,
            )
        }
    } finally {
        await server.close()
        if (captureDirectory) await rm(captureDirectory, { recursive: true, force: true })
    }
}
