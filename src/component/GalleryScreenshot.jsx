import { assetPath } from "../utils/assetPath"

const GalleryScreenshot = ({ sizes }) => (
    <img
        src={assetPath("happygallery-product-ui.png")}
        sizes={sizes}
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
        alt="happyGallery 공방 상품과 클래스 홈 실행 화면"
    />
)

export default GalleryScreenshot
