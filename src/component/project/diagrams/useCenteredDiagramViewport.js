import { useLayoutEffect, useRef } from "react"

const useCenteredDiagramViewport = () => {
    const viewportRef = useRef(null)

    useLayoutEffect(() => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        let wasOverflowing = false
        const centerWhenOverflowStarts = () => {
            const isOverflowing = viewport.scrollWidth > viewport.clientWidth
            if (isOverflowing && !wasOverflowing) {
                viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2
            }
            wasOverflowing = isOverflowing
        }

        centerWhenOverflowStarts()
        const observer =
            typeof ResizeObserver === "undefined"
                ? null
                : new ResizeObserver(centerWhenOverflowStarts)
        observer?.observe(viewport)
        window.addEventListener("resize", centerWhenOverflowStarts)

        return () => {
            observer?.disconnect()
            window.removeEventListener("resize", centerWhenOverflowStarts)
        }
    }, [])

    return viewportRef
}

export default useCenteredDiagramViewport
