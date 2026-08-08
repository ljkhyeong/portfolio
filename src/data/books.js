export const bookSections = [
    {
        category: "OS",
        books: [
            {
                key: "ostep",
                title: "Operating Systems: Three Easy Pieces",
                image: "books/ostep.jpg",
                description:
                    "프로세스, 스레드, 스케줄링, 동기화, 가상 메모리, 파일 시스템을 운영체제 관점에서 복습할 때 읽은 책입니다.",
            },
        ],
    },
    {
        category: "Network",
        books: [
            {
                key: "network",
                title: "컴퓨터 네트워킹 하향식 접근",
                image: "books/network.jpg",
                description:
                    "애플리케이션부터 전송, 네트워크 계층까지 TCP/IP 흐름을 서비스 관점에서 이해하는 데 유용했던 책입니다.",
            },
            {
                key: "http-guide",
                title: "HTTP 완벽 가이드",
                image: "books/http-guide.jpg",
                description:
                    "HTTP 메시지, 헤더, 캐시, 프록시, 인증 같은 웹 통신 기본기를 깊게 정리할 때 본 책입니다.",
                studyLink: "https://www.notion.so/LnS-Learn-Share-b3782d6639408242904501146ebbdfdf",
            },
        ],
    },
    {
        category: "Java",
        books: [
            {
                key: "java1",
                title: "자바의 정석",
                image: "books/java1.jpg",
                description:
                    "자바 문법, 객체지향, 컬렉션, 예외 처리 같은 기본기를 체계적으로 다시 정리할 때 본 책입니다.",
            },
            {
                key: "modern-java",
                title: "모던 자바 인 액션",
                image: "books/modern-java.jpg",
                description:
                    "람다, 스트림, Optional, 함수형 스타일을 실무 코드에 어떻게 녹일지 감을 잡는 데 도움이 된 책입니다.",
            },
            {
                key: "effectivejava",
                title: "이펙티브 자바",
                image: "books/effectivejava.jpeg",
                description:
                    "객체 생성, equals/hashCode, 제네릭, 불변성, API 설계 같은 자바다운 코드를 고민할 때 자주 참고한 책입니다.",
                studyLink: "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64",
            },
        ],
    },
    {
        category: "Spring",
        books: [
            {
                key: "tobi-spring",
                title: "토비의 스프링 3.1",
                image: "books/tobi-spring.jpg",
                description:
                    "IoC/DI, 서비스 추상화, AOP, 트랜잭션, 테스트를 스프링 내부 원리와 함께 이해하는 데 가장 도움이 된 책입니다.",
            },
        ],
    },
    {
        category: "General",
        books: [
            {
                key: "clean-code",
                title: "클린 코드",
                image: "books/clean-code.jpg",
                description:
                    "이름 짓기, 함수 분리, 클래스 책임, 테스트 가능성, 리팩토링 감각을 점검할 때 다시 보는 책입니다.",
            },
        ],
    },
]

export const books = bookSections.flatMap((section) => section.books)
