# 원본 저장소

로컬 경로는 `~/devProject/personal/` 기준이다. 공개 여부는 바뀔 수 있으므로 반영 전에 `gh repo view ljkhyeong/<저장소> --json visibility`로 다시 확인한다. 아래 공개 여부는 2026-10-04에 확인한 값이다.

| 포트폴리오 id        | 화면 이름                | 로컬 경로           | GitHub                        | 공개 여부 |
| -------------------- | ------------------------ | ------------------- | ----------------------------- | --------- |
| `baton` (Core)       | BATON                    | `manager`           | `ljkhyeong/baton`             | 공개      |
| `baton` › `go`       | BATON GO                 | `short-url`         | `ljkhyeong/baton-go`          | 공개      |
| `baton` › `watch`    | BATON WATCH              | `baton-watch`       | `ljkhyeong/baton-watch`       | 공개      |
| `baton` › `relay`    | BATON RELAY              | `baton-relay`       | 비공개 저장소                 | 비공개    |
| `baton` › `brief`    | BATON BRIEF              | `baton-brief`       | `ljkhyeong/baton-brief`       | 공개      |
| `baton` › `cal`      | BATON CAL                | `baton-cal`         | `ljkhyeong/baton-cal`         | 공개      |
| `baton` › `round`    | BATON ROUND              | `webRTC`            | `ljkhyeong/webrtc-study`      | 공개      |
| `happygallery`       | happyGallery             | `happyGallery`      | `ljkhyeong/happyGallery`      | 공개      |
| `youth-policy-mate`  | 청년정책메이트           | `youth-policy-mate` | `ljkhyeong/youth-policy-mate` | 공개      |
| `hope-commit`        | Hope Commit              | `hope-commit`       | `ljkhyeong/hope-commit`       | 공개      |
| `intent-trace`       | IntentTrace              | `intent-trace`      | `ljkhyeong/intent-trace`      | 공개      |
| `webrtc`             | WebRTC/HLS 현장강의 보조 | 없음                | `TeamyRoom/TMeRoom-HLSServer` | 팀 저장소 |
| `warrant`, `defense` | 경력 프로젝트            | 없음                | 없음                          | 회사 자료 |

## 주의

-   `manager-brief-edition-carryover`, `manager-brief-summary`, `manager-cal-subscription`은 `manager`의 작업용 worktree다. 기준 리비전으로 쓰지 않는다.
-   `hope-commit-independent-*.backup`은 백업 사본이다.
-   `scam-shop-radar`는 2026-09-08 기준 README와 기획 문서만 있어 구현 프로젝트로 추가하지 않았다. 다시 확인할 때도 실제 구현 커밋이 있는지부터 본다.
-   비공개 저장소의 내용은 포트폴리오가 이미 공개한 수준까지만 설명하고, 코드나 내부 문서 링크를 새로 공개하지 않는다.
-   경력 프로젝트(`warrant`, `defense`)는 원본 저장소가 없다. 사용자가 제공한 구현과 테스트 결과만 반영하고, 회사 비공개 자료를 추측해 채우지 않는다.
-   Hope Commit은 SeungIl 님의 Hope에서 파생한 비공식 포크라는 고지를 유지한다.
