export const KNOWLEDGE_SCHEMA_VERSION = "1.0"

export const KNOWLEDGE_DOCUMENT_TYPES = [
    "project_overview",
    "service_overview",
    "architecture_decision",
    "problem_solution",
    "implementation_evidence",
    "representative_document",
]

export const PUBLIC_LOCAL_DOCUMENTS = [
    "/docs/baton/core-hexagonal.md",
    "/docs/baton/go-idempotent-link.md",
    "/docs/baton/relay-attempt-recovery.md",
    "/docs/baton/brief-event-projection.md",
    "/docs/baton/cal-calendar-contract.md",
    "/docs/baton/round-realtime-boundary.md",
]

export const PUBLIC_EXTERNAL_DOCUMENTS = [
    "https://github.com/ljkhyeong/baton-watch/blob/main/docs/ADR/0003_health-change-event-delivery/adr.md",
    "https://github.com/ljkhyeong/baton-watch/blob/main/docs/runbooks/public-staging-event-delivery.md",
    "https://github.com/ljkhyeong/happyGallery/blob/main/docs/PRD/0001_%EA%B8%B0%EC%A4%80_%EC%8A%A4%ED%8E%99/spec.md",
    "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0021_Hexagonal_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%A0%84%ED%99%98/adr.md",
    "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/ADR/0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
    "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0011_이용권_사용_소모_환불_결정/adr.md",
    "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0032_%EC%95%8C%EB%A6%BC_Outbox_%EC%A0%84%EB%8B%AC_%EB%B3%B4%EC%9E%A5/adr.md",
    "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/ADR/0036_%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4_%ED%8F%89%EB%AC%B8_%EC%A0%9C%EA%B1%B0%EC%99%80_%EB%B8%94%EB%9D%BC%EC%9D%B8%EB%93%9C_%EC%9D%B8%EB%8D%B1%EC%8A%A4_%EA%B8%B0%EC%A4%80/adr.md",
    "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/Retrospective/0010_AWS_%EB%B9%84%EC%9A%A9_%EA%B3%BC%EA%B8%88_%EC%9B%90%EC%9D%B8_%EC%A0%90%EA%B2%80/retrospective.md",
    "https://github.com/ljkhyeong/hope-commit/blob/main/README.ko.md",
    "https://github.com/ljkhyeong/hope-commit/blob/main/plugins/hope-commit/skills/commit-diff/SKILL.md",
    "https://github.com/ljkhyeong/hope-commit/blob/main/SECURITY.md",
    "https://github.com/ljkhyeong/hope-commit/blob/main/NOTICE",
]

const PORTFOLIO_ORIGIN = "https://ljkportfolio.netlify.app"

const joinContent = (parts) =>
    parts
        .filter((part) => typeof part === "string" && part.trim())
        .map((part) => part.trim())
        .join("\n\n")

const labeledContent = (label, value) => (value ? `${label}: ${value}` : null)

const toPublicUrl = (href) =>
    href.startsWith("/") ? new URL(href, PORTFOLIO_ORIGIN).toString() : href

const findService = (project, serviceId) =>
    project.services?.find((service) => service.id === serviceId)

const serviceRoute = (project, serviceId) => findService(project, serviceId)?.route ?? project.route

const projectSource = (project, source) => ({
    projectId: project.id,
    projectName: project.title,
    serviceId: null,
    route: project.route,
    visibility: "public",
    ...source,
})

const createProjectOverview = (project) =>
    projectSource(project, {
        sourceKey: `project:${project.id}:overview`,
        documentType: "project_overview",
        title: `${project.title} 프로젝트 개요`,
        heading: "프로젝트 개요",
        content: joinContent([
            labeledContent("프로젝트", project.title),
            project.eyebrow,
            project.summary,
            labeledContent("기간", project.period),
            labeledContent("구분", project.category ?? project.projectType),
            labeledContent("담당", project.role),
            labeledContent("핵심 범위", project.oneLine),
            labeledContent("현재 상태", project.status?.text),
            labeledContent("사용 기술", project.stack?.join(", ")),
        ]),
        sourceUrl: toPublicUrl(`${project.route}#project-overview`),
        evidenceLevel: "portfolio_summary",
    })

const createServiceOverviews = (project) =>
    (project.services ?? []).map((service) => ({
        ...projectSource(project, {
            sourceKey: `project:${project.id}:service:${service.id}`,
            documentType: "service_overview",
            title: `${project.title} ${service.name} 서비스 개요`,
            heading: `${service.name} 서비스 개요`,
            content: joinContent([
                labeledContent("프로젝트", project.title),
                labeledContent("서비스", service.name),
                labeledContent("역할", service.role),
                service.summary,
                labeledContent("담당 구현", service.contribution),
                labeledContent("주요 기능", service.detail),
                labeledContent("입력", service.input),
                labeledContent("출력", service.output),
                labeledContent("처리 기준", service.recoveryBoundary),
                labeledContent("데이터베이스", service.database),
                labeledContent("사용 기술", service.stack?.join(", ")),
                labeledContent("구현 상태", service.status),
                labeledContent("적용 범위와 제약", service.tradeoff),
            ]),
            sourceUrl: toPublicUrl(service.route),
            evidenceLevel: "portfolio_detail",
        }),
        serviceId: service.id,
        route: service.route,
    }))

const createArchitectureDecision = (project) => {
    if (!project.architecture) {
        return []
    }

    return [
        projectSource(project, {
            sourceKey: `project:${project.id}:architecture`,
            documentType: "architecture_decision",
            title: `${project.title} 구현 구조와 선택 이유`,
            heading: "구현 구조와 선택 이유",
            content: joinContent([
                labeledContent("프로젝트", project.title),
                labeledContent("설계 기준", project.architecture.label),
                project.architecture.title,
                project.architecture.description,
                labeledContent("적용 범위와 제약", project.architecture.tradeoff),
            ]),
            sourceUrl: toPublicUrl(`${project.route}#project-architecture`),
            evidenceLevel: "portfolio_detail",
        }),
    ]
}

const createProblemSolutions = (project) =>
    (project.problems ?? []).map((problem) => {
        const singleServiceId = problem.serviceIds?.length === 1 ? problem.serviceIds[0] : null
        const route = singleServiceId ? serviceRoute(project, singleServiceId) : project.route
        const anchor =
            singleServiceId && singleServiceId !== "core" ? "service-problems" : "project-problems"

        return {
            ...projectSource(project, {
                sourceKey: `project:${project.id}:problem:${problem.number}`,
                documentType: "problem_solution",
                title: `${project.title} - ${problem.title}`,
                heading: "문제와 해결 방법",
                content: joinContent([
                    labeledContent("프로젝트", project.title),
                    labeledContent(
                        "서비스",
                        singleServiceId ? findService(project, singleServiceId)?.name : null,
                    ),
                    labeledContent("문제", problem.constraint),
                    labeledContent("적용", problem.decision),
                    labeledContent("확인", problem.validation),
                    labeledContent("제약과 남은 작업", problem.boundary),
                ]),
                sourceUrl: toPublicUrl(`${route}#${anchor}`),
                evidenceLevel: "portfolio_detail",
            }),
            serviceId: singleServiceId,
            route,
        }
    })

const createImplementationEvidence = (project) =>
    (project.proofs ?? []).map((proof, index) =>
        projectSource(project, {
            sourceKey: `project:${project.id}:evidence:${index + 1}`,
            documentType: "implementation_evidence",
            title: `${project.title} - ${proof.item}`,
            heading: project.evidenceTitle ?? "테스트 및 확인 결과",
            content: joinContent([
                labeledContent("프로젝트", project.title),
                labeledContent("확인 대상", proof.item),
                labeledContent("확인 방법", proof.method),
                labeledContent("확인 조건", proof.rule),
                labeledContent("결과", proof.result),
                labeledContent("공개 범위", proof.scope),
            ]),
            sourceUrl: toPublicUrl(`${project.route}#project-proof`),
            evidenceLevel: "verified_summary",
        }),
    )

const createRepresentativeDocuments = (project, localDocumentContentByHref) =>
    (project.documents ?? []).flatMap((document) => {
        const localDocumentAllowed = PUBLIC_LOCAL_DOCUMENTS.includes(document.href)
        const externalDocumentAllowed = PUBLIC_EXTERNAL_DOCUMENTS.includes(document.href)

        if (!localDocumentAllowed && !externalDocumentAllowed) {
            return []
        }

        const localContent = localDocumentContentByHref[document.href]

        if (localDocumentAllowed && !localContent) {
            throw new Error(`공개 문서 내용을 찾을 수 없습니다: ${document.href}`)
        }

        return [
            {
                ...projectSource(project, {
                    sourceKey: `project:${project.id}:document:${document.serviceId ?? "project"}:${document.href}`,
                    documentType: "representative_document",
                    title: document.label,
                    heading: document.type,
                    content: localDocumentAllowed
                        ? localContent
                        : joinContent([
                              labeledContent("프로젝트", project.title),
                              labeledContent("서비스", document.serviceId?.toUpperCase()),
                              labeledContent("문서 종류", document.type),
                              document.note,
                          ]),
                    sourceUrl: toPublicUrl(document.href),
                    evidenceLevel: localDocumentAllowed
                        ? "public_document"
                        : "public_document_metadata",
                }),
                serviceId: document.serviceId ?? null,
                route: serviceRoute(project, document.serviceId),
            },
        ]
    })

export const createKnowledgeSources = (projects, { localDocumentContentByHref = {} } = {}) =>
    projects.flatMap((project) => [
        createProjectOverview(project),
        ...createServiceOverviews(project),
        ...createArchitectureDecision(project),
        ...createProblemSolutions(project),
        ...createImplementationEvidence(project),
        ...createRepresentativeDocuments(project, localDocumentContentByHref),
    ])
