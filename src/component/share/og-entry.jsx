import { createRoot } from "react-dom/client"
import ProjectOgPreview from "./ProjectOgPreview"
import "../../index.css"

const imageId = new URLSearchParams(window.location.search).get("project")

await document.fonts.ready
createRoot(document.getElementById("root")).render(<ProjectOgPreview imageId={imageId} />)
