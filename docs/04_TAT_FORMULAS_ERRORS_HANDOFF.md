# 04 TAT FORMULAS · ERRORS · HANDOFF

최종 갱신: 2026-08-10

## 문서 역할과 갱신 기준

- 역할: 다음 세션에서 그대로 실행·검증할 수 있는 수식, Flow 표현식, 오류, 인계 자료
- 포함: 정확한 화면·트리·컨트롤·속성, 최신 전체 수식, Flow 입력·출력, 오류 원인·해결 결과
- 제외: 최신 여부가 불명확한 수식, 장기 설계의 반복 설명, 근거 없는 추정
- 갱신: 수식 또는 Flow 표현식이 추가·교체되거나 오류 원인·해결·검증 결과가 바뀔 때
- 모든 수식은 `최신 적용본`, `제안/미적용`, `구버전·적용 금지` 중 하나로 표시한다.
- 최신 전체 원문을 확보하지 못한 경우 원문을 추측하지 않고 `원문 미보존·실제 앱에서 재확인 필요`로 기록한다.

## 1. 수식 상태 구분 — 반드시 확인

### 1.1 최신 적용본

#### `btn구분변경실행.OnSelect`

- 상태: **최신 적용본이나 전체 원문 미보존**
- 위치: `scr접수상세 > con구분변경패널 > btn구분변경실행 > OnSelect`
- 적용 사실: 2026-08-05 `TAT_결과파일생성_App`의 변경 모드를 15개 인수로 호출하도록 교체했고 Power Apps 문법 오류가 사라졌다.
- 실행 사실: 첫 실행은 Excel 잠금으로 실패했지만 재제출 후 실제 폴더 이동과 폴더·Excel 파일명 변경은 성공했다.
- 미완료: Flow 내부 접수헤더 갱신, 변경이력 최종 갱신, 잠금 조건부 재시도, 응답 파일명 수식 교정
- 주의: 현재 적용된 전체 PowerFx 원문은 저장소에 완전본으로 남아 있지 않다. 다음 변경 전에 실제 Power Apps에서 전체 수식을 다시 확보해야 하며, 아래 구버전을 바탕으로 복원하거나 추측하지 않는다.

#### `btn최종저장.OnSelect`

- 상태: **최신 전체 원문 보존 및 신규 저장 검증 완료**
- 위치: `scr검토저장 > btn최종저장 > OnSelect`
- 기준 파일: [`formulas/scr검토저장_btn최종저장_OnSelect.powerfx`](../formulas/scr검토저장_btn최종저장_OnSelect.powerfx)
- 검증: Flow 호출부 4곳의 15개 인수 오류와 문법 오류 해소, 신규 결과 폴더·Excel 생성 및 접수헤더 연결 성공

#### Flow 응답 수식

- 상태: **제안/미적용**
- 이 문서의 ‘향후 교체할 Power Apps 응답 수식’ 4개는 실제 적용 완료본이 아니다.
- 실제 Flow에 반영하고 테스트하기 전까지 최신 적용본으로 취급하지 않는다.

#### `dd접수상태필터.Items`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > dd접수상태필터 > Items`
- 검증: `전체`, `임시작성`, `접수완료`, `접수취소` 모두 정상

```powerfx
[
    "전체",
    "임시작성",
    "접수완료",
    "접수취소"
]
```

#### `dd접수상태필터.Default`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > dd접수상태필터 > Default`

```powerfx
"전체"
```

#### `gal접수현황.Items` — 접수상태 필터만 적용한 이전본

- 상태: **구버전·적용 금지**
- 위치: `scr접수현황 > con접수현황전체 > gal접수현황 > Items`
- 과거 검증: 상태 필터 네 선택지 모두 정상
- 주의: 아래 수식은 접수상태 필터만 적용한 이전본이다. 2026-08-05 접수번호 검색 필터 추가 후에는 아래 `txt접수현황검색` 반영 수식을 최신 적용본으로 사용한다.

```powerfx
SortByColumns(
    Filter(
        접수헤더,
        dd접수상태필터.Selected.Value = "전체" ||
        접수상태.Value = dd접수상태필터.Selected.Value
    ),
    "ID",
    SortOrder.Descending
)
```

#### `txt접수현황검색.HintText`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > txt접수현황검색 > HintText`

```powerfx
"접수번호, 시료명, 업체/현장명 검색"
```

#### `txt접수현황검색.Default`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > txt접수현황검색 > Default`

```powerfx
""
```

#### `gal접수현황.Items` — 접수상태 필터 + 접수번호 검색

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > gal접수현황 > Items`
- 검증: 검색창 빈 상태, `전체`, `임시작성`, `접수완료`, `접수취소` 상태 필터와 접수번호 검색 조합, 상세보기 이동 모두 정상
- 주의: 업체/현장명, 시료명 요약 검색은 실제 SharePoint 열명·Lookup 표시 구조 확인 전까지 추가하지 않는다.

```powerfx
SortByColumns(
    Filter(
        접수헤더,
        (
            dd접수상태필터.Selected.Value = "전체" ||
            접수상태.Value = dd접수상태필터.Selected.Value
        ) &&
        (
            IsBlank(Trim(txt접수현황검색.Text)) ||
            Trim(txt접수현황검색.Text) in 제목
        )
    ),
    "ID",
    SortOrder.Descending
)
```

#### `btn접수현황필터초기화.Text`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > btn접수현황필터초기화 > Text`

```powerfx
"초기화"
```

#### `btn접수현황필터초기화.OnSelect`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > btn접수현황필터초기화 > OnSelect`
- 검증: 상태 필터 초기화, 검색어 초기화, 상태+검색 동시 초기화, 초기화 후 전체 목록 표시, 상세보기 이동 모두 정상

```powerfx
Reset(dd접수상태필터);
Reset(txt접수현황검색)
```

#### `lbl접수현황조회건수.Text`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr접수현황 > con접수현황전체 > con접수현황헤더 > lbl접수현황조회건수 > Text`
- 검증: 기본 조회 건수 표시, 상태 필터별 건수 변경, 검색어 적용 시 건수 변경, 초기화 후 전체 건수 복원, 상세보기 이동 모두 정상

```powerfx
"조회 " &
Text(
    CountRows(gal접수현황.AllItems),
    "[$-ko-KR]#,##0"
) &
"건"
```

#### `scr분석진행` 기본 레이아웃 및 갤러리

- 상태: **최신 적용본 및 사용자 검증 완료**
- 검증: 화면 여백, 헤더·도구·목록 자동 배치, 갤러리 행과 스크롤 표시 정상

##### `con분석진행전체`

- 위치: `scr분석진행 > con분석진행전체`

| 속성 | 전체 수식 |
|---|---|
| `X` | `24` |
| `Y` | `20` |
| `Width` | `Parent.Width - 48` |
| `Height` | `Parent.Height - 40` |
| `LayoutGap` | `8` |
| `PaddingTop` | `12` |
| `PaddingBottom` | `12` |
| `PaddingLeft` | `12` |
| `PaddingRight` | `12` |

##### 내부 영역 크기

| 위치 | 속성 | 전체 수식 |
|---|---|---|
| `con분석진행헤더` | `Height` | `64` |
| `con분석진행헤더` | `FillPortions` | `0` |
| `con분석진행헤더` | `AlignInContainer` | `AlignInContainer.Stretch` |
| `con분석진행도구` | `Height` | `72` |
| `con분석진행도구` | `FillPortions` | `0` |
| `con분석진행도구` | `AlignInContainer` | `AlignInContainer.Stretch` |
| `con분석진행목록` | `FillPortions` | `1` |
| `con분석진행목록` | `AlignInContainer` | `AlignInContainer.Stretch` |
| `con분석진행목록헤더` | `Height` | `48` |
| `con분석진행목록헤더` | `FillPortions` | `0` |
| `con분석진행목록헤더` | `AlignInContainer` | `AlignInContainer.Stretch` |
| `gal분석진행항목` | `FillPortions` | `1` |
| `gal분석진행항목` | `AlignInContainer` | `AlignInContainer.Stretch` |

##### `lbl분석진행제목.Text`

- 위치: `scr분석진행 > con분석진행전체 > con분석진행헤더 > lbl분석진행제목 > Text`

```powerfx
"분석 진행"
```

##### `gal분석진행항목.Items`

- 위치: `scr분석진행 > con분석진행전체 > con분석진행목록 > gal분석진행항목 > Items`

```powerfx
SortByColumns(
    접수항목상세,
    "ID",
    SortOrder.Descending
)
```

##### `lbl분석진행시료명요약.Text`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행목록 > gal분석진행항목 > lbl분석진행시료명요약 > Text`
- 오류 원인: `접수헤더`의 실제 PowerFx 열명은 `시료명요약`이 아니라 공백이 포함된 `'시료명 요약'`이다.
- 근거: 최신 최종저장 전체 수식에서 `Patch(접수헤더, ..., {'시료명 요약': ...})` 형식으로 사용 중이다.

```powerfx
Coalesce(
    LookUp(
        접수헤더,
        ID = ThisItem.접수헤더연결.Id,
        '시료명 요약'
    ),
    ""
)
```

##### `gal분석진행항목` 업무 열 레이블

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행목록 > gal분석진행항목`
- 검증: 의뢰번호·시료명요약·분석항목·수량 값 표시 정상. 레이블 위치와 크기 정렬은 다음 작업이다.

###### `lbl분석진행의뢰번호.Text`

```powerfx
ThisItem.접수헤더연결.Value
```

###### `lbl분석진행분석항목.Text`

```powerfx
ThisItem.분석항목.Value
```

###### `lbl분석진행수량.Text`

```powerfx
Text(
    ThisItem.수량,
    "[$-ko-KR]#,##0"
)
```

##### `gal분석진행항목` 행 및 열 정렬

- 상태: **최신 적용본 및 사용자 검증 완료**
- 검증: 의뢰번호·시료명요약·분석항목·수량이 한 행에 겹침 없이 표시되고 세로 스크롤 정상

###### `gal분석진행항목.TemplateSize`

```powerfx
56
```

###### `lbl분석진행의뢰번호`

| 속성 | 전체 수식 |
|---|---|
| `X` | `48` |
| `Y` | `0` |
| `Width` | `(Parent.TemplateWidth - 64) * 0.22` |
| `Height` | `Parent.TemplateHeight` |
| `Wrap` | `false` |
| `VerticalAlign` | `VerticalAlign.Middle` |

###### `lbl분석진행시료명요약`

| 속성 | 전체 수식 |
|---|---|
| `X` | `lbl분석진행의뢰번호.X + lbl분석진행의뢰번호.Width` |
| `Y` | `0` |
| `Width` | `(Parent.TemplateWidth - 64) * 0.42` |
| `Height` | `Parent.TemplateHeight` |
| `Wrap` | `false` |
| `VerticalAlign` | `VerticalAlign.Middle` |

###### `lbl분석진행분석항목`

| 속성 | 전체 수식 |
|---|---|
| `X` | `lbl분석진행시료명요약.X + lbl분석진행시료명요약.Width` |
| `Y` | `0` |
| `Width` | `(Parent.TemplateWidth - 64) * 0.24` |
| `Height` | `Parent.TemplateHeight` |
| `Wrap` | `false` |
| `VerticalAlign` | `VerticalAlign.Middle` |

###### `lbl분석진행수량`

| 속성 | 전체 수식 |
|---|---|
| `X` | `lbl분석진행분석항목.X + lbl분석진행분석항목.Width` |
| `Y` | `0` |
| `Width` | `Parent.TemplateWidth - Self.X - 16` |
| `Height` | `Parent.TemplateHeight` |
| `Wrap` | `false` |
| `VerticalAlign` | `VerticalAlign.Middle` |
| `Align` | `Align.Center` |

##### `con분석진행목록헤더` 열 제목

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행목록 > con분석진행목록헤더`
- 공통: `AlignInContainer = AlignInContainer.Stretch`, `VerticalAlign = VerticalAlign.Middle`, `FontWeight = FontWeight.Semibold`, `Wrap = false`, `PaddingLeft = 8`. 앞의 네 레이블은 `FillPortions = 0`, 수량 레이블은 `FillPortions = 1`을 사용한다.

| 컨트롤 | `Text` | `Width` | `Align` |
|---|---|---|---|
| `lbl분석진행헤더선택` | `"선택"` | `48` | `Align.Center` |
| `lbl분석진행헤더의뢰번호` | `"의뢰번호"` | `(gal분석진행항목.TemplateWidth - 64) * 0.22` | `Align.Left` |
| `lbl분석진행헤더시료명요약` | `"시료명요약"` | `(gal분석진행항목.TemplateWidth - 64) * 0.42` | `Align.Left` |
| `lbl분석진행헤더분석항목` | `"분석항목"` | `(gal분석진행항목.TemplateWidth - 64) * 0.24` | `Align.Left` |
| `lbl분석진행헤더수량` | `"수량"` | 남은 영역을 사용하도록 `FillPortions = 1` | `Align.Center` |

##### `chk분석진행항목선택`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행목록 > gal분석진행항목 > chk분석진행항목선택`
- 검증: 개별 체크·해제, 컬렉션 중복 방지, 스크롤 후 체크 상태 유지 정상

###### `OnCheck`

```powerfx
With(
    {
        var선택항목ID: ThisItem.ID
    },
    If(
        IsBlank(
            LookUp(
                col분석진행선택,
                ID = var선택항목ID
            )
        ),
        Collect(
            col분석진행선택,
            ThisItem
        )
    )
);
Reset(
    chk분석진행전체선택
)
```

###### `OnUncheck`

```powerfx
With(
    {
        var선택항목ID: ThisItem.ID
    },
    RemoveIf(
        col분석진행선택,
        ID = var선택항목ID
    )
);
Reset(
    chk분석진행전체선택
)
```

###### `Default`

```powerfx
!IsBlank(
    LookUp(
        col분석진행선택,
        ID = ThisItem.ID
    )
)
```

###### 위치·크기 최신 적용값

| 속성 | 전체 수식 |
|---|---|
| `Text` | `""` |
| `X` | `0` |
| `Y` | `0` |
| `Width` | `48` |
| `Height` | `Parent.TemplateHeight` |
| `CheckboxSize` | `36` |
| `PaddingLeft` | `6` |
| `PaddingRight` | `6` |
| `PaddingTop` | `0` |
| `PaddingBottom` | `0` |

##### 목록 헤더·갤러리 최종 정렬 보정

- 상태: **최신 적용본 및 사용자 검증 완료**
- `con분석진행목록헤더`: `LayoutGap = 0`, 네 방향 `Padding = 0`
- 선택·수량 헤더: 좌우 패딩 `0`, `Align.Center`
- 의뢰번호·시료명요약·분석항목 헤더 및 행 레이블: `PaddingLeft = 8`, 나머지 패딩 `0`
- `lbl분석진행헤더수량.FillPortions = 0`
- `lbl분석진행헤더수량.Width`:

```powerfx
gal분석진행항목.TemplateWidth -
48 -
((gal분석진행항목.TemplateWidth - 64) * 0.22) -
((gal분석진행항목.TemplateWidth - 64) * 0.42) -
((gal분석진행항목.TemplateWidth - 64) * 0.24) -
16
```

- `gal분석진행항목.TemplatePadding = 0`

##### `lbl분석진행선택건수`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행도구 > lbl분석진행선택건수 > Text`
- 검증: 선택·해제와 스크롤 후에도 현재 컬렉션 건수를 정상 표시

```powerfx
"선택 " &
Text(
    CountRows(col분석진행선택),
    "[$-ko-KR]#,##0"
) &
"건"
```

###### 표시 속성

| 속성 | 전체 수식 |
|---|---|
| `Width` | `120` |
| `FillPortions` | `0` |
| `AlignInContainer` | `AlignInContainer.Stretch` |
| `Align` | `Align.Center` |
| `VerticalAlign` | `VerticalAlign.Middle` |
| `Wrap` | `false` |

##### 2026-08-07 세션 종료 재개점

- 완료: `scr분석진행` 기본 레이아웃, `접수항목상세` 갤러리, 의뢰번호·`'시료명 요약'`·분석항목·수량 표시, 헤더·행 정렬, 개별 선택 컬렉션, 선택 건수 표시
- 다음 작업 1: 전체선택의 대상을 현재 조회 결과로 할지 최종 확정
- 다음 작업 2: `chk분석진행전체선택` 구현
- 다음 작업 3: 분석완료일 선택기와 실행 버튼 구현
- 다음 작업 4: 선택 행만 상태·완료일 갱신하고 미선택 행은 유지되는지 검증

##### `chk분석진행전체선택`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행도구 > chk분석진행전체선택`
- 범위: SharePoint 전체가 아니라 `gal분석진행항목.AllItems`에 현재 로드된 조회 행
- 검증: 전체선택·전체해제, 개별 선택과 상단 체크 동기화, 선택 건수, 스크롤 후 상태 유지 정상

###### `OnCheck`

```powerfx
ClearCollect(
    col분석진행선택,
    gal분석진행항목.AllItems
);
Set(
    var분석진행행선택Reset,
    !Coalesce(
        var분석진행행선택Reset,
        false
    )
)
```

###### `OnUncheck`

```powerfx
Clear(
    col분석진행선택
);
Set(
    var분석진행행선택Reset,
    !Coalesce(
        var분석진행행선택Reset,
        false
    )
)
```

###### `Default`

```powerfx
CountRows(
    gal분석진행항목.AllItems
) > 0 &&
CountRows(
    Filter(
        gal분석진행항목.AllItems As 현재항목,
        !IsBlank(
            LookUp(
                col분석진행선택,
                ID = 현재항목.ID
            )
        )
    )
) =
CountRows(
    gal분석진행항목.AllItems
)
```

###### 행 체크박스 동기화 속성

- `chk분석진행항목선택.Reset`:

```powerfx
var분석진행행선택Reset
```

##### 분석완료일 입력 컨트롤

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행도구`
- 검증: 오늘 날짜 기본 표시, 달력 날짜 변경 및 유지, 기존 전체선택·선택 건수 기능 정상

###### `lbl분석진행완료일`

| 속성 | 전체 수식 |
|---|---|
| `Text` | `"분석완료일"` |
| `Width` | `110` |
| `FillPortions` | `0` |
| `AlignInContainer` | `AlignInContainer.Stretch` |
| `Align` | `Align.Right` |
| `VerticalAlign` | `VerticalAlign.Middle` |
| `Wrap` | `false` |

###### `dp분석일`

| 속성 | 전체 수식 |
|---|---|
| `DefaultDate` | `Today()` |
| `Width` | `180` |
| `FillPortions` | `0` |
| `AlignInContainer` | `AlignInContainer.Stretch` |
| `Format` | `DateTimeFormat.ShortDate` |
| `StartYear` | `Year(Today()) - 1` |
| `EndYear` | `Year(Today()) + 1` |

##### `접수항목상세.분석상태` Choice 확인

- 상태: **사용자 실제 SharePoint 열 설정 확인 완료**
- 확인일: 2026-08-10
- 값: `대기`, `분석 중`, `분석완료`, `보류`
- 일괄 완료 버튼에서 사용할 정확한 값: `분석완료`

##### `btn분석진행완료처리.OnSelect`

- 상태: **최신 적용본 및 사용자 검증 완료**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행도구 > btn분석진행완료처리 > OnSelect`
- 검증: 선택 행의 `분석상태 = 분석완료`, `분석완료일 = dp분석일.SelectedDate`가 SharePoint `접수항목상세`에 정상 반영

```powerfx
If(
    CountRows(col분석진행선택) = 0,
    Notify(
        "분석완료 처리할 항목을 선택해 주세요.",
        NotificationType.Warning
    ),
    IsBlank(dp분석일.SelectedDate),
    Notify(
        "분석완료일을 선택해 주세요.",
        NotificationType.Warning
    ),
    Set(
        var분석완료처리건수,
        CountRows(col분석진행선택)
    );
    Set(
        var분석완료처리성공,
        IfError(
            ForAll(
                col분석진행선택 As 선택항목,
                Patch(
                    접수항목상세,
                    LookUp(
                        접수항목상세,
                        ID = 선택항목.ID
                    ),
                    {
                        분석상태: {
                            Value: "분석완료"
                        },
                        분석완료일:
                            dp분석일.SelectedDate
                    }
                )
            );
            Refresh(접수항목상세);
            true,
            Notify(
                "분석완료 처리 중 오류가 발생했습니다: " &
                FirstError.Message,
                NotificationType.Error
            );
            false
        )
    );
    If(
        var분석완료처리성공,
        Clear(
            col분석진행선택
        );
        Set(
            var분석진행행선택Reset,
            !Coalesce(
                var분석진행행선택Reset,
                false
            )
        );
        Reset(
            chk분석진행전체선택
        );
        Notify(
            Text(
                var분석완료처리건수,
                "[$-ko-KR]#,##0"
            ) &
            "개 분석항목을 분석완료 처리했습니다." &
            Char(10) &
            "분석완료일: " &
            Text(
                dp분석일.SelectedDate,
                "[$-ko-KR]yyyy년 m월 d일"
            ),
            NotificationType.Success
        )
    )
)
```

##### `scr분석진행` 필터 컨트롤

- 상태: **컨트롤 및 갤러리 조합 필터 적용, 상세 조합 검증 진행 중**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행필터`
- 컨트롤: `cmb분석진행업체필터`, `dd분석진행월필터`, `cmb분석진행분석항목필터`
- UI 보정 완료: `con분석진행필터`를 `con분석진행도구` 위로 이동하고 세 필터에 `AlignInContainer = AlignInContainer.Center`를 적용해 높이·수직 정렬 통일

###### `cmb분석진행업체필터.Items`

```powerfx
Choices(
    접수헤더.'업체/현장'
)
```

###### `dd분석진행월필터.Items`

```powerfx
ForAll(
    Sequence(25) As 월순번,
    With(
        {
            기준월:
                DateAdd(
                    Date(
                        Year(Today()),
                        Month(Today()),
                        1
                    ),
                    2 - 월순번.Value,
                    TimeUnit.Months
                )
        },
        {
            표시:
                If(
                    월순번.Value = 1,
                    "전체",
                    Text(
                        기준월,
                        "[$-ko-KR]yyyy년 m월"
                    )
                ),
            월시작:
                If(
                    월순번.Value = 1,
                    Blank(),
                    기준월
                )
        }
    )
)
```

###### `cmb분석진행분석항목필터.Items`

```powerfx
Choices(
    접수항목상세.분석항목
)
```

###### `gal분석진행항목.Items` — 업체/현장 + 월 + 분석항목

- 상태: **최신 적용본, 사용자 구현 확인 및 상세 조합 검증 진행 중**
- 위치: `scr분석진행 > con분석진행전체 > con분석진행목록 > gal분석진행항목 > Items`
- 사용자 확인: Power Apps에 위임 경고 표시
- 원인: 연결 헤더를 행별 `LookUp`하는 교차 목록 조회는 SharePoint에 위임되지 않는다.
- 영향: Power Apps 데이터 행 제한을 넘는 경우 과거 월 또는 일부 업체 행이 조회·전체선택·완료 처리에서 누락될 수 있다.

```powerfx
With(
    {
        var선택업체ID:
            cmb분석진행업체필터.Selected.Id,
        var선택월시작:
            dd분석진행월필터.Selected.월시작,
        var선택분석항목ID:
            cmb분석진행분석항목필터.Selected.Id
    },
    SortByColumns(
        Filter(
            접수항목상세 As 현재항목,
            With(
                {
                    var현재접수헤더:
                        LookUp(
                            접수헤더,
                            ID =
                                현재항목.접수헤더연결.Id
                        )
                },
                (
                    IsBlank(var선택업체ID) ||
                    var현재접수헤더.'업체/현장'.Id =
                        var선택업체ID
                ) &&
                (
                    IsBlank(var선택월시작) ||
                    (
                        var현재접수헤더.의뢰일자 >=
                            var선택월시작 &&
                        var현재접수헤더.의뢰일자 <
                            DateAdd(
                                var선택월시작,
                                1,
                                TimeUnit.Months
                            )
                    )
                ) &&
                (
                    IsBlank(var선택분석항목ID) ||
                    현재항목.분석항목.Id =
                        var선택분석항목ID
                )
            )
        ),
        "ID",
        SortOrder.Descending
    )
)
```

###### 위임 경고 안정화안

- 상태: **SharePoint 열 생성 및 저장소 수식 보완 완료, Power Apps 적용·검증 대기**
- `접수항목상세`에 다음 복사 열을 추가한다.
  - `의뢰일자복사`: 날짜 전용
  - `업체현장ID복사`: 숫자
  - `업체현장명복사`: 한 줄 텍스트
  - `시료명요약복사`: 한 줄 텍스트
  - `분석항목ID복사`: 숫자
- 신규 저장 시 `접수헤더.의뢰일자`, `접수헤더.'업체/현장'.Id`, `접수헤더.'업체/현장'.Value`를 각 상세 행에 함께 저장한다.
- 기존 `접수항목상세` 데이터도 복사 열을 일괄 보정해야 월·업체 필터에서 누락되지 않는다.
- 복사 열 적용 후 갤러리는 교차 `LookUp` 없이 `접수항목상세`의 직접 열만 필터링한다.
- 기존 데이터 보정은 Power Automate에서 페이지 처리를 사용한다.
- 기존 데이터 보정이 끝나기 전에는 현재 `gal분석진행항목.Items` 필터 수식을 복사 열 기준으로 교체하지 않는다.

###### 신규 저장 수식 보완

- 상태: **저장소 전체 수식 반영 완료, Power Apps 적용·검증 대기**
- 전체 수식: [`formulas/scr검토저장_btn최종저장_OnSelect.powerfx`](../formulas/scr검토저장_btn최종저장_OnSelect.powerfx)
- 대상: `접수항목상세`를 `Defaults(접수항목상세)`로 생성하는 3개 분기
- 각 생성 레코드에 추가한 값:

```powerfx
의뢰일자복사:
    var저장헤더.의뢰일자,

업체현장ID복사:
    Round(
        Value(var저장헤더.'업체/현장'.Id),
        0
    ),

업체현장명복사:
    Text(var저장헤더.'업체/현장'.Value),

시료명요약복사:
    Text(var저장헤더.'시료명 요약'),

분석항목ID복사:
    Round(
        Value(현재항목.분석항목ID),
        0
    ),
```

- 적용 전 필수: Power Apps의 `접수항목상세` 데이터 원본 새로고침
- 적용 방식: 기존 `scr검토저장 > btn최종저장 > OnSelect` 전체 수식을 저장소 전체본으로 교체

### 1.2 구버전 보관 — 적용 금지

아래 PowerFx는 2026-08-04의 수동 처리 설계다. `수동처리대기`와 NAS 수동 변경 안내를 사용하므로 현재 자동화 설계와 맞지 않는다. 이력 확인용으로만 보관하며 Power Apps에 붙여넣지 않는다.

### 위치

```text
Power Apps
└─ scr접수상세
   └─ con구분변경패널
      └─ btn구분변경실행
         └─ OnSelect
```

### 보관용 구버전 원문

> **적용 금지:** 아래 코드는 최신 적용 수식이 아니다. 현재 앱 수식 교체에 사용하지 않는다.

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

2026-08-05 확인 결과:

- Power Apps (V2) 최신 정의는 15개 입력이다.
- `btn최종저장.OnSelect`의 Flow 호출부 4곳을 15개 인수 구조로 교체했다.
- 인수 오류와 빨간 문법 오류가 사라졌다.
- 새 테스트 접수에서 결과 폴더·Excel 생성과 SharePoint 접수헤더 연결이 정상 완료됐다.

### 2026-08-05 btn구분변경실행 15개 인수 보정

- 위치: `scr접수상세 > con구분변경패널 > btn구분변경실행 > OnSelect`
- 증상: Flow 연결 새로고침 후 `15개의 인수가 필요한데 10개를 받았습니다` 오류
- 원인: `TAT_결과파일생성_App.Run(...)` 구분변경 호출부가 기존 10개 인수로 남아 있었음
- 수정: 호출부 1곳을 변경 모드용 15개 인수로 교체
- 6~9번 입력: `0`, `""`, `""`, `""`
- 10번 처리모드: `"변경"`
- 11~14번: 변경 전 의뢰구분, 접수번호, 결과폴더경로, 결과Excel경로
- 15번: `Round(Value(var구분변경이력.ID), 0)`
- 현재 상태: 전체 교체 수식 작성 완료, Power Apps 문법 확인 대기, 실제 실행 전

### 2026-08-05 구분변경 부분 성공 및 화면 백지

- 테스트: `ES-DR-2026-024`에서 `ENE-260805-015`로 미접수→측정인 변경
- 성공 확인: Power Apps 성공 알림, 접수헤더 접수번호·의뢰구분 변경, `접수구분변경이력` 정상 생성
- 실패 확인: 실제 결과 폴더·Excel 이름 미변경, 접수헤더 결과폴더명·경로 및 결과엑셀파일명·경로 미변경
- UI 증상: 실행 직후 `scr접수상세` 기본정보와 분석항목이 백지로 표시
- 판단: 앱의 성공 알림은 Flow 호출이 오류 없이 반환됐다는 사실만 반영하며, 실제 변경 분기 수행 여부를 보장하지 않는다. 상세 백지는 변경 전 접수번호 기반 조회값 또는 선택 변수가 남은 가능성이 있다.
- 금지: 같은 건의 구분변경 버튼 재실행 금지
- 다음 확인: `TAT_결과파일생성_App` 해당 실행의 전체 단계, 변경 조건 분기, 기존 경로 입력, 파일·폴더 이름변경 작업, Power Apps 응답 출력

### 2026-08-05 신규 테스트 구분변경 — Excel 잠금 후 파일 변경 성공

- 테스트: `ES-DR-2026-025 → ENE-260805-016`, 미접수→측정인
- 신규 접수와 SharePoint 등록, 최초 결과 폴더·Excel 생성은 정상
- 첫 변경 실행 실패 작업: `기존폴더이동및이름변경`
- 오류 핵심: `The file ... is locked for shared use by rnjx@eurofinsasia.com.`
- 사용자는 Excel, Teams 채널 폴더, SharePoint 미리보기를 열지 않았음
- 판단: 신규 생성 Flow에서 실행한 Excel Online/Office Script 작업의 일시 잠금
- 충분히 기다린 뒤 기존 실패 실행을 `다시 제출`하자 실제 폴더 이동과 폴더·Excel 파일명 변경은 성공
- 변경 후 실제 폴더·파일 기준명: `ENE-260805-016_(주)동남합성 대산1공장`
- 접수헤더 경로 4개는 `ES-DR-2026-025` 기준의 기존 값으로 남음
- 원인: 재제출된 Flow의 응답을 받아 후속 Patch를 실행할 Power Apps 호출 문맥이 없음

### Power Apps 응답 출력 확인

확인된 응답:

```json
{
  "결과폴더명": "ENE-260805-016_ES-DR-2026-025_(주)동남합성 대산1공장",
  "결과폴더경로": "https://erfxxam.sharepoint.com/sites/O365_msteams_5b3dce/Shared Documents/TAT 결과파일/측정인/ENE-260805-016_(주)동남합성 대산1공장",
  "결과엑셀파일명": "ENE-260805-016_ES-DR-2026-025_(주)동남합성 대산1공장.xlsx",
  "결과엑셀파일경로": "https://erfxxam.sharepoint.com/sites/O365_msteams_5b3dce/Shared Documents/TAT 결과파일/측정인/ENE-260805-016_(주)동남합성 대산1공장/ENE-260805-016_(주)동남합성 대산1공장.xlsx"
}
```

판단:

- 결과폴더경로와 결과엑셀파일경로는 변경 후 실제 경로와 일치
- 결과폴더명과 결과엑셀파일명에는 변경 전 접수번호가 불필요하게 포함됨
- 정상 결과폴더명: `ENE-260805-016_(주)동남합성 대산1공장`
- 정상 결과엑셀파일명: `ENE-260805-016_(주)동남합성 대산1공장.xlsx`

### 향후 교체할 Power Apps 응답 수식

```powerautomate
결과폴더명
last(
    split(
        outputs('변경후폴더서버경로'),
        '/'
    )
)
```

```powerautomate
결과폴더경로
concat(
    'https://erfxxam.sharepoint.com',
    outputs('변경후폴더서버경로')
)
```

```powerautomate
결과엑셀파일명
concat(
    last(
        split(
            outputs('변경후폴더서버경로'),
            '/'
        )
    ),
    '.xlsx'
)
```

```powerautomate
결과엑셀파일경로
concat(
    'https://erfxxam.sharepoint.com',
    outputs('변경후폴더서버경로'),
    '/',
    last(
        split(
            outputs('변경후폴더서버경로'),
            '/'
        )
    ),
    '.xlsx'
)
```

### 향후 Flow 안정화 작업

1. Excel 잠금 오류가 발생한 경우에만 일정 간격·제한 횟수로 `기존폴더이동및이름변경` 재시도
2. 실제 변경 완료 후 Flow 안에서 `접수헤더` 경로 4개와 `폴더처리상태/폴더처리오류` 직접 업데이트
3. Flow 안에서 `접수구분변경이력.처리결과` 직접 업데이트
4. Power Apps 호출과 실행 기록 재제출 모두 동일한 최종 상태가 되도록 검증
5. 현재 단계에서는 구현하지 않고 향후 작업으로 보류

## 4. 오류 로그

### 2026-08-10 신규 상세 행 `접수헤더연결` 누락 및 `RemoveIf` 위임 경고

증상:

- 복사 열 5개를 포함한 `btn최종저장.OnSelect` 전체 수식을 적용하면 신규 `접수항목상세` 행은 생성된다.
- 신규 테스트 행 ID 82·83의 필수 Lookup `접수헤더연결`은 비어 있고 SharePoint에 `필수 정보`가 표시된다.
- 아래 삭제 수식의 `접수헤더연결.Id` 비교에는 대규모 데이터에서 작동이 보장되지 않는다는 위임 경고가 남는다.

```powerfx
RemoveIf(
    접수항목상세,
    접수헤더연결.Id = var저장헤더.ID
);
```

원인 판단:

- 신규 헤더 저장 직후 `Choices(접수항목상세.접수헤더연결)`에서 같은 ID를 다시 찾는 기존 방식이 신규 Lookup 레코드를 반환하지 못한 것으로 판단한다.
- 앞서 추가한 복사 열 5개에는 접수헤더 숫자 ID가 없으므로 Lookup 하위 `Id`를 사용하는 삭제 조건의 위임 경고는 별도로 남는다.

저장소 교정 수식(미검증):

- 정확한 위치: `scr검토저장 > btn최종저장.OnSelect`
- 적용 범위: `접수항목상세` 및 `접수시료항목매핑` 생성 분기의 `접수헤더연결` 속성 7곳
- 기존 `LookUp(Choices(...), Id = var저장헤더.ID)` 전체를 다음 직접 Lookup 레코드로 교체했다.

```powerfx
접수헤더연결: {
    Id: var저장헤더.ID,
    Value: var저장헤더.제목
},
```

검증 순서:

1. 저장소의 전체 `btn최종저장.OnSelect` 수식을 Power Apps에 통째로 교체하고 문법 오류가 없는지 확인한다.
2. 신규 테스트 한 건을 저장한다.
3. `접수항목상세`와 `접수시료항목매핑`에서 `접수헤더연결`이 같은 신규 헤더를 가리키는지 확인한다.
4. 신규 상세 행의 복사 열 5개 값도 함께 확인한다.
5. 검증 완료 전에는 기존 데이터 일괄 보정과 갤러리 복사 열 전환을 진행하지 않는다.

위임 경고 후속안(제안/미적용):

- `접수항목상세`에 숫자 열 `접수헤더ID복사`를 추가하고 인덱스를 생성한다.
- 신규 상세 저장 시 `Round(Value(var저장헤더.ID), 0)`을 기록한다.
- 상세 삭제 조건을 직접 숫자 열 동등 비교로 바꾼 뒤 위임 경고를 다시 확인한다.
- 실제 열 생성 전에는 해당 열을 PowerFx에 참조하지 않는다.

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

해결 결과:

- Power Apps (V2) 트리거의 15개 입력 정의를 확인함
- 최종저장 `OnSelect`의 Flow 호출부 4곳을 모두 최신 시그니처로 교체함
- `15개의 인수가 필요한데 10개를 받았습니다` 오류 해소
- Power Apps 문법 오류 없음 확인
- 신규 접수 결과 폴더·Excel 생성 및 SharePoint 연결 정상 확인

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

신규 접수의 TAT_결과파일생성_App 15개 인수 적용과 결과 폴더·Excel 생성은 정상 확인했다.
구분변경에서 실제 폴더 이동과 폴더·Excel 파일명 변경도 성공했지만,
Excel 잠금 자동 재시도와 Flow 내부 접수헤더 갱신은 향후 안정화 작업으로 보류한 상태에서 이어서 진행해줘.

현재 테스트 `ENE-260805-016`은 실제 폴더·파일은 변경됐으나 접수헤더 경로 4개가 이전 값인 부분 성공 상태다.
동일 건의 Power Apps 구분변경 버튼은 다시 누르지 말아줘.

먼저 02 문서의 다음 작업 우선순위를 확인하고 다음 기능 작업을 진행해줘.
구분변경 안정화를 다시 시작할 때는 04 문서의 응답 수식 교정,
Flow 내부 SharePoint 상태 갱신, Excel 잠금 조건부 재시도를 한 작업 단위로 처리해줘.

Power Apps 수식을 변경할 때는 반드시 정확한 화면·트리·컨트롤·속성을 먼저 적고, 일부 삽입 코드가 아니라 기존 수식을 통째로 교체할 수 있는 전체 수식으로 제공해줘. 모르는 컨트롤명, SharePoint 열명, Choice 값, Flow 매개변수는 추측하지 말고 먼저 나에게 확인해줘. 작업 완료마다 01~04 MD를 최신화해줘.
```

## 6. 새 대화에서 반드시 지킬 인계사항

- 최신 확인 없이 과거 Flow 매개변수를 사용하지 않는다.
- 구분변경 자동화는 `처리중 → 처리완료/처리실패` 상태 흐름을 사용한다.
- 과거 `수동처리대기`와 NAS 수동 변경 안내를 현재 설계에 다시 적용하지 않는다.
- 사용자가 수식을 요청하면 기본적으로 전체 교체본을 제공한다.
- 오류·수식 변경·테스트 결과가 생기면 01~04의 역할에 맞는 문서만 갱신한다.
- Git 반영은 `AGENTS.md`의 세션 단위 체크포인트 규칙을 따른다.

## 7. 2026-08-10 세션 종료 및 Local Codex 인계

### 운영 방식

- 회사 PC에서 하루 동안 Power Apps·SharePoint·Power Automate 작업과 실제 검증을 이어간다.
- 작업마다 Git을 반복하지 않고 같은 대화에 성공·실패·미검증 결과를 명확히 남긴다.
- 하루 업무 종료 후 개인 PC에서 같은 대화를 열고 Local Codex가 `C:\workspace\TAT`의 최신 `origin/main`을 기준으로 문서와 수식을 갱신한다.
- Local Codex가 구조 검사, `git diff --check`, 관련 파일 확인, 커밋, push, 로컬·원격 SHA 비교까지 수행한다.

### 다음 대화 시작 전 Git 확인

```powershell
cd C:\workspace\TAT
git fetch origin
git pull --ff-only origin main
git status
git log -3 --oneline --decorate
git rev-parse HEAD
git rev-parse origin/main
```

- `HEAD`와 `origin/main`이 같고 작업트리가 깨끗해야 GitHub 체크포인트 완료 상태다.
- 두 SHA가 다르면 새 대화를 시작하기 전에 pull 또는 push 누락을 해결한다.
- 강제 push는 사용하지 않는다.

### 최신 `btn최종저장.OnSelect` 정적 확인값

- 파일: `formulas/scr검토저장_btn최종저장_OnSelect.powerfx`
- 현재 저장소 기준 SHA-256: `ca5aba86fcc731b2d811e925f31cebbf77f16d75ba3ae5c4642b1b2576259b97`
- 전체 줄 수: 1,350줄
- 직접 `접수헤더연결: { ... }` 레코드: 7곳
- `의뢰일자복사`, `업체현장ID복사`, `업체현장명복사`, `시료명요약복사`, `분석항목ID복사`: 각각 3곳
- 문자 그대로의 `\\n`, Markdown 별표 컨트롤명, `TAT\\_결과파일생성\\_App` 형태의 이스케이프 문자열은 없어야 한다.
- GitHub 일반 렌더링이나 대화에 중복 표시된 수식을 복사하지 말고 GitHub Raw 파일의 단일 전체 수식을 사용한다.

### 다음 세션의 실제 검증 작업

1. 정확한 위치: `scr검토저장 > btn최종저장 > OnSelect`.
2. GitHub Raw의 전체 파일로 기존 속성을 통째로 교체한다.
3. 빨간 문법 오류와 Flow 15개 인수 오류가 없는지 먼저 확인한다.
4. 신규 테스트 한 건만 저장한다.
5. `접수항목상세.접수헤더연결`과 `접수시료항목매핑.접수헤더연결`이 신규 헤더를 가리키는지 확인한다.
6. 복사 열 5개와 결과 폴더·Excel 생성, 기존 데이터 미변경을 확인한다.
7. 성공 전에는 기존 데이터 일괄 보정과 갤러리 복사 열 전환을 진행하지 않는다.
