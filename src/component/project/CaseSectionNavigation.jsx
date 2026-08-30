import { useEffect, useRef, useState } from "react"
import "../../css/CaseSectionNavigation.css"

const CaseSectionNavigation = ({ sections, label = "상세 섹션 바로가기" }) => {
    const navigationRef = useRef(null)
    const listRef = useRef(null)
    const [activeId, setActiveId] = useState(sections[0]?.id)
    const sectionIds = sections.map((section) => section.id).join(",")

    useEffect(() => {
        const navigation = navigationRef.current
        const targets = sectionIds
            .split(",")
            .map((id) => document.getElementById(id))
            .filter(Boolean)
        const originalMargins = targets.map((target) => target.style.scrollMarginTop)
        let observer
        let updateActive
        let wasAtBottom = false
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
                const current = isAtBottom()
                    ? targets.at(-1)
                    : [...targets]
                          .reverse()
                          .find((target) => target.getBoundingClientRect().top <= offset + 1)
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
        const updateAtPageEnd = () => {
            const atBottom = isAtBottom()
            if (atBottom || wasAtBottom) updateActive()
            wasAtBottom = atBottom
        }
        window.addEventListener("scroll", updateAtPageEnd, { passive: true })

        return () => {
            observer?.disconnect()
            resizeObserver?.disconnect()
            window.removeEventListener("resize", observeSections)
            window.removeEventListener("scroll", updateAtPageEnd)
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
        </nav>
    )
}

export default CaseSectionNavigation
