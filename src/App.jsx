import "./App.css"
import { lazy, Suspense, useEffect, useRef } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import Main from "./component/Main"
import NotFound from "./component/NotFound"
import ScrollToTopButton from "./component/ScrollToTopButton"
import {
    defaultRouteMeta,
    normalizeRoutePath,
    notFoundRouteMeta,
    routeMeta,
    toAbsoluteUrl,
    toCanonicalUrl,
} from "./data/routeMeta"

const ProjectCaseStudy = lazy(() => import("./component/project/ProjectCaseStudy"))
const BatonServiceCaseStudy = lazy(() => import("./component/project/BatonServiceCaseStudy"))
const PortfolioPrintPage = lazy(() => import("./component/print/PortfolioPrintPage"))
const PortfolioKnowledgePage = lazy(() => import("./component/search/PortfolioKnowledgePage"))

const updateMetaContent = (attribute, key, value) => {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

    if (!element) {
        element = document.createElement("meta")
        element.setAttribute(attribute, key)
        document.head.append(element)
    }

    element.setAttribute("content", value)
}

const RouteEffects = () => {
    const { pathname } = useLocation()
    const normalizedPathname = normalizeRoutePath(pathname)
    const previousPathname = useRef(normalizedPathname)

    useEffect(() => {
        const shouldFocusHeading = previousPathname.current !== normalizedPathname
        previousPathname.current = normalizedPathname
        const meta = routeMeta[normalizedPathname] ?? notFoundRouteMeta
        const canonicalUrl = toCanonicalUrl(normalizedPathname)

        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        document.title = meta.title ?? defaultRouteMeta.title
        updateMetaContent("name", "description", meta.description)
        updateMetaContent("property", "og:title", meta.title)
        updateMetaContent("property", "og:description", meta.description)
        updateMetaContent("property", "og:url", canonicalUrl)
        updateMetaContent("property", "og:image", toAbsoluteUrl(meta.image))
        updateMetaContent("name", "twitter:title", meta.title)
        updateMetaContent("name", "twitter:description", meta.description)
        updateMetaContent("name", "twitter:image", toAbsoluteUrl(meta.image))
        updateMetaContent("name", "robots", meta.noindex ? "noindex, nofollow" : "index, follow")

        let canonical = document.head.querySelector('link[rel="canonical"]')

        if (!canonical) {
            canonical = document.createElement("link")
            canonical.setAttribute("rel", "canonical")
            document.head.append(canonical)
        }

        canonical.setAttribute("href", canonicalUrl)

        if (!shouldFocusHeading) {
            return
        }

        const focusRouteHeading = () => {
            const pageHeading = Array.from(
                document.querySelectorAll("h1[data-route-heading]"),
            ).find((heading) => heading.dataset.routeHeading === normalizedPathname)

            if (!pageHeading) {
                return false
            }

            pageHeading.setAttribute("tabindex", "-1")
            pageHeading.focus({ preventScroll: true })
            return true
        }

        if (focusRouteHeading()) {
            return
        }

        const headingObserver = new MutationObserver(() => {
            if (focusRouteHeading()) {
                headingObserver.disconnect()
            }
        })

        headingObserver.observe(document.body, {
            childList: true,
            subtree: true,
        })

        return () => headingObserver.disconnect()
    }, [normalizedPathname])

    return null
}

const App = () => {
    return (
        <Suspense
            fallback={
                <div className="route-loading" role="status" aria-live="polite">
                    페이지 불러오는 중…
                </div>
            }
        >
            <BrowserRouter>
                <RouteEffects />
                <ScrollToTopButton />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route
                        path="/projects/baton"
                        element={<ProjectCaseStudy projectId="baton" />}
                    />
                    <Route
                        path="/projects/baton/go"
                        element={<BatonServiceCaseStudy serviceId="go" />}
                    />
                    <Route
                        path="/projects/baton/watch"
                        element={<BatonServiceCaseStudy serviceId="watch" />}
                    />
                    <Route
                        path="/projects/baton/relay"
                        element={<BatonServiceCaseStudy serviceId="relay" />}
                    />
                    <Route
                        path="/projects/baton/brief"
                        element={<BatonServiceCaseStudy serviceId="brief" />}
                    />
                    <Route
                        path="/projects/baton/cal"
                        element={<BatonServiceCaseStudy serviceId="cal" />}
                    />
                    <Route
                        path="/projects/happygallery"
                        element={<ProjectCaseStudy projectId="happygallery" />}
                    />
                    <Route
                        path="/projects/e-warrant"
                        element={<ProjectCaseStudy projectId="warrant" />}
                    />
                    <Route
                        path="/projects/defense"
                        element={<ProjectCaseStudy projectId="defense" />}
                    />
                    <Route
                        path="/projects/webrtc"
                        element={<ProjectCaseStudy projectId="webrtc" />}
                    />
                    <Route path="/portfolio/print" element={<PortfolioPrintPage />} />
                    <Route path="/search" element={<PortfolioKnowledgePage />} />

                    <Route
                        path="/project-baton"
                        element={<Navigate to="/projects/baton" replace />}
                    />
                    <Route path="/project2" element={<Navigate to="/projects/webrtc" replace />} />
                    <Route
                        path="/project3"
                        element={<Navigate to="/projects/happygallery" replace />}
                    />
                    <Route path="/project4" element={<Navigate to="/projects/defense" replace />} />
                    <Route
                        path="/portfolio-pdf/index.html"
                        element={<Navigate to="/portfolio/print" replace />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    )
}

export default App
