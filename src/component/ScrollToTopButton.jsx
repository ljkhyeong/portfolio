import { useEffect, useState } from "react"
import "../css/ScrollToTopButton.css"

const SCROLL_VISIBILITY_THRESHOLD = 560

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(() => window.scrollY >= SCROLL_VISIBILITY_THRESHOLD)

    useEffect(() => {
        const updateVisibility = () => {
            setIsVisible(window.scrollY >= SCROLL_VISIBILITY_THRESHOLD)
        }

        updateVisibility()
        window.addEventListener("scroll", updateVisibility, { passive: true })

        return () => window.removeEventListener("scroll", updateVisibility)
    }, [])

    const handleClick = () => {
        const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        })
    }

    if (!isVisible) {
        return null
    }

    return (
        <button
            className="scroll-to-top"
            type="button"
            aria-label="맨 위로 이동"
            title="맨 위로 이동"
            onClick={handleClick}
        >
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                <path
                    fill="currentColor"
                    d="M3.22 6.97a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L8.75 4v10.25a.75.75 0 0 1-1.5 0V4L4.28 6.97a.75.75 0 0 1-1.06 0Z"
                />
            </svg>
        </button>
    )
}

export default ScrollToTopButton
