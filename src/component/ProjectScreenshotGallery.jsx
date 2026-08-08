import { assetPath } from "../utils/assetPath"
import "../css/ScreenshotGallery.css"

const ProjectScreenshotGallery = ({ project, context = "showcase" }) => (
    <div
        className={`screenshot-gallery screenshot-gallery--${context} screenshot-gallery--${project.visual}`}
        aria-label={`${project.title} 대표 화면`}
    >
        {project.screenshots.map((screenshot, index) => (
            <figure
                className={`screenshot-gallery__item screenshot-gallery__item--${index + 1}`}
                key={screenshot.id}
            >
                <div className="screenshot-gallery__chrome" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <code>[screen.{String(index + 1).padStart(2, "0")}]</code>
                </div>
                <div
                    className={`screenshot-gallery__viewport screenshot-gallery__viewport--${screenshot.fit ?? "cover"}`}
                >
                    <img
                        src={assetPath(screenshot.src)}
                        width={screenshot.width}
                        height={screenshot.height}
                        loading={index === 0 && context === "case" ? "eager" : "lazy"}
                        decoding="async"
                        alt={screenshot.alt}
                    />
                </div>
                <figcaption>
                    <span>{screenshot.label}</span>
                    <strong>{screenshot.caption}</strong>
                </figcaption>
            </figure>
        ))}
    </div>
)

export default ProjectScreenshotGallery
