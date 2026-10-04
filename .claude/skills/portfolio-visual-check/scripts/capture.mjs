#!/usr/bin/env node
// 포트폴리오 경로를 여러 화면 너비로 열어 캡처하고 가로 넘침, 깨진 이미지, 브라우저 오류,
// 도식 글자 넘침과 글자 대비를 한 번에 검사한다.

import { existsSync, readdirSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { parseArgs } from "node:util"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDir, "../../../..")

const usage = `사용법: node .claude/skills/portfolio-visual-check/scripts/capture.mjs [옵션]

  --base <url>          대상 주소 (기본 http://127.0.0.1:5173)
  --routes <a,b>        검사할 경로 (기본 /)
  --all                 src/data/routeMeta.js의 전체 경로
  --widths <w,w>        화면 너비 (기본 1440,390)
  --label <이름>        출력 폴더 이름 (기본 visual)
  --out <폴더>          출력 위치 (기본 output/playwright/<label>-<날짜>)
  --full                전체 페이지 캡처 (기본은 첫 화면)
  --selector <css>      일치하는 요소만 캡처 (도식, 갤러리 등)
  --expand              <details>를 모두 펼친 뒤 검사
  --text                화면 문구, 이미지 설명과 도식 문구를 저장
  --contrast <css>      범위 안 글자의 WCAG 대비 검사 (예: .editorial-diagram)
  --ignore-console <정규식>  무시할 콘솔 오류
  --wait <ms>           렌더링 후 추가 대기 (기본 300)
  --scale <n>           deviceScaleFactor (기본 1)
  --no-shot             캡처 없이 검사만 실행
`

const { values: options } = parseArgs({
    options: {
        base: { type: "string", default: "http://127.0.0.1:5173" },
        routes: { type: "string" },
        all: { type: "boolean", default: false },
        widths: { type: "string", default: "1440,390" },
        label: { type: "string", default: "visual" },
        out: { type: "string" },
        full: { type: "boolean", default: false },
        selector: { type: "string" },
        expand: { type: "boolean", default: false },
        text: { type: "boolean", default: false },
        contrast: { type: "string" },
        "ignore-console": { type: "string" },
        wait: { type: "string", default: "300" },
        scale: { type: "string", default: "1" },
        "no-shot": { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
    },
})

if (options.help) {
    process.stdout.write(usage)
    process.exit(0)
}

const today = new Date().toLocaleDateString("sv-SE")
const outputDir = path.resolve(
    repositoryRoot,
    options.out ?? path.join("output/playwright", `${options.label}-${today}`),
)
const widths = options.widths.split(",").map((value) => Number.parseInt(value, 10))
const ignoreConsole = options["ignore-console"] ? new RegExp(options["ignore-console"]) : null

const loadKnownRoutes = async () => {
    const routeMetaUrl = pathToFileURL(path.join(repositoryRoot, "src/data/routeMeta.js"))
    const { routeMeta } = await import(routeMetaUrl.href)
    return Object.keys(routeMeta)
}

// 프로젝트 의존성에 Playwright가 없으므로 이미 설치된 사본을 순서대로 찾는다.
const loadPlaywright = async () => {
    const npxCache = path.join(os.homedir(), ".npm/_npx")
    const npxCandidates = existsSync(npxCache)
        ? readdirSync(npxCache).map((entry) =>
              path.join(npxCache, entry, "node_modules/playwright/index.mjs"),
          )
        : []
    const candidates = [
        process.env.PLAYWRIGHT_MODULE,
        "playwright",
        path.join(
            os.homedir(),
            ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs",
        ),
        ...npxCandidates,
    ].filter(Boolean)

    for (const candidate of candidates) {
        const specifier = candidate.startsWith("/") ? pathToFileURL(candidate).href : candidate
        if (candidate.startsWith("/") && !existsSync(candidate)) {
            continue
        }
        try {
            return await import(specifier)
        } catch {
            // 다음 후보를 확인한다.
        }
    }
    throw new Error(
        "Playwright를 찾지 못했습니다. PLAYWRIGHT_MODULE에 playwright/index.mjs 경로를 지정하거나 " +
            "`npx -y playwright@latest --version`으로 npx 캐시를 준비하세요.",
    )
}

const launchBrowser = async (chromium) => {
    const attempts = [
        process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : null,
        { channel: "chrome" },
        {},
    ].filter(Boolean)
    let lastError
    for (const attempt of attempts) {
        try {
            return await chromium.launch({ headless: true, ...attempt })
        } catch (error) {
            lastError = error
        }
    }
    throw lastError
}

const slugify = (route) =>
    route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/[^\w가-힣-]+/g, "_")

// 지연 로딩 이미지를 불러오도록 끝까지 스크롤한 뒤 처음 위치로 돌아온다.
const scrollThrough = async (page) => {
    await page.evaluate(async () => {
        const step = Math.max(400, Math.floor(window.innerHeight * 0.8))
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y)
            await new Promise((resolve) => setTimeout(resolve, 60))
        }
        window.scrollTo(0, 0)
    })
}

const inspectPage = (contrastSelector) => {
    const viewportWidth = window.innerWidth
    const describe = (element) => {
        const id = element.id ? `#${element.id}` : ""
        const className =
            typeof element.className === "string" && element.className.trim()
                ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}`
                : ""
        return `${element.tagName.toLowerCase()}${id}${className}`
    }
    const isInsideHorizontalScroller = (element) => {
        for (let node = element.parentElement; node; node = node.parentElement) {
            const { overflowX } = getComputedStyle(node)
            if (["auto", "scroll", "hidden", "clip"].includes(overflowX)) {
                return node !== document.documentElement && node !== document.body
            }
        }
        return false
    }

    const documentOverflow = document.documentElement.scrollWidth - viewportWidth
    const overflowElements =
        documentOverflow > 1
            ? [...document.body.querySelectorAll("*")]
                  .filter((element) => {
                      const rect = element.getBoundingClientRect()
                      return (
                          rect.width > 0 &&
                          rect.right > viewportWidth + 1 &&
                          !isInsideHorizontalScroller(element)
                      )
                  })
                  .slice(0, 8)
                  .map((element) => ({
                      element: describe(element),
                      right: Math.round(element.getBoundingClientRect().right),
                  }))
            : []

    const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.getAttribute("src"))

    // 도식의 노드, 영역 라벨과 연결선 라벨은 사각형과 글자를 같은 그룹에 둔다.
    // 글자와 겹치는 사각형 중 하나도 글자를 모두 감싸지 못하면 넘침으로 본다.
    // 범례처럼 사각형 옆에 놓인 글자는 겹치는 사각형이 없으므로 제외한다.
    const overflowAmount = (box, textBox) =>
        Math.max(
            box.x - textBox.x,
            textBox.x + textBox.width - (box.x + box.width),
            box.y - textBox.y,
            textBox.y + textBox.height - (box.y + box.height),
        )
    const overlaps = (box, textBox) =>
        box.x < textBox.x + textBox.width &&
        textBox.x < box.x + box.width &&
        box.y < textBox.y + textBox.height &&
        textBox.y < box.y + box.height
    // 테두리가 있는 노드 상자 밖으로 나간 글자는 실패로, 테두리 없는 라벨 마스크는 경고로 나눈다.
    const hasVisibleStroke = (rect) => {
        const style = getComputedStyle(rect)
        return style.stroke !== "none" && Number.parseFloat(style.strokeWidth) > 0
    }
    const svgTextOverflow = []
    const svgLabelWarnings = []
    for (const text of document.querySelectorAll("svg text")) {
        const textBox = text.getBBox()
        if (!textBox.width || !text.parentElement) {
            continue
        }
        const candidates = [...text.parentElement.children]
            .filter((child) => child.tagName === "rect")
            .map((rect) => ({ rect, box: rect.getBBox() }))
            .filter(({ box }) => overlaps(box, textBox))
            .map(({ rect, box }) => ({ rect, overflow: overflowAmount(box, textBox) }))
            .sort((a, b) => a.overflow - b.overflow)
        const best = candidates[0]
        if (!best || best.overflow <= 1) {
            continue
        }
        const finding = {
            text: text.textContent.trim().slice(0, 40),
            overflow: Math.round(best.overflow),
        }
        if (candidates.some(({ rect }) => hasVisibleStroke(rect))) {
            svgTextOverflow.push(finding)
        } else {
            svgLabelWarnings.push(finding)
        }
    }

    const notFound = Boolean(document.querySelector("main.not-found"))

    const parseColor = (value) => {
        const match = value?.match(/rgba?\(([^)]+)\)/)
        if (!match) {
            return null
        }
        const parts = match[1]
            .split(/[\s,/]+/)
            .filter(Boolean)
            .map(Number)
        return [parts[0], parts[1], parts[2], parts[3] ?? 1]
    }
    const blend = (top, bottom) => {
        const alpha = top[3]
        return [0, 1, 2].map((i) => top[i] * alpha + bottom[i] * (1 - alpha)).concat(1)
    }
    const luminance = (color) => {
        const [r, g, b] = color.slice(0, 3).map((channel) => {
            const value = channel / 255
            return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const htmlBackground = (start) => {
        const layers = []
        let uncertain = false
        for (let node = start; node; node = node.parentElement) {
            const style = getComputedStyle(node)
            if (style.backgroundImage !== "none") {
                uncertain = true
            }
            const color = parseColor(style.backgroundColor)
            if (color && color[3] > 0) {
                layers.push(color)
                if (color[3] >= 1) {
                    break
                }
            }
        }
        let result = [255, 255, 255, 1]
        for (const layer of layers.reverse()) {
            result = blend(layer, result)
        }
        return { color: result, uncertain }
    }
    const svgBackground = (text) => {
        const textBox = text.getBBox()
        for (
            let node = text.parentElement;
            node && node.tagName !== "svg";
            node = node.parentElement
        ) {
            const rects = [...node.children].filter((child) => child.tagName === "rect")
            for (const rect of rects.reverse()) {
                const box = rect.getBBox()
                const inside =
                    textBox.x >= box.x - 1 &&
                    textBox.y >= box.y - 1 &&
                    textBox.x + textBox.width <= box.x + box.width + 1 &&
                    textBox.y + textBox.height <= box.y + box.height + 1
                const fill = parseColor(getComputedStyle(rect).fill)
                if (inside && fill && fill[3] > 0) {
                    const below = htmlBackground(text.closest("svg").parentElement)
                    return { color: blend(fill, below.color), uncertain: below.uncertain }
                }
            }
        }
        return htmlBackground(text.closest("svg").parentElement)
    }

    const contrastFailures = []
    if (contrastSelector) {
        const scopes = document.querySelectorAll(contrastSelector)
        const seen = new Set()
        for (const scope of scopes) {
            for (const element of scope.querySelectorAll("*")) {
                if (seen.has(element)) {
                    continue
                }
                seen.add(element)
                const isSvgText = element.tagName === "text"
                const ownText = isSvgText
                    ? element.textContent.trim()
                    : [...element.childNodes]
                          .filter((node) => node.nodeType === Node.TEXT_NODE)
                          .map((node) => node.textContent.trim())
                          .join(" ")
                if (!ownText || !element.getClientRects().length) {
                    continue
                }
                const style = getComputedStyle(element)
                if (style.visibility === "hidden" || Number(style.opacity) === 0) {
                    continue
                }
                const foreground = parseColor(isSvgText ? style.fill : style.color)
                if (!foreground) {
                    continue
                }
                const background = isSvgText ? svgBackground(element) : htmlBackground(element)
                const color = blend(foreground, background.color)
                const [light, dark] = [luminance(color), luminance(background.color)].sort(
                    (a, b) => b - a,
                )
                const ratio = (light + 0.05) / (dark + 0.05)
                const scale = isSvgText ? element.getScreenCTM()?.a ?? 1 : 1
                const fontSize = Number.parseFloat(style.fontSize) * scale
                const bold = Number.parseInt(style.fontWeight, 10) >= 700
                const required = fontSize >= 24 || (bold && fontSize >= 18.66) ? 3 : 4.5
                if (ratio < required) {
                    contrastFailures.push({
                        text: ownText.slice(0, 40),
                        ratio: Math.round(ratio * 100) / 100,
                        required,
                        fontSize: Math.round(fontSize * 10) / 10,
                        uncertain: background.uncertain,
                    })
                }
            }
        }
    }

    return {
        documentOverflow: Math.max(0, Math.round(documentOverflow)),
        overflowElements,
        brokenImages,
        svgTextOverflow: svgTextOverflow.slice(0, 20),
        svgLabelWarnings: svgLabelWarnings.slice(0, 20),
        contrastFailures: contrastFailures.slice(0, 20),
        notFound,
    }
}

const collectText = () => {
    const lines = document.body.innerText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    const labels = [...document.querySelectorAll("img[alt], [aria-label]")]
        .map((element) => element.getAttribute("alt") ?? element.getAttribute("aria-label"))
        .filter(Boolean)
        .map((value) => `[설명] ${value.trim()}`)
    const svgTexts = [...document.querySelectorAll("svg text, svg title, svg desc")]
        .map((element) =>
            [...element.querySelectorAll("tspan")].length
                ? [...element.querySelectorAll("tspan")].map((span) => span.textContent).join(" ")
                : element.textContent,
        )
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => `[도식] ${value}`)
    return [...lines, ...labels, ...svgTexts]
}

const main = async () => {
    const knownRoutes = await loadKnownRoutes()
    const routes = options.all
        ? knownRoutes
        : (options.routes ?? "/").split(",").map((route) => route.trim())
    const { chromium } = await loadPlaywright()
    const browser = await launchBrowser(chromium)
    await mkdir(outputDir, { recursive: true })
    if (options.text) {
        await mkdir(path.join(outputDir, "text"), { recursive: true })
    }

    const results = []
    const uniqueLines = new Map()
    try {
        for (const width of widths) {
            const context = await browser.newContext({
                viewport: { width, height: width <= 480 ? 844 : 900 },
                deviceScaleFactor: Number(options.scale),
                locale: "ko-KR",
            })
            const page = await context.newPage()
            let messages = []
            page.on("pageerror", (error) =>
                messages.push({ type: "pageerror", text: error.message }),
            )
            page.on("console", (message) => {
                if (message.type() === "error") {
                    messages.push({ type: "console", text: message.text() })
                }
            })
            page.on("requestfailed", (request) =>
                messages.push({ type: "requestfailed", text: request.url() }),
            )
            page.on("response", (response) => {
                if (response.status() >= 400 && response.url().startsWith(options.base)) {
                    messages.push({
                        type: "http",
                        text: `${response.status()} ${response.url()}`,
                    })
                }
            })

            for (const route of routes) {
                messages = []
                const url = new URL(route, options.base).href
                await page.goto(url, { waitUntil: "load", timeout: 30_000 })
                await page.evaluate(() => document.fonts.ready)
                if (options.expand) {
                    await page.evaluate(() =>
                        document.querySelectorAll("details").forEach((element) => {
                            element.open = true
                        }),
                    )
                }
                await scrollThrough(page)
                await page.waitForTimeout(Number(options.wait))

                const inspection = await page.evaluate(inspectPage, options.contrast ?? null)
                const errors = messages.filter(
                    (message) => !ignoreConsole || !ignoreConsole.test(message.text),
                )
                const name = `${slugify(route)}-${width}`
                const shots = []

                if (!options["no-shot"]) {
                    if (options.selector) {
                        const targets = page.locator(options.selector)
                        const count = await targets.count()
                        for (let index = 0; index < count; index += 1) {
                            const target = targets.nth(index)
                            if (!(await target.isVisible())) {
                                continue
                            }
                            await target.scrollIntoViewIfNeeded()
                            const file = path.join(outputDir, `${name}-${index + 1}.png`)
                            await target.screenshot({ path: file })
                            shots.push(path.relative(repositoryRoot, file))
                        }
                    } else {
                        const file = path.join(outputDir, `${name}.png`)
                        await page.screenshot({ path: file, fullPage: options.full })
                        shots.push(path.relative(repositoryRoot, file))
                    }
                }

                if (options.text) {
                    const lines = await page.evaluate(collectText)
                    await writeFile(
                        path.join(outputDir, "text", `${name}.txt`),
                        `${lines.join("\n")}\n`,
                    )
                    for (const line of lines) {
                        if (!uniqueLines.has(line)) {
                            uniqueLines.set(line, `${route} @${width}`)
                        }
                    }
                }

                const failed =
                    inspection.documentOverflow > 1 ||
                    inspection.brokenImages.length > 0 ||
                    inspection.svgTextOverflow.length > 0 ||
                    inspection.contrastFailures.length > 0 ||
                    (inspection.notFound && knownRoutes.includes(route)) ||
                    errors.length > 0
                results.push({ route, width, failed, ...inspection, errors, shots })
                const warning = inspection.svgLabelWarnings.length
                    ? ` (라벨 마스크 밖 글자 ${inspection.svgLabelWarnings.length}개, 캡처로 확인)`
                    : ""
                process.stdout.write(`${failed ? "실패" : "통과"} ${route} @${width}${warning}\n`)
            }
            await context.close()
        }
    } finally {
        await browser.close()
    }

    if (options.text) {
        const unique = [...uniqueLines].map(([line, source]) => `${line}\t${source}`)
        await writeFile(path.join(outputDir, "text", "unique-lines.tsv"), `${unique.join("\n")}\n`)
    }

    const failures = results.filter((result) => result.failed)
    const report = {
        base: options.base,
        createdAt: new Date().toISOString(),
        options: {
            widths,
            routes,
            expand: options.expand,
            full: options.full,
            selector: options.selector ?? null,
            contrast: options.contrast ?? null,
        },
        summary: { pages: results.length, failures: failures.length },
        results,
    }
    await writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`)

    process.stdout.write(
        `\n검사 ${results.length}건, 실패 ${failures.length}건\n결과: ${path.relative(repositoryRoot, outputDir)}/report.json\n`,
    )
    for (const failure of failures) {
        const reasons = [
            failure.documentOverflow > 1 && `가로 넘침 ${failure.documentOverflow}px`,
            failure.brokenImages.length && `깨진 이미지 ${failure.brokenImages.length}개`,
            failure.svgTextOverflow.length && `도식 글자 넘침 ${failure.svgTextOverflow.length}개`,
            failure.contrastFailures.length && `대비 부족 ${failure.contrastFailures.length}개`,
            failure.notFound && "404 화면",
            failure.errors.length && `브라우저 오류 ${failure.errors.length}개`,
        ].filter(Boolean)
        process.stdout.write(`- ${failure.route} @${failure.width}: ${reasons.join(", ")}\n`)
    }
    process.exitCode = failures.length ? 1 : 0
}

main().catch((error) => {
    process.stderr.write(`${error.stack ?? error}\n`)
    process.exitCode = 2
})
