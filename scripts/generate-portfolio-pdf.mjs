import { spawn } from "node:child_process"
import { access, mkdir, readFile, rename, rm, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import { createArtifactManifest, writeArtifactManifest } from "./artifact-manifest.mjs"
import { validatePdfArtifact } from "./artifact-validation.mjs"
import {
    assertCanonicalPdfRenderer,
    getPdfBrowserCandidates,
    getPdfBrowserLabel,
    readCliOption,
    resolvePdfBrowser,
} from "./pdf-browser-support.mjs"
import {
    createPortfolioPdfFingerprint,
    portfolioPdfManifestPath,
} from "./portfolio-pdf-fingerprint.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const canonicalOutputPath = path.join(repositoryRoot, "public", "임정규_포트폴리오.pdf")
const argumentsWithoutRuntime = process.argv.slice(2)
const selectedBrowser = resolvePdfBrowser(argumentsWithoutRuntime)
const requestedOutputPath = readCliOption(argumentsWithoutRuntime, "output")
const outputPath = requestedOutputPath
    ? path.resolve(repositoryRoot, requestedOutputPath)
    : canonicalOutputPath
const temporaryOutputPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.tmp`)
const outputManifestPath =
    outputPath === canonicalOutputPath ? portfolioPdfManifestPath : `${outputPath}.manifest.json`
const webKitScriptPath = path.join(repositoryRoot, "scripts", "generate-portfolio-pdf-webkit.swift")

assertCanonicalPdfRenderer({
    browser: selectedBrowser,
    canonicalOutputPath,
    outputPath,
})

const runProcess = (
    command,
    args,
    {
        capture = false,
        label = command,
        timeoutMs,
        monitoredFile,
        maximumFileSize = 30_000_000,
    } = {},
) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: repositoryRoot,
            stdio: capture ? ["ignore", "pipe", "pipe"] : ["ignore", "inherit", "inherit"],
        })
        let stdout = ""
        let stderr = ""
        let settled = false
        let sizeCheckRunning = false

        const finish = (callback) => {
            if (settled) {
                return
            }

            settled = true
            clearTimeout(timeoutId)
            clearInterval(fileMonitorId)
            callback()
        }

        const stopWithError = (message) => {
            child.kill("SIGKILL")
            finish(() => reject(new Error(message)))
        }

        const timeoutId = timeoutMs
            ? setTimeout(() => {
                  stopWithError(`${label} 실행 시간이 ${timeoutMs / 1000}초를 초과했습니다.`)
              }, timeoutMs)
            : undefined
        const fileMonitorId = monitoredFile
            ? setInterval(async () => {
                  if (sizeCheckRunning || settled) {
                      return
                  }

                  sizeCheckRunning = true

                  try {
                      const file = await stat(monitoredFile)

                      if (file.size > maximumFileSize) {
                          stopWithError(
                              `${label}가 비정상적으로 큰 임시 파일을 생성해 중단했습니다: ${file.size} bytes`,
                          )
                      }
                  } catch (error) {
                      if (error.code !== "ENOENT") {
                          stopWithError(`${label} 임시 파일 확인에 실패했습니다: ${error.message}`)
                      }
                  } finally {
                      sizeCheckRunning = false
                  }
              }, 250)
            : undefined

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

        child.on("error", (error) => {
            finish(() => reject(new Error(`${label} 실행에 실패했습니다: ${error.message}`)))
        })
        child.on("exit", (code) => {
            if (code === 0) {
                finish(() => resolve({ stdout, stderr }))
                return
            }

            finish(() =>
                reject(
                    new Error(
                        `${label} 실행이 종료 코드 ${code}로 실패했습니다.${stderr ? `\n${stderr}` : ""}`,
                    ),
                ),
            )
        })
    })

const findBrowserExecutable = async (browser) => {
    const candidates = getPdfBrowserCandidates(browser)

    for (const candidate of candidates) {
        try {
            await access(candidate)
            return candidate
        } catch {
            // 다음 실행 파일을 확인합니다.
        }
    }

    const browserLabel = getPdfBrowserLabel(browser)
    const environmentName = browser === "edge" ? "EDGE_PATH" : "CHROME_PATH"

    throw new Error(
        `${browserLabel} 실행 파일을 찾지 못했습니다. PDF_BROWSER_PATH 또는 ${environmentName}를 지정해 주세요.`,
    )
}

const validateRenderedHtml = (renderedHtml) => {
    const ready = /data-print-ready="true"/.test(renderedHtml)
    const overflowMatch = renderedHtml.match(/data-print-overflow-count="(\d+)"/)
    const overflowCount = Number(overflowMatch?.[1] ?? -1)
    const overflowPages =
        renderedHtml.match(/data-print-overflow-pages="([^"]*)"/)?.[1] || "확인 불가"

    if (!ready) {
        throw new Error("인쇄 화면의 이미지와 폰트가 준비되기 전에 검증이 종료됐습니다.")
    }

    if (overflowCount !== 0) {
        throw new Error(`인쇄 원본에서 가로 영역을 벗어난 요소가 있습니다: ${overflowPages}`)
    }
}

const generateWithChromiumBrowser = async (browser, printUrl) => {
    const browserPath = await findBrowserExecutable(browser)
    const browserLabel = getPdfBrowserLabel(browser)
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

    process.stdout.write(`PDF 생성 브라우저: ${browserLabel}\n`)

    const versionResult = await runProcess(browserPath, ["--version"], {
        capture: true,
        label: `${browserLabel} 버전 확인`,
    })
    const version = (versionResult.stdout || versionResult.stderr).trim()

    if (!version) {
        throw new Error(`${browserLabel} 버전을 확인하지 못했습니다.`)
    }

    const { stdout: renderedHtml } = await runProcess(
        browserPath,
        [...commonArgs, "--dump-dom", printUrl],
        { capture: true, label: browserLabel },
    )

    validateRenderedHtml(renderedHtml)

    await runProcess(
        browserPath,
        [
            ...commonArgs,
            "--no-pdf-header-footer",
            "--generate-pdf-document-outline",
            `--print-to-pdf=${temporaryOutputPath}`,
            printUrl,
        ],
        { label: browserLabel },
    )

    return {
        id: browser,
        name: browserLabel,
        version,
        platform: process.platform,
        architecture: process.arch,
    }
}

const generateWithWebKit = async (printUrl) => {
    if (process.platform !== "darwin") {
        throw new Error("Safari WebKit PDF 생성은 macOS에서만 사용할 수 있습니다.")
    }

    process.stdout.write("PDF 생성 브라우저: Safari WebKit\n")
    const { stdout } = await runProcess(
        "xcrun",
        ["swift", "-swift-version", "5", webKitScriptPath, printUrl, temporaryOutputPath],
        {
            capture: true,
            label: "Safari WebKit PDF 생성기",
            timeoutMs: 45_000,
            monitoredFile: temporaryOutputPath,
        },
    )
    const version = stdout.match(/^PDF_RENDERER_USER_AGENT=(.+)$/m)?.[1]?.trim()

    if (!version) {
        throw new Error("Safari WebKit 렌더러 버전을 확인하지 못했습니다.")
    }

    return {
        id: "webkit",
        name: "Safari WebKit",
        version,
        platform: process.platform,
        architecture: process.arch,
    }
}

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

    await mkdir(path.dirname(outputPath), { recursive: true })
    await rm(temporaryOutputPath, { force: true })

    const renderer =
        selectedBrowser === "webkit"
            ? await generateWithWebKit(printUrl)
            : await generateWithChromiumBrowser(selectedBrowser, printUrl)
    const pdf = await readFile(temporaryOutputPath)
    const { size } = validatePdfArtifact(pdf)

    await rename(temporaryOutputPath, outputPath)
    const sourceSha256 = await createPortfolioPdfFingerprint()
    const manifest = createArtifactManifest({
        artifact: pdf,
        artifactPath: outputPath,
        renderer,
        sourceSha256,
    })
    await writeArtifactManifest(outputManifestPath, manifest)

    process.stdout.write(
        `PDF 생성 완료: ${outputPath} (${size} bytes, ${getPdfBrowserLabel(selectedBrowser)})\n`,
    )
} finally {
    await server.close()
    await rm(temporaryOutputPath, { force: true })
}
