#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const prettierPattern = /\.(?:cjs|css|html|js|jsx|json|md|mjs|scss|ts|tsx|yaml|yml)$/
const textFilePattern =
    /(?:^|\/)(?:Dockerfile|gradlew)$|\.(?:cjs|css|gradle|html|java|js|jsx|json|md|mjs|properties|scss|sh|toml|ts|tsx|txt|xml|yaml|yml)$/
const javaChangePattern =
    /^knowledge-api\/(?:src\/.*\.java$|(?:build|settings)\.gradle$|gradle\.properties$|gradle\/|gradlew(?:\.bat)?$)/
const frontendChangePattern = /^(?:src|scripts)\/.*\.(?:js|jsx|mjs)$/
const frontendTestChangePattern =
    /^(?:src|scripts)\/.*\.(?:js|jsx|mjs)$|^(?:package(?:-lock)?\.json|vite\.config\.js)$/
const buildChangePattern =
    /^(?:src|public|scripts)\/|^(?:index\.html|package(?:-lock)?\.json|vite\.config\.js|netlify\.toml)$|^docs\/knowledge-document-snapshots\.json$/
const companionTestExtensions = [".test.js", ".test.jsx", ".test.mjs", ".test.ts", ".test.tsx"]

const unique = (values) => [...new Set(values)].sort()

const run = (command, args, options = {}) => {
    process.stdout.write(`\n> ${command} ${args.join(" ")}\n`)
    const result = spawnSync(command, args, {
        cwd: options.cwd ?? repositoryRoot,
        encoding: "utf8",
        stdio: "inherit",
    })

    if (result.error) {
        throw result.error
    }
    if (result.status !== 0) {
        throw new Error(`${command} 실행 실패 (${result.status ?? "unknown"})`)
    }
}

const readGitLines = (args) => {
    const result = spawnSync("git", ["-c", "core.quotepath=false", ...args], {
        cwd: repositoryRoot,
        encoding: "utf8",
    })

    if (result.error) {
        throw result.error
    }
    if (result.status !== 0) {
        throw new Error(result.stderr.trim() || "Git 변경 파일을 읽지 못했습니다.")
    }

    return result.stdout.split("\n").filter(Boolean)
}

export const normalizeRequestedFiles = (files) =>
    unique(
        files.map((file) => {
            const absolutePath = path.resolve(repositoryRoot, file)
            const relativePath = path.relative(repositoryRoot, absolutePath)
            if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
                throw new Error(`저장소 밖의 파일은 검사할 수 없습니다: ${file}`)
            }
            return relativePath.split(path.sep).join("/")
        }),
    )

export const classifyChanges = (files) => ({
    buildRequired: files.some((file) => buildChangePattern.test(file)),
    frontendTestsRequired: files.some((file) => frontendTestChangePattern.test(file)),
    javaTestsRequired: files.some((file) => javaChangePattern.test(file)),
    prettierFiles: files.filter(
        (file) => prettierPattern.test(file) && existsSync(path.join(repositoryRoot, file)),
    ),
})

export const findTextIssues = (file, content) => {
    const issues = []
    const lines = content.split("\n")

    lines.forEach((line, index) => {
        if (/[\t ]+$/.test(line)) {
            issues.push(`${file}:${index + 1} 줄 끝 공백`)
        }
    })
    if (content.length > 0 && !content.endsWith("\n")) {
        issues.push(`${file}: 파일 끝 개행 없음`)
    }

    return issues
}

export const findCompanionTests = (files, fileExists = existsSync) => {
    const tests = []

    for (const file of files) {
        if (!frontendChangePattern.test(file)) continue
        if (/\.test\.(?:js|jsx|mjs|ts|tsx)$/.test(file)) {
            tests.push(file)
            continue
        }

        const extension = path.extname(file)
        const base = file.slice(0, -extension.length)
        for (const testExtension of companionTestExtensions) {
            const candidate = `${base}${testExtension}`
            if (fileExists(path.join(repositoryRoot, candidate))) {
                tests.push(candidate)
            }
        }
    }

    return unique(tests)
}

export const javaTestPatterns = (files, fileExists = existsSync) => {
    const patterns = ["*DependencyRulesTest"]
    const mainPrefix = "knowledge-api/src/main/java/"
    const testPrefix = "knowledge-api/src/test/java/"

    for (const file of files) {
        if (!file.endsWith(".java")) continue

        if (file.startsWith(testPrefix)) {
            patterns.push(file.slice(testPrefix.length, -5).replaceAll("/", "."))
            continue
        }

        if (file.startsWith(mainPrefix)) {
            const relativeClass = file.slice(mainPrefix.length, -5)
            const candidate = `${testPrefix}${relativeClass}Test.java`
            if (fileExists(path.join(repositoryRoot, candidate))) {
                patterns.push(`${relativeClass.replaceAll("/", ".")}Test`)
            }
        }
    }

    return unique(patterns)
}

const changedFiles = () =>
    normalizeRequestedFiles([
        ...readGitLines(["diff", "--name-only", "--diff-filter=ACMRD", "HEAD"]),
        ...readGitLines(["ls-files", "--others", "--exclude-standard"]),
    ])

const workingTreeFingerprint = (files) => {
    const hash = createHash("sha256")
    for (const file of files) {
        const absolutePath = path.join(repositoryRoot, file)
        hash.update(file)
        hash.update("\0")
        hash.update(existsSync(absolutePath) ? readFileSync(absolutePath) : "<deleted>")
        hash.update("\0")
    }
    return hash.digest("hex")
}

const runStaticChecks = (files) => {
    run("git", ["diff", "--check", "HEAD", "--", ...files])
    const textIssues = files.flatMap((file) => {
        const absolutePath = path.join(repositoryRoot, file)
        if (!textFilePattern.test(file) || !existsSync(absolutePath)) return []
        return findTextIssues(file, readFileSync(absolutePath, "utf8"))
    })
    if (textIssues.length > 0) {
        throw new Error(`텍스트 기본 규칙 위반:\n${textIssues.join("\n")}`)
    }

    const { prettierFiles } = classifyChanges(files)
    if (prettierFiles.length > 0) {
        run(path.join(repositoryRoot, "node_modules/.bin/prettier"), ["--check", ...prettierFiles])
    }
}

const runArchitectureCheck = (files) => {
    if (!classifyChanges(files).javaTestsRequired) return

    run("./gradlew", ["--no-daemon", "test", "--tests", "*DependencyRulesTest"], {
        cwd: path.join(repositoryRoot, "knowledge-api"),
    })
}

const runFileCheck = (files) => {
    runStaticChecks(files)

    const frontendTests = findCompanionTests(files)
    if (frontendTests.length > 0) {
        run("npm", ["test", "--", ...frontendTests])
    }

    if (classifyChanges(files).javaTestsRequired) {
        const testArgs = javaTestPatterns(files).flatMap((pattern) => ["--tests", pattern])
        run("./gradlew", ["--no-daemon", "test", ...testArgs], {
            cwd: path.join(repositoryRoot, "knowledge-api"),
        })
    }
}

const runFinishCheck = (files) => {
    const beforeFingerprint = workingTreeFingerprint(files)
    runStaticChecks(files)
    const classification = classifyChanges(files)

    if (classification.frontendTestsRequired) {
        run("npm", ["test"])
    }
    if (classification.javaTestsRequired) {
        run("./gradlew", ["--no-daemon", "test"], {
            cwd: path.join(repositoryRoot, "knowledge-api"),
        })
    }
    if (classification.buildRequired) {
        run("npm", ["run", "build"])
    }

    const finalFiles = changedFiles()
    runStaticChecks(finalFiles)
    if (
        finalFiles.join("\n") !== files.join("\n") ||
        workingTreeFingerprint(finalFiles) !== beforeFingerprint
    ) {
        throw new Error(
            "검사 중 변경된 파일이 있습니다. 새 diff를 검토한 뒤 npm run check:finish를 다시 실행하세요.",
        )
    }
}

const main = () => {
    const [mode, ...requestedFiles] = process.argv.slice(2)
    if (!new Set(["file", "diff", "finish"]).has(mode)) {
        throw new Error("사용법: agent-feedback-check.mjs <file|diff|finish> [파일 ...]")
    }

    const files = mode === "file" ? normalizeRequestedFiles(requestedFiles) : changedFiles()
    if (files.length === 0) {
        throw new Error(
            mode === "file" ? "검사할 파일을 지정하세요." : "검사할 변경 파일이 없습니다.",
        )
    }

    process.stdout.write(
        `검사 대상 ${files.length}개\n${files.map((file) => `- ${file}`).join("\n")}\n`,
    )

    if (mode === "file") {
        runFileCheck(files)
    } else if (mode === "diff") {
        runStaticChecks(files)
        runArchitectureCheck(files)
    } else {
        runFinishCheck(files)
    }

    process.stdout.write("\n에이전트 피드백 검사 통과\n")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    try {
        main()
    } catch (error) {
        process.stderr.write(`\n에이전트 피드백 검사 실패: ${error.message}\n`)
        process.exitCode = 1
    }
}
