import { useLayoutEffect, useRef } from "react"

const useCenteredDiagramViewport = () => {
    const viewportRef = useRef(null)

    useLayoutEffect(() => {
        const viewport = viewportRef.current

        if (!viewport || viewport.scrollWidth <= viewport.clientWidth) {
            return
        }

        viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2
    }, [])

    return viewportRef
}

export default useCenteredDiagramViewport
