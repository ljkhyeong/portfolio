import path from "node:path"
import {
    createSourceFingerprint,
    ogCoverSourceTargets,
    repositoryRoot,
} from "./artifact-inputs.mjs"

export const ogCoverManifestPath = path.join(repositoryRoot, "scripts", "og-cover.manifest.json")

export const createOgCoverFingerprint = async () =>
    createSourceFingerprint({ targets: ogCoverSourceTargets })
