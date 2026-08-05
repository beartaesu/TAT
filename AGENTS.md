# TAT 프로젝트 작업 지침

이 저장소는 TAT 프로젝트의 기준 문서 저장소다.

## 작업 시작 전 필수 절차

TAT 관련 분석, 답변, 수식 작성 또는 변경을 시작하기 전에 아래 문서를 순서대로 모두 읽는다.

1. `docs/01_TAT_MASTER.md`
2. `docs/02_TAT_CURRENT_STATUS.md`
3. `docs/03_TAT_DECISIONS.md`
4. `docs/04_TAT_FORMULAS_ERRORS_HANDOFF.md`

대화 요약이나 기억보다 위 네 문서의 최신 `main` 브랜치 내용을 우선한다. 문서끼리 충돌하면 임의로 판단하지 말고 실제 Power Apps, SharePoint 또는 Power Automate 상태를 사용자에게 확인한다.

## 작업 중 필수 원칙

- Power Apps 수식은 정확한 화면, 트리, 컨트롤, 속성을 먼저 명시한다.
- 변경 부분만 제시하지 않고 기존 속성을 통째로 교체할 수 있는 전체 수식을 제공한다.
- 컨트롤명, SharePoint 열명, Choice 값, Lookup 구조, Flow 매개변수 이름·형식·순서를 추측하지 않는다.
- 한 작업 단위는 확인 → 변경안 제공 → 사용자 테스트 → 결과 기록으로 처리한다.

## 문서 갱신 규칙

다음 중 하나가 발생하면 해당 작업의 다음 안내 전에 01~04 문서를 필요한 범위에서 갱신하고 `main`에 반영한다.

- 수식 추가 또는 교체
- 오류 발생 및 원인 확인
- 테스트 성공 또는 실패
- SharePoint 목록·열·Choice 변경
- Power Automate Flow 구조·입력·출력 변경
- Office Script 변경
- 설계 결정, 보류 또는 폐기
- 다음 작업 위치 변경

문서 역할:

- `01_TAT_MASTER.md`: 통합 설계 기준
- `02_TAT_CURRENT_STATUS.md`: 현재 구현·검증 상태, 오류, 다음 작업
- `03_TAT_DECISIONS.md`: 확정 결정과 금지·보류 원칙
- `04_TAT_FORMULAS_ERRORS_HANDOFF.md`: 전체 수식, Flow 구조, 오류 로그, 인계 내용

문서의 최종 갱신일과 현재 재개 위치도 함께 최신화한다.
