import "./App.css"
import { Suspense, useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import Main from "./component/Main"
import ProjectBaton from "./component/project/ProjectBaton"
import BatonServiceCaseStudy from "./component/project/BatonServiceCaseStudy"
import Project2 from "./component/project/Project2"
import Project3 from "./component/project/Project3"
import Project4 from "./component/project/Project4"

const defaultTitle = "임정규 | 백엔드 개발자"

const pageTitles = {
    "/": defaultTitle,
    "/projects/baton": "BATON | 임정규 포트폴리오",
    "/projects/baton/go": "BATON GO | 임정규 포트폴리오",
    "/projects/baton/watch": "BATON WATCH | 임정규 포트폴리오",
    "/projects/baton/relay": "BATON RELAY | 임정규 포트폴리오",
    "/projects/happygallery": "happyGallery | 임정규 포트폴리오",
    "/projects/defense": "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
    "/projects/webrtc": "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
    "/project-baton": "BATON | 임정규 포트폴리오",
    "/project2": "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
    "/project3": "happyGallery | 임정규 포트폴리오",
    "/project4": "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
}

const RouteEffects = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        document.title = pageTitles[pathname] ?? defaultTitle

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

                    <Route
                        path="/project-baton"
                        element={<Navigate to="/projects/baton" replace />}
                    />
                    <Route path="/project2" element={<Project2 />} />
                    <Route path="/project3" element={<Project3 />} />
                    <Route path="/project4" element={<Project4 />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    )
}

export default App
