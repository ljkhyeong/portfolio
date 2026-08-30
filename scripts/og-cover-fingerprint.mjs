import path from "node:path"
import {
    createSourceFingerprint,
    ogCoverSourceTargets,
    projectOgSourceTargets,
    repositoryRoot,
} from "./artifact-inputs.mjs"

export const ogCoverManifestPath = path.join(repositoryRoot, "scripts", "og-cover.manifest.json")

export const createOgCoverFingerprint = async () =>
    createSourceFingerprint({ targets: ogCoverSourceTargets })

export const projectOgManifestPath = (id) =>
    path.join(repositoryRoot, "scripts", "og-manifests", `${id}.json`)

export const createProjectOgFingerprint = async () =>
    createSourceFingerprint({ targets: projectOgSourceTargets })
