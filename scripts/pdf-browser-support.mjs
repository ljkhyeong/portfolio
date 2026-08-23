import path from "node:path"

const supportedBrowsers = new Set(["chrome", "edge", "webkit"])

export const readCliOption = (args, name) => {
    const optionName = `--${name}`

    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index]

        if (argument.startsWith(`${optionName}=`)) {
            const value = argument.slice(optionName.length + 1).trim()

            if (!value) {
                throw new Error(`${optionName} 값이 비어 있습니다.`)
            }

            return value
        }

        if (argument === optionName) {
            const value = args[index + 1]?.trim()

            if (!value || value.startsWith("--")) {
                throw new Error(`${optionName} 값을 입력해 주세요.`)
            }

            return value
        }
    }

    return undefined
}

export const resolvePdfBrowser = (args, environment = process.env) => {
    const requestedBrowser = (
        readCliOption(args, "browser") ??
        environment.PDF_BROWSER ??
        "chrome"
    ).toLowerCase()
    const browser = requestedBrowser === "safari" ? "webkit" : requestedBrowser

    if (!supportedBrowsers.has(browser)) {
        throw new Error(
            `지원하지 않는 PDF 브라우저입니다: ${requestedBrowser}. chrome, edge, webkit 중 하나를 사용해 주세요.`,
        )
    }

    return browser
}

const compactCandidates = (candidates) => [...new Set(candidates.filter(Boolean))]

const windowsApplicationPath = (basePath, ...segments) =>
    basePath ? path.win32.join(basePath, ...segments) : undefined

export const getPdfBrowserCandidates = (
    browser,
    environment = process.env,
    platform = process.platform,
) => {
    if (browser === "webkit") {
        return []
    }

    const explicitPath = environment.PDF_BROWSER_PATH

    if (browser === "edge") {
        const commonCandidates = [explicitPath, environment.EDGE_PATH]

        if (platform === "darwin") {
            return compactCandidates([
                ...commonCandidates,
                "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
                "/Applications/Microsoft Edge Beta.app/Contents/MacOS/Microsoft Edge Beta",
                "/Applications/Microsoft Edge Dev.app/Contents/MacOS/Microsoft Edge Dev",
                "/Applications/Microsoft Edge Canary.app/Contents/MacOS/Microsoft Edge Canary",
            ])
        }

        if (platform === "win32") {
            return compactCandidates([
                ...commonCandidates,
                windowsApplicationPath(
                    environment["PROGRAMFILES(X86)"],
                    "Microsoft",
                    "Edge",
                    "Application",
                    "msedge.exe",
                ),
                windowsApplicationPath(
                    environment.PROGRAMFILES,
                    "Microsoft",
                    "Edge",
                    "Application",
                    "msedge.exe",
                ),
                windowsApplicationPath(
                    environment.LOCALAPPDATA,
                    "Microsoft",
                    "Edge",
                    "Application",
                    "msedge.exe",
                ),
            ])
        }

        return compactCandidates([
            ...commonCandidates,
            "/usr/bin/microsoft-edge",
            "/usr/bin/microsoft-edge-stable",
            "/usr/bin/microsoft-edge-beta",
            "/usr/bin/microsoft-edge-dev",
        ])
    }

    const commonCandidates = [explicitPath, environment.CHROME_PATH]

    if (platform === "darwin") {
        return compactCandidates([
            ...commonCandidates,
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ])
    }

    if (platform === "win32") {
        return compactCandidates([
            ...commonCandidates,
            windowsApplicationPath(
                environment.PROGRAMFILES,
                "Google",
                "Chrome",
                "Application",
                "chrome.exe",
            ),
            windowsApplicationPath(
                environment["PROGRAMFILES(X86)"],
                "Google",
                "Chrome",
                "Application",
                "chrome.exe",
            ),
            windowsApplicationPath(
                environment.LOCALAPPDATA,
                "Google",
                "Chrome",
                "Application",
                "chrome.exe",
            ),
        ])
    }

    return compactCandidates([
        ...commonCandidates,
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
    ])
}

export const getPdfBrowserLabel = (browser) => {
    if (browser === "edge") {
        return "Microsoft Edge"
    }

    if (browser === "webkit") {
        return "Safari WebKit"
    }

    return "Chrome 또는 Chromium"
}
