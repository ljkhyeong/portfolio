import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { readAssetVersions } from "./scripts/asset-versions.mjs"

export default defineConfig({
    plugins: [react()],
    // 화면 캡처 주소에 붙일 내용 해시(src/utils/assetPath.js). 서버를 시작할 때 한 번 계산한다.
    define: {
        __ASSET_VERSIONS__: JSON.stringify(
            readAssetVersions(fileURLToPath(new URL("./public", import.meta.url))),
        ),
    },
    build: {
        outDir: "build",
        // 경로별 HTML에 상세 화면 청크를 미리 알리기 위해 만든다. postbuild에서 쓰고 지운다.
        manifest: true,
    },
    test: {
        include: ["{src,scripts}/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.js",
    },
})
