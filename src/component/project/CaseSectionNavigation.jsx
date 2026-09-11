import { useEffect, useRef, useState } from "react"
import "../../css/CaseSectionNavigation.css"

const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(value)
            return
        } catch {
            // 권한이 제한된 브라우저에서는 아래의 선택 영역 복사를 사용한다.
        }
    }

    const textArea = document.createElement("textarea")
    textArea.value = value
    textArea.setAttribute("readonly", "")
    textArea.setAttribute("aria-hidden", "true")
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    document.body.append(textArea)
    let copied = false

    try {
        textArea.select()
        copied = document.execCommand?.("copy") ?? false
    } finally {
        textArea.remove()
    }

    if (!copied) {
        throw new Error("링크를 복사하지 못했습니다.")
    }
}

const CaseSectionNavigation = ({ sections, label = "상세 섹션 바로가기" }) => {
    const navigationRef = useRef(null)
    const listRef = useRef(null)
    const copyResetTimerRef = useRef(null)
    const [activeId, setActiveId] = useState(sections[0]?.id)
    const [copyState, setCopyState] = useState("idle")
    const sectionIds = sections.map((section) => section.id).join(",")
    const activeLabel = sections.find((section) => section.id === activeId)?.label ?? "현재"

    const showCopyState = (state) => {
        window.clearTimeout(copyResetTimerRef.current)
        setCopyState(state)
        copyResetTimerRef.current = window.setTimeout(() => setCopyState("idle"), 1800)
    }

    const copyActiveSectionLink = async () => {
        if (!activeId) return

        const url = new URL(window.location.href)
        url.hash = activeId

        try {
            await copyText(url.toString())
            showCopyState("copied")
        } catch {
            showCopyState("failed")
        }
    }

    useEffect(() => {
        const navigation = navigationRef.current
        const targets = sectionIds
            .split(",")
            .map((id) => document.getElementById(id))
            .filter(Boolean)
        const originalMargins = targets.map((target) => target.style.scrollMarginTop)
        let observer
        let updateActive
        const isAtBottom = () =>
            document.documentElement.scrollHeight > window.innerHeight &&
            window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

        const observeSections = () => {
            const offset = Math.ceil(navigation.getBoundingClientRect().height) + 24
            const pagePadding =
                parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
            targets.forEach((target) => {
                target.style.scrollMarginTop = `${Math.max(0, offset - pagePadding)}px`
            })
            observer?.disconnect()

            updateActive = () => {
                const navigationBottom = navigation.getBoundingClientRect().bottom
                const activationOffset = Math.max(
                    offset,
                    Math.min(navigationBottom, window.innerHeight * 0.35),
                )
                const current = isAtBottom()
                    ? targets.at(-1)
                    : [...targets]
                          .reverse()
                          .find(
                              (target) =>
                                  target.getBoundingClientRect().top <= activationOffset + 1,
                          )
                setActiveId(current?.id ?? targets[0]?.id)
            }

            updateActive()
            if (typeof IntersectionObserver === "undefined") return

            observer = new IntersectionObserver(updateActive, {
                rootMargin: `-${offset}px 0px -${Math.max(0, window.innerHeight - offset - 1)}px 0px`,
                threshold: 0,
            })
            targets.forEach((target) => observer.observe(target))
        }

        observeSections()
        const resizeObserver =
            typeof ResizeObserver === "undefined" ? null : new ResizeObserver(observeSections)
        resizeObserver?.observe(navigation)
        window.addEventListener("resize", observeSections)
        window.addEventListener("scroll", updateActive, { passive: true })

        return () => {
            observer?.disconnect()
            resizeObserver?.disconnect()
            window.removeEventListener("resize", observeSections)
            window.removeEventListener("scroll", updateActive)
            targets.forEach((target, index) => {
                target.style.scrollMarginTop = originalMargins[index]
            })
        }
    }, [sectionIds])

    useEffect(() => {
        const revealActiveLink = () => {
            const list = listRef.current
            const activeLink = list?.querySelector('[aria-current="location"]')
            if (!list || !activeLink || list.scrollWidth <= list.clientWidth) return

            const listBounds = list.getBoundingClientRect()
            const linkBounds = activeLink.getBoundingClientRect()
            if (linkBounds.left < listBounds.left) {
                list.scrollLeft -= listBounds.left - linkBounds.left + 8
            } else if (linkBounds.right > listBounds.right) {
                list.scrollLeft += linkBounds.right - listBounds.right + 8
            }
        }

        revealActiveLink()
        window.addEventListener("resize", revealActiveLink)
        return () => window.removeEventListener("resize", revealActiveLink)
    }, [activeId])

    useEffect(() => {
        window.clearTimeout(copyResetTimerRef.current)
        setCopyState("idle")
    }, [activeId])

    useEffect(
        () => () => {
            window.clearTimeout(copyResetTimerRef.current)
        },
        [],
    )

    return (
        <nav className="case-section-nav" aria-label={label} ref={navigationRef}>
            <span className="case-section-nav__label" aria-hidden="true">
                페이지 내 이동
            </span>
            <ul ref={listRef}>
                {sections.map((section) => (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            aria-current={activeId === section.id ? "location" : undefined}
                            onClick={() => setActiveId(section.id)}
                        >
                            <span className="case-section-nav__full-label">{section.label}</span>
                            <span className="case-section-nav__short-label" aria-hidden="true">
                                {section.mobileLabel ?? section.label}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
            <button
                className="case-section-nav__copy"
                type="button"
                aria-label={`${activeLabel} 섹션 링크 복사`}
                onClick={copyActiveSectionLink}
            >
                <span aria-hidden="true">#</span>
                {copyState === "copied"
                    ? "복사됨"
                    : copyState === "failed"
                      ? "복사 실패"
                      : "링크 복사"}
            </button>
            <span
                className="case-section-nav__feedback"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {copyState === "copied"
                    ? `${activeLabel} 섹션 링크를 복사했습니다.`
                    : copyState === "failed"
                      ? "링크를 복사하지 못했습니다. 주소 표시줄에서 복사해 주세요."
                      : ""}
            </span>
        </nav>
    )
}

export default CaseSectionNavigation
