import "./App.css"
import { lazy, Suspense, useEffect, useRef } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import Main from "./component/Main"
import NotFound from "./component/NotFound"
import ProjectBaton from "./component/project/ProjectBaton"
import BatonServiceCaseStudy from "./component/project/BatonServiceCaseStudy"
import Project2 from "./component/project/Project2"
import Project3 from "./component/project/Project3"
import Project4 from "./component/project/Project4"
import {
    defaultRouteMeta,
    notFoundRouteMeta,
    routeMeta,
    siteUrl,
    toAbsoluteUrl,
} from "./data/routeMeta"

const PortfolioPrintPage = lazy(() => import("./component/print/PortfolioPrintPage"))

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
    const isInitialRoute = useRef(true)

    useEffect(() => {
        const meta = routeMeta[pathname] ?? notFoundRouteMeta
        const canonicalUrl = new URL(pathname, siteUrl).toString()

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

        if (isInitialRoute.current) {
            isInitialRoute.current = false
            return
        }

        const pageHeading = document.querySelector("h1")

        if (pageHeading) {
            pageHeading.setAttribute("tabindex", "-1")
            pageHeading.focus({ preventScroll: true })
        }
    }, [pathname])

    return null
}

const App = () => {
    return (
        <Suspense fallback={<div className="route-loading">페이지 불러오는 중…</div>}>
            <BrowserRouter>
                <RouteEffects />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/projects/baton" element={<ProjectBaton />} />
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
                    <Route path="/projects/happygallery" element={<Project3 />} />
                    <Route path="/projects/defense" element={<Project4 />} />
                    <Route path="/projects/webrtc" element={<Project2 />} />
                    <Route path="/portfolio/print" element={<PortfolioPrintPage />} />

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
