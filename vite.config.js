import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [react()],
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
