import { readFile, readdir, rm, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptPath = fileURLToPath(import.meta.url)
const repositoryRoot = path.resolve(path.dirname(scriptPath), "..")
const buildDirectory = path.join(repositoryRoot, "build")

const legacyAssetPaths = [
    ".DS_Store",
    "205st.png",
    "205st_메인.gif",
    "205st_상품 조회.gif",
    "205st_장바구니.gif",
    "205st_회원가입.gif",
    "API 명세.png",
    "baton-product-ui.png",
    "books/clean-code.jpg",
    "books/effectivejava.jpeg",
    "books/http-guide.jpg",
    "books/java1.jpg",
    "books/modern-java.jpg",
    "books/network.jpg",
    "books/ostep.jpg",
    "books/tobi-spring.jpg",
    "feature-flag.png",
    "favicon.ico",
    "happygallery-product-ui.png",
    "logo192.png",
    "logo512.png",
    "mnd.webp",
    "soccerFor.png",
    "webRTC.png",
    "게시글.gif",
    "기술내용 정리.png",
    "댓글.gif",
    "디버깅 진행도.png",
    "명명규칙.png",
    "선수단 정보.gif",
    "스크래핑.gif",
    "스프링 ERD.png",
    "아키텍처 다이어그램.png",
    "요구사항 명세.png",
    "위키.gif",
    "일일 스크럼 회의록 세부.png",
    "일일 스크럼 회의록.png",
    "종합.png",
    "참고문서 공유.png",
    "화면정의서 초기.jpeg",
    "환경변수 명세.png",
    "회원가입.gif",
]

const sourceTargets = [
    path.join(repositoryRoot, "src"),
    path.join(repositoryRoot, "scripts"),
    path.join(repositoryRoot, "index.html"),
    path.join(repositoryRoot, "public", "manifest.json"),
    path.join(repositoryRoot, "README.md"),
    path.join(repositoryRoot, "package.json"),
    path.join(repositoryRoot, "vite.config.js"),
]

const readSourceFiles = async (target) => {
    const targetStat = await stat(target)

    if (targetStat.isFile()) {
        return target === scriptPath ? [] : [[target, await readFile(target, "utf8")]]
    }

    const entries = await readdir(target, { withFileTypes: true })
    const nestedFiles = await Promise.all(
        entries.map((entry) => readSourceFiles(path.join(target, entry.name))),
    )

    return nestedFiles.flat()
}

const sourceFiles = (await Promise.all(sourceTargets.map(readSourceFiles))).flat()

for (const assetPath of legacyAssetPaths) {
    const sourceReference = sourceFiles.find(([, content]) => content.includes(assetPath))

    if (sourceReference) {
        throw new Error(
            `Legacy asset is referenced again: ${assetPath} (${path.relative(repositoryRoot, sourceReference[0])})`,
        )
    }

    const buildAssetPath = path.resolve(buildDirectory, assetPath)
    const buildPrefix = `${buildDirectory}${path.sep}`

    if (!buildAssetPath.startsWith(buildPrefix)) {
        throw new Error(`Refusing to remove a path outside build/: ${assetPath}`)
    }

    await rm(buildAssetPath, { force: true })
}

console.log(`Pruned ${legacyAssetPaths.length} unreferenced legacy assets from build/`)
