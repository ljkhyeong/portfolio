// 이미 인코딩한 경로 뒤에 파일 내용 해시를 붙인다. 버전이 없는 파일은 주소를 그대로 둔다.
export const withAssetVersion = (encodedPath, fileName, versions) =>
    versions?.[fileName] ? `${encodedPath}?v=${versions[fileName]}` : encodedPath
