// 메인 첫 화면 소개. 어떤 개발자인지 먼저 쓰고, 회사 이름은 경력 영역에만 둔다.
// 제목은 구절 사이에서만 줄을 바꾼다. 구절 하나가 화면보다 넓을 때만 그 안에서 줄을 바꾼다.
const headlinePhrases = ["외부 연동과 배치에서", "중복과 누락을 막는", "Java 백엔드 개발자입니다."]

export const homeHeroContent = {
    headline: headlinePhrases.join(" "),
    headlinePhrases,
    summary:
        "멱등 처리, 동시성 제어, 중단된 작업의 재처리를 주로 구현해 왔습니다. 지금은 5개 기관이 쓰는 전자영장 연계 서버를 개발합니다.",
}
