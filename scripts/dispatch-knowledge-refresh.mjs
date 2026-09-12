import path from "node:path"
import { fileURLToPath } from "node:url"
import { cancelGitHubBody, githubResponseError } from "./github-response.mjs"

export const KNOWLEDGE_REFRESH_EVENT = "knowledge-documents-changed"

export async function dispatchKnowledgeRefresh({
    repository = "ljkhyeong/portfolio",
    token,
    dryRun = false,
    fetchImpl = fetch,
} = {}) {
    if (!/^[\w-]+\/[\w.-]+$/.test(repository) || [".", ".."].includes(repository.split("/")[1])) {
        throw new Error("대상 저장소는 owner/repository 형식이어야 합니다.")
    }
    const url = `https://api.github.com/repos/${repository}/dispatches`
    const body = JSON.stringify({ event_type: KNOWLEDGE_REFRESH_EVENT })
    if (dryRun) return { url, body, sent: false }
    if (!token?.trim()) throw new Error("KNOWLEDGE_DISPATCH_TOKEN을 설정하세요.")

    const signal = AbortSignal.timeout(15_000)
    let response
    try {
        response = await fetchImpl(url, {
            method: "POST",
            redirect: "error",
            signal,
            headers: {
                Accept: "application/vnd.github+json",
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2026-03-10",
                Authorization: `Bearer ${token.trim()}`,
            },
            body,
        })
    } catch {
        const reason = signal.aborted
            ? "15초 안에 응답을 받지 못했습니다."
            : "GitHub 응답을 받지 못했습니다."
        throw new Error(`${reason} 재전송 전에 Actions에서 접수 여부를 확인하세요.`)
    }
    if (response.status !== 204) {
        const error = githubResponseError(response, "GitHub 문서 검사 요청 실패")
        await cancelGitHubBody(response.body)
        throw error
    }
    return { url, body, sent: true }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    try {
        const args = process.argv.slice(2)
        if (args.some((arg) => arg !== "--dry-run")) {
            throw new Error("사용법: node scripts/dispatch-knowledge-refresh.mjs [--dry-run]")
        }
        const result = await dispatchKnowledgeRefresh({
            repository: process.env.KNOWLEDGE_DISPATCH_REPOSITORY || "ljkhyeong/portfolio",
            token: process.env.KNOWLEDGE_DISPATCH_TOKEN,
            dryRun: args.includes("--dry-run"),
        })
        console.log(
            result.sent
                ? "GitHub이 문서 검사 이벤트를 접수했습니다. 실행 결과는 Actions에서 확인하세요."
                : `전송 전 확인: POST ${result.url}\n${result.body}`,
        )
    } catch (error) {
        console.error(`문서 검사 이벤트 전송 실패: ${error.message}`)
        process.exitCode = 1
    }
}
