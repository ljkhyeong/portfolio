import { withAssetVersion } from "./assetVersion"

const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//

// 빌드 설정(vite.config.js)이 public 파일의 내용 해시를 넣는다. 설정 밖에서 불러오면 버전 없이 쓴다.
const ASSET_VERSIONS = typeof __ASSET_VERSIONS__ === "undefined" ? {} : __ASSET_VERSIONS__

export const assetPath = (fileName) => {
    if (ABSOLUTE_URL_PATTERN.test(fileName)) {
        return fileName
    }

    return withAssetVersion(
        `${import.meta.env.BASE_URL}${encodeURI(fileName)}`,
        fileName,
        ASSET_VERSIONS,
    )
}
