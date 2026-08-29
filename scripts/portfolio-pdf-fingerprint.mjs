import path from "node:path"
import {
    createSourceFingerprint,
    portfolioPdfSourceTargets,
    repositoryRoot,
} from "./artifact-inputs.mjs"

export const portfolioPdfManifestPath = path.join(
    repositoryRoot,
    "scripts",
    "portfolio-pdf.manifest.json",
)

export const createPortfolioPdfFingerprint = async () =>
    createSourceFingerprint({ targets: portfolioPdfSourceTargets })
