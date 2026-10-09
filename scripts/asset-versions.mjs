import { createHash } from "node:crypto"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

// public 최상위의 화면 캡처와 사진은 파일 이름에 해시가 없어 내용을 바꿔도 주소가 같다.
// 그래서 캐시 기간 동안 브라우저가 예전 파일을 보여 준다. 내용 해시를 주소 뒤에 붙여 바뀐 파일만 새로 받게 한다.
// PDF는 인쇄 화면이 자기 주소를 담아 해시가 순환하므로 넣지 않는다. 기본 캐시가 매번 재검증한다.
const VERSIONED_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg"])
const VERSION_LENGTH = 10

export const readAssetVersions = (publicDirectory) =>
    Object.fromEntries(
        readdirSync(publicDirectory, { withFileTypes: true })
            .filter(
                (entry) =>
                    entry.isFile() &&
                    VERSIONED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
            )
            .map((entry) => entry.name)
            .sort()
            .map((name) => [
                name,
                createHash("sha256")
                    .update(readFileSync(path.join(publicDirectory, name)))
                    .digest("hex")
                    .slice(0, VERSION_LENGTH),
            ]),
    )
