// 메인 첫 화면 소개. 제목은 2026-10-11 사용자가 정한 문장이다. 해 온 일과 근거는 소개 문장에 쓰고,
// 회사 이름은 경력 영역에만 둔다.
// 제목은 구절 사이에서만 줄을 바꾼다. 구절 하나가 화면보다 넓을 때만 그 안에서 줄을 바꾼다.
const headlinePhrases = ["풀스택을 지향하는", "주니어 개발자입니다."]

export const homeHeroContent = {
    headline: headlinePhrases.join(" "),
    headlinePhrases,
    summary:
        "서버에서는 멱등 처리, 동시성 제어, 중단된 작업의 재처리를 주로 구현해 왔고, React와 Next.js로 화면도 만듭니다. 지금은 해양경찰 KICS에서 전자영장 연계 기능과 배치를 개발합니다.",
}
