const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//

export const assetPath = (fileName) => {
    if (ABSOLUTE_URL_PATTERN.test(fileName)) {
        return fileName
    }

    return `${import.meta.env.BASE_URL}${encodeURI(fileName)}`
}
