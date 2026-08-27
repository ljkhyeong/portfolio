import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Main from "../Main"
import { siteUrl } from "../../data/routeMeta"
import "../../css/PortfolioPrint.css"

const toPublishedHref = (href) => {
    if (!href?.startsWith("/") || href.startsWith("//")) {
        return href
    }

    return new URL(href, siteUrl).toString()
}

const waitForPrintAssets = async (root) => {
    const images = Array.from(root.querySelectorAll("img"))
    const imageReady = images.map((image) => {
        if (image.complete) {
            return image.decode?.().catch(() => undefined) ?? Promise.resolve()
        }

        return new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true })
            image.addEventListener("error", resolve, { once: true })
        })
    })

    const assetsReady = Promise.all([document.fonts?.ready ?? Promise.resolve(), ...imageReady])

    if (navigator.userAgent.toLowerCase().includes("jsdom")) {
        return
    }

    await Promise.race([assetsReady, new Promise((resolve) => setTimeout(resolve, 5000))])
}

const findHorizontalOverflow = (root) => {
    const rootRect = root.getBoundingClientRect()

    return Array.from(root.querySelectorAll("*"))
        .filter((element) => {
            const style = window.getComputedStyle(element)

            if (
                element.getClientRects().length === 0 ||
                style.display === "none" ||
                style.visibility === "hidden" ||
                style.position === "fixed"
            ) {
                return false
            }

            const rect = element.getBoundingClientRect()
            return rect.left < rootRect.left - 1 || rect.right > rootRect.right + 1
        })
        .map((element) => element.className || element.tagName.toLowerCase())
        .slice(0, 12)
}

const PortfolioPrintPage = () => {
    const documentRef = useRef(null)

    useEffect(() => {
        const root = documentRef.current
        const originalLinks = []
        let cancelled = false

        document.documentElement.classList.add("portfolio-print-mode")
        document.body.classList.add("portfolio-print-mode")
        document.documentElement.dataset.printReady = "loading"

        root.querySelectorAll("a[href]").forEach((anchor) => {
            const href = anchor.getAttribute("href")
            const publishedHref = toPublishedHref(href)

            if (href !== publishedHref) {
                originalLinks.push([anchor, href])
                anchor.setAttribute("href", publishedHref)
            }
        })

        const markPrintReadiness = async () => {
            await waitForPrintAssets(root)

            if (cancelled) {
                return
            }

            const overflowElements = findHorizontalOverflow(root)
            document.documentElement.dataset.printReady = "true"
            document.documentElement.dataset.printOverflowCount = String(overflowElements.length)
            document.documentElement.dataset.printOverflowPages = overflowElements.join(",")
        }

        markPrintReadiness().catch((error) => {
            document.documentElement.dataset.printReady = "error"
            document.documentElement.dataset.printError = error.message
        })

        return () => {
            cancelled = true
            originalLinks.forEach(([anchor, href]) => anchor.setAttribute("href", href))
            document.documentElement.classList.remove("portfolio-print-mode")
            document.body.classList.remove("portfolio-print-mode")
            delete document.documentElement.dataset.printReady
            delete document.documentElement.dataset.printOverflowCount
            delete document.documentElement.dataset.printOverflowPages
            delete document.documentElement.dataset.printError
        }
    }, [])

    return (
        <div className="portfolio-web-print">
            <nav className="print-toolbar" aria-label="인쇄본 도구">
                <Link to="/">← 웹 포트폴리오</Link>
                <span>웹 포트폴리오와 같은 내용을 인쇄용으로 배치한 페이지</span>
                <button type="button" onClick={() => window.print()}>
                    인쇄 또는 PDF 저장
                </button>
            </nav>
            <div className="portfolio-web-print__document" ref={documentRef}>
                <Main />
            </div>
        </div>
    )
}

export default PortfolioPrintPage
