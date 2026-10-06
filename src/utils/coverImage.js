// 메인 카드 화면은 표시 폭이 283~590px이라 원본(최대 1440px) 대신 작은 사본을 고르게 한다.
// 사본은 `<이름>-<폭>w.webp`로 두고 npm run cover:variants로 만든다.
export const COVER_VARIANT_WIDTHS = [640, 960]

// 상세 첫 화면과 같은 캡처를 쓰되, 세로 휴대폰 화면처럼 카드에서 일부만 보이는 경우 잘라 둔 이미지를 쓴다.
export const coverImageOf = (shot) => shot.homeImage ?? shot

export const coverVariantsOf = (image) =>
    COVER_VARIANT_WIDTHS.filter((width) => width < image.width).map((width) => ({
        width,
        src: image.src.replace(/\.webp$/, `-${width}w.webp`),
    }))
