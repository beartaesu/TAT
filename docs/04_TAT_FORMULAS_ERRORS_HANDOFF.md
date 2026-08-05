# 04 TAT FORMULAS · ERRORS · HANDOFF

최종 갱신: 2026-08-05

## 1. 최신 변경 수식 상태

아래 2026-08-04 수동 처리 수식은 이력 보존용이며 현재 적용본이 아니다. 2026-08-05에는 `TAT_결과파일생성_App` 변경 모드를 호출하는 전체 수식으로 교체했고 Power Apps 문법 오류가 사라졌다. 최신 전체 수식 원문은 다음 문서 갱신 시 현재 Power Apps의 실제 수식과 대조하여 완전본으로 다시 기록한다.

### 위치

```text
Power Apps
└─ scr접수상세
   └─ con구분변경패널
      └─ btn구분변경실행
         └─ OnSelect
```

### 적용 방법

기존 `btn구분변경실행.OnSelect` 수식을 전부 삭제하고 아래 전체 수식으로 교체한다.

```powerfx
If(
    !var관리자,
    Notify(
        "의뢰구분 변경 권한이 없습니다.",
        NotificationType.Error
    ),
    IsBlank(Trim(txt구분변경사유.Text)),
    Notify(
        "구분 변경 사유를 입력해 주세요.",
        NotificationType.Warning
    ),
    !(
        var상세접수.의뢰구분.Value = "미접수" ||
        var상세접수.의뢰구분.Value = "측정인"
    ),
    Notify(
        "과제 접수는 의뢰구분을 변경할 수 없습니다.",
        NotificationType.Warning
    ),
    IfError(
        Set(
            var변경전의뢰구분,
            var상세접수.의뢰구분.Value
        );
        Set(
            var변경후의뢰구분,
            If(
                var변경전의뢰구분 = "미접수",
                "측정인",
                "미접수"
            )
        );
        Set(
            var변경전접수번호,
            var상세접수.제목
        );
        Set(
            var구분변경번호응답,
            접수번호발급_App.Run(
                var변경후의뢰구분,
                Text(
                    var상세접수.의뢰일자,
                    "yyyy-mm-dd"
                ),
                0
            )
        );
        Set(
            var변경후접수번호,
            var구분변경번호응답.접수번호
        );
        If(
            IsBlank(Trim(var변경후접수번호)),
            Notify(
                "새 접수번호를 발급하지 못했습니다.",
                NotificationType.Error
            ),
            Set(
                var상세접수,
                Patch(
                    접수헤더,
                    LookUp(
                        접수헤더,
                        ID = var상세접수.ID
                    ),
                    {
                        제목: var변경후접수번호,
                        의뢰구분: {
                            Value: var변경후의뢰구분
                        },
                        이전접수번호: var변경전접수번호,
                        최초접수번호: Coalesce(
                            var상세접수.최초접수번호,
                            var변경전접수번호
                        ),
                        최초의뢰구분: If(
                            IsBlank(var상세접수.최초의뢰구분.Value),
                            {
                                Value: var변경전의뢰구분
                            },
                            var상세접수.최초의뢰구분
                        ),
                        구분변경여부: true,
                        최종구분변경일: Now(),
                        폴더처리상태: {
                            Value: "수동처리대기"
                        },
                        폴더처리오류: Blank()
                    }
                )
            );
            ForAll(
                Filter(
                    접수시료항목매핑,
                    접수헤더연결.Id = var상세접수.ID
                ) As 현재매핑,
                Patch(
                    접수시료항목매핑,
                    LookUp(
                        접수시료항목매핑,
                        ID = 현재매핑.ID
                    ),
                    {
                        제목: Substitute(
                            현재매핑.제목,
                            var변경전접수번호,
                            var변경후접수번호
                        )
                    }
                )
            );
            Patch(
                접수구분변경이력,
                Defaults(접수구분변경이력),
                {
                    제목: var변경전접수번호 &
                        " → " &
                        var변경후접수번호,
                    접수헤더연결: LookUp(
                        Choices(접수구분변경이력.접수헤더연결),
                        Id = var상세접수.ID
                    ),
                    변경전구분: {
                        Value: var변경전의뢰구분
                    },
                    변경후구분: {
                        Value: var변경후의뢰구분
                    },
                    변경전접수번호: var변경전접수번호,
                    변경후접수번호: var변경후접수번호,
                    변경일시: Now(),
                    변경자: User().FullName &
                        " (" &
                        User().Email &
                        ")",
                    처리결과: {
                        Value: "처리중"
                    },
                    변경사유: Trim(txt구분변경사유.Text)
                }
            );
            Refresh(접수헤더);
            Refresh(접수시료항목매핑);
            Refresh(접수구분변경이력);
            Set(
                var구분변경패널,
                false
            );
            Reset(txt구분변경사유);
            Notify(
                "의뢰구분을 '" &
                var변경후의뢰구분 &
                "'으로 변경했습니다." &
                Char(10) &
                "새 접수번호: " &
                var변경후접수번호 &
                Char(10) &
                "NAS 폴더와 결과 Excel 파일명을 수동으로 변경해 주세요.",
                NotificationType.Success
            )
        ),
        Notify(
            "의뢰구분 변경 중 오류가 발생했습니다: " &
            FirstError.Message,
            NotificationType.Error
        )
    )
)
```

### 이 수식의 핵심 결과 — 구버전 기록

- 새 접수번호 발급
- 접수헤더의 접수번호와 의뢰구분 변경
- 최초·이전 접수번호 보존
- `접수헤더.폴더처리상태 = 수동처리대기`
- 매핑 제목의 이전 접수번호를 신규 번호로 치환
- 매핑 Lookup 유지
- `접수구분변경이력.처리결과 = 처리중`
- NAS 폴더와 결과 Excel 파일명은 수동 변경 안내

## 2. 접수현황 안내 문구

### 위치

```text
scr접수현황 > lbl접수현황빈안내 > Text
```

### 전체 수식

```powerfx
If(
    CountRows(gal접수현황.AllItems) = 0,
    "현재 조회할 접수가 없습니다.",
    "조회하거나 수정할 접수를 선택하세요."
)
```

## 3. 결과파일 생성 자동화 기록

목표 변수:

- 상위 폴더
- 폴더명: 접수번호와 현장명 기반
- 파일명: `접수번호_결과입력.xlsx`
- 반환값: 결과폴더명, 결과폴더경로, 결과엑셀파일명, 결과엑셀파일경로

Office Script 확인:

- B3 업체명 기록 성공
- B4 의뢰번호 기록 성공
- 분석항목 10개 단위 블록 확장 설계

주의: 현재 Flow `.Run(...)` 매개변수 시그니처는 기록이 충돌하므로 실제 연결에서 재확인한다.

## 4. 오류 로그

### 2026-08-05 TriggerInputSchemaMismatch 및 15개 인수 오류

1차 증상:

- 구분변경 실행 시 Power Apps에 다수의 연쇄 오류 표시
- 핵심 메시지: `TriggerInputSchemaMismatch`
- Flow 실행 기록이 생성되지 않음

대응:

- Flow 첫 인수를 `Round(Value(var상세접수.ID), 0)`으로 숫자 고정
- 나머지 입력을 `Text(...)`로 텍스트 고정
- 존재하지 않는 `var상세접수.현장명` 참조 제거
- 기존 `결과폴더명`에서 `이전접수번호 & "-"`를 제거해 현장명 전달
- 앱 재시작 후 Power Apps 문법 오류 제거 확인

2차 증상:

- 새 접수 최종저장 시 헤더와 분석항목만 저장
- 결과 폴더·Excel 미생성
- Flow 실행 기록 없음
- Flow 연결 새로고침 후 `15개의 인수가 필요한데 10개를 받았습니다` 오류 확인

판단:

- Power Apps가 최신 Flow 정의를 정상 인식함
- 실제 최종저장 `OnSelect`의 기존 `.Run(...)` 호출은 10개 인수 구조
- Power Apps (V2)의 15개 입력 이름·형식·순서를 확정한 뒤 모든 호출부를 전체 수식으로 교체해야 함
- 확인 전 5개 인수를 임의로 추가하지 않음

### 2026-07-29 메타데이터 조회 대기

증상:

- 실패 표시는 없으나 6분 이상 대기
- Flow를 껐다 켜도 정상화되지 않음

입력:

```json
{
  "host": {
    "connectionReferenceName": "shared_sharepointonline",
    "operationId": "GetFileMetadataByPath"
  },
  "parameters": {
    "dataset": "https://erfxxam.sharepoint.com/sites/O365_msteams_5b3dce",
    "path": null
  }
}
```

판단:

- `GetFileMetadataByPath`에 전달된 `path`가 null
- 앞 단계가 반환한 경로 또는 Compose/변수 참조를 점검해야 함
- URL을 직접 조합하기 전에 SharePoint 액션이 요구하는 서버 상대 경로 형식을 확인해야 함

## 5. 다음 대화 시작문

아래 네 MD 파일을 새 대화에 첨부하고 다음 문장을 그대로 사용한다.

```text
첨부한 TAT 프로젝트 최신 문서 4개를 먼저 전부 읽고, 문서에 기록된 현재 상태 이후부터 이어서 진행해줘.

이번 대화의 첫 작업은 TAT_결과파일생성_App의 Power Apps (V2) 트리거 입력값 15개를 확인하고,
실제 최종저장 버튼 > OnSelect의 모든 Flow 호출을 15개 인수에 맞춘 전체 교체 수식으로 수정하는 것이야.

확인 순서는 다음과 같아.
1. Power Apps (V2) 입력값 15개의 이름·형식·순서
2. 최종저장 OnSelect 전체 수식의 Flow 호출부 개수
3. 15개 인수 적용 후 Power Apps 수식 오류 유무
4. 새 테스트 접수의 Flow 실행 기록
5. 결과 폴더·Excel 생성 및 반환 경로 Patch
6. 그 다음 새 테스트 건의 미접수↔측정인 변경 자동화

검증이 끝나면 결과파일 생성 Flow에서 ‘경로를 사용하여 파일 메타데이터 가져오기’의 path가 null이 되어 멈추는 문제를 이어서 진단해줘.

Power Apps 수식을 변경할 때는 반드시 정확한 화면·트리·컨트롤·속성을 먼저 적고, 일부 삽입 코드가 아니라 기존 수식을 통째로 교체할 수 있는 전체 수식으로 제공해줘. 모르는 컨트롤명, SharePoint 열명, Choice 값, Flow 매개변수는 추측하지 말고 먼저 나에게 확인해줘. 작업 완료마다 01~04 MD를 최신화해줘.
```

## 6. 새 대화에서 반드시 지킬 인계사항

- 최신 확인 없이 과거 Flow 매개변수를 사용하지 않는다.
- 구분변경 자동화는 `처리중 → 처리완료/처리실패` 상태 흐름을 사용한다.
- 과거 `수동처리대기`와 NAS 수동 변경 안내를 현재 설계에 다시 적용하지 않는다.
- 사용자가 수식을 요청하면 기본적으로 전체 교체본을 제공한다.
- 오류·수식 변경·테스트 결과가 생기면 답변 전에 01~04 MD를 갱신한다.
