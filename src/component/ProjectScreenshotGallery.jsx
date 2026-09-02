import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { assetPath } from "../utils/assetPath"
import "../css/ScreenshotGallery.css"

const ProjectScreenshotGallery = ({ project, context = "showcase", visibleScreenshotIds }) => {
    const [activeIndex, setActiveIndex] = useState(null)
    const dialogId = useId()
    const dialogTitleId = `${dialogId}-title`
    const closeButtonRef = useRef(null)
    const triggerRef = useRef(null)
    const screenshots = project.screenshots
    const displayedScreenshots = screenshots
        .map((screenshot, index) => ({ screenshot, index }))
        .filter(
            ({ screenshot }) =>
                !visibleScreenshotIds || visibleScreenshotIds.includes(screenshot.id),
        )
    const isOpen = activeIndex !== null
    const activeScreenshot = isOpen ? screenshots[activeIndex] : null

    const openLightbox = (index, trigger) => {
        triggerRef.current = trigger
        setActiveIndex(index)
    }

    const closeLightbox = () => setActiveIndex(null)

    const showPrevious = () => {
        setActiveIndex((current) => (current - 1 + screenshots.length) % screenshots.length)
    }

    const showNext = () => {
        setActiveIndex((current) => (current + 1) % screenshots.length)
    }

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        const previousOverflow = document.body.style.overflow
        const previousPaddingRight = document.body.style.paddingRight
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

        document.body.style.overflow = "hidden"

        if (scrollbarWidth > 0) {
            const currentPadding =
                Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0
            document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
        }

        closeButtonRef.current?.focus()

        return () => {
            document.body.style.overflow = previousOverflow
            document.body.style.paddingRight = previousPaddingRight
            triggerRef.current?.focus()
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault()
                closeLightbox()
                return
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault()
                showPrevious()
                return
            }

            if (event.key === "ArrowRight") {
                event.preventDefault()
                showNext()
                return
            }

            if (event.key !== "Tab") {
                return
            }

            const dialog = document.getElementById(dialogId)
            const focusableElements = dialog?.querySelectorAll("button:not(:disabled)") ?? []
            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault()
                lastElement?.focus()
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault()
                firstElement?.focus()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [dialogId, isOpen, screenshots.length])

    return (
        <>
            <div
                className={`screenshot-gallery screenshot-gallery--${context} screenshot-gallery--${project.visual} screenshot-gallery--count-${displayedScreenshots.length}`}
                role="group"
                aria-label={`${project.title} 대표 화면`}
            >
                {displayedScreenshots.map(({ screenshot, index }, displayIndex) => (
                    <figure
                        className={`screenshot-gallery__item screenshot-gallery__item--${displayIndex + 1}`}
                        key={screenshot.id}
                        style={{
                            "--screenshot-ratio": `${screenshot.width} / ${screenshot.height}`,
                        }}
                    >
                        <div className="screenshot-gallery__chrome" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <code>[screen.{String(displayIndex + 1).padStart(2, "0")}]</code>
                        </div>
                        <button
                            className={`screenshot-gallery__viewport screenshot-gallery__viewport--${screenshot.fit ?? "cover"}`}
                            type="button"
                            aria-haspopup="dialog"
                            aria-label={`${project.title} ${screenshot.label} 화면 확대해서 보기`}
                            onClick={(event) => openLightbox(index, event.currentTarget)}
                        >
                            <img
                                src={assetPath(screenshot.src)}
                                width={screenshot.width}
                                height={screenshot.height}
                                loading={
                                    index === 0 && context.startsWith("case") ? "eager" : "lazy"
                                }
                                decoding="async"
                                alt={screenshot.alt}
                            />
                            <span className="screenshot-gallery__zoom" aria-hidden="true">
                                크게 보기
                            </span>
                        </button>
                        <figcaption>
                            <span>{screenshot.label}</span>
                            <strong>{screenshot.caption}</strong>
                        </figcaption>
                    </figure>
                ))}
            </div>

            {isOpen &&
                createPortal(
                    <div
                        className={`screenshot-lightbox${context.startsWith("case") ? " screenshot-lightbox--case" : ""}`}
                        id={dialogId}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={dialogTitleId}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeLightbox()
                            }
                        }}
                    >
                        <div className="screenshot-lightbox__panel">
                            <header className="screenshot-lightbox__header">
                                <div>
                                    <span className="screenshot-lightbox__eyebrow">
                                        {project.title} / 대표 화면
                                    </span>
                                    <h2 id={dialogTitleId}>{activeScreenshot.label}</h2>
                                </div>
                                <button
                                    className="screenshot-lightbox__close"
                                    type="button"
                                    ref={closeButtonRef}
                                    onClick={closeLightbox}
                                    aria-label="확대 화면 닫기"
                                >
                                    <span aria-hidden="true">닫기</span>
                                </button>
                            </header>

                            <div className="screenshot-lightbox__image-stage">
                                <img
                                    src={assetPath(activeScreenshot.src)}
                                    width={activeScreenshot.width}
                                    height={activeScreenshot.height}
                                    alt={activeScreenshot.alt}
                                />
                            </div>

                            <footer className="screenshot-lightbox__footer">
                                <p>{activeScreenshot.caption}</p>
                                <div className="screenshot-lightbox__navigation">
                                    <span
                                        className="screenshot-lightbox__status"
                                        aria-live="polite"
                                        aria-atomic="true"
                                    >
                                        <span>
                                            {activeIndex + 1} / {screenshots.length}
                                        </span>
                                        <span className="screenshot-lightbox__announcement">
                                            , {activeScreenshot.label}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={showPrevious}
                                        aria-label="이전 이미지"
                                    >
                                        <span aria-hidden="true">←</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={showNext}
                                        aria-label="다음 이미지"
                                    >
                                        <span aria-hidden="true">→</span>
                                    </button>
                                </div>
                            </footer>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    )
}

export default ProjectScreenshotGallery
