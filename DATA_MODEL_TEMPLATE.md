## GymLog (가칭) — 데이터 모델 템플릿 (MVP)

### 사용 방법
- 아래 엔티티 템플릿을 기준으로 필드를 확정한다.
- 각 필드에 타입/필수 여부/설명을 채운다.
- 기능 요구사항(`FUNCTIONAL_REQUIREMENTS.md`)의 정책과 충돌이 없는지 확인한다.

---

## 용어 정리 (헷갈리기 쉬운 것만)

| 용어 | 한 줄 의미 | 비고 |
|---|---|---|
| **운동 종목(라이브러리)** | 자주 쓰는 머신·프리웨이트를 등록해 두는 **재사용 카드** | 브랜드·기종이 다르면 **별도 종목** |
| **세션** | **하루(날짜) 기준**으로 한 번 운동한 묶음 | 제목 기본값 `YYYY-MM-DD 운동`, 수정 가능 |
| **세션 내 종목 블록** | 그날 기록에서 “이 머신으로 이만큼 했다” 덩어리 | 라이브러리 종목을 지워도 **기록 당시 이름** 유지 |
| **세트(저장 1행)** | 한 세트 = 무게·횟수·순번의 **최소 단위** | DB 테이블에 저장 시 **레코드 1개 = 한 세트**에 대응하기 쉬움 |
| **UI 묶음 표시** | 연속된 세트가 무게·횟수가 같으면 `n세트`처럼 **보여만** 묶음 | 저장은 세트별 행 유지 가능 |

**표시 규칙(UX):** 무게와 횟수 중 **하나라도 다르면 서로 다른 줄**로 보인다.  
**라이브러리 삭제:** 과거 세션에는 **그날 기록에 남긴 이름(스냅샷)** 이 그대로 보여야 한다.

---

## 1) Session (운동 세션)

### 목적
- 날짜 단위 운동 기록의 최상위 단위

### 필드 초안
| 필드명 | 타입(예시) | 필수 | 설명 |
|---|---|---|---|
| id | string(uuid) | Y | 세션 고유 ID |
| workoutDate | date | Y | 운동일 |
| title | string | Y | 기본값: `YYYY-MM-DD 운동`, 수정 가능 |
| memo | string | N | 자유 메모 |
| createdAt | datetime | Y | 생성 시각 |
| updatedAt | datetime | Y | 수정 시각 |

### 규칙
- 제목은 자동 생성 후 수정 가능
- 세션 삭제 시 하위 데이터(세션 종목/세트) 함께 삭제

---

## 2) Exercise (운동 종목 라이브러리)

### 목적
- 재사용 가능한 운동 종목(머신/프리웨이트) 사전

### 필드 초안
| 필드명 | 타입(예시) | 필수 | 설명 |
|---|---|---|---|
| id | string(uuid) | Y | 종목 고유 ID |
| name | string | Y | 종목명 |
| bodyPart | enum | Y | 가슴/등/어깨/팔/하체/코어 |
| brand | string | N | 브랜드/기구 구분 |
| startResistanceKg | decimal | N | Start 기본 저항(kg) |
| startResistanceNote | string | N | 라벨 원문 메모(예: Start 8 lbs/3.6 kg) |
| isSystemDefault | boolean | Y | 내장 기본 종목 여부 |
| createdAt | datetime | Y | 생성 시각 |
| updatedAt | datetime | Y | 수정 시각 |

### 규칙
- 같은 동작명이라도 브랜드/기종 다르면 별도 종목 등록 가능
- 종목 삭제 후에도 과거 세션에는 기록 당시 종목명 유지 필요

---

## 3) SessionExercise (세션 내 종목 블록)

### 목적
- 특정 세션에 어떤 종목이 포함됐는지 표현
- 과거 기록 표시를 위한 종목명 스냅샷 보관

### 필드 초안
| 필드명 | 타입(예시) | 필수 | 설명 |
|---|---|---|---|
| id | string(uuid) | Y | 세션 종목 블록 ID |
| sessionId | string(uuid) | Y | Session 참조 |
| exerciseId | string(uuid) | N | Exercise 참조(삭제/비활성 대비 nullable 가능) |
| exerciseNameSnapshot | string | Y | 기록 당시 표시명 |
| brandSnapshot | string | N | 기록 당시 브랜드 |
| startResistanceKgSnapshot | decimal | N | 기록 당시 Start 값 |
| displayOrder | int | Y | 세션 내 종목 순서 |
| createdAt | datetime | Y | 생성 시각 |
| updatedAt | datetime | Y | 수정 시각 |

### 규칙
- 라이브러리 종목이 삭제되어도 과거 세션 표시가 깨지지 않아야 함

---

## 4) SetEntry (세트 기록)

### 목적
- 한 세트 단위 기록 저장 (저장 단위의 최소 원자)

### 필드 초안
| 필드명 | 타입(예시) | 필수 | 설명 |
|---|---|---|---|
| id | string(uuid) | Y | 세트 ID |
| sessionExerciseId | string(uuid) | Y | SessionExercise 참조 |
| setOrder | int | Y | 세트 순번 |
| plateWeightKg | decimal | Y | 입력 무게(원판 기준) |
| reps | int | Y | 반복 횟수 |
| createdAt | datetime | Y | 생성 시각 |
| updatedAt | datetime | Y | 수정 시각 |

### 규칙
- 입력 UX는 같은 무게/횟수 n세트를 묶어 받아도, 저장은 세트별 개별 행
- 세트 라벨(워밍업/피더/탑/백오프)은 MVP 필수 필드 아님
- 필요 시 화면에서 총부하 `startResistanceKg + plateWeightKg` 계산 표시

---

## 5) enum / 공통 규칙

### BodyPart enum (MVP)
- CHEST
- BACK
- SHOULDER
- ARM
- LEG
- CORE

### 삭제 정책 메모
- 세션 전체 삭제: 확인 메시지 권장
- 세션 내부 종목/세트 삭제: 확인 생략(MVP)
- 라이브러리 종목 삭제: 과거 기록 이름은 유지

---

## 6) 다음 체크리스트
- [ ] 각 필드 타입 확정 (Prisma/ORM 기준)
- [ ] nullable 정책 확정 (`exerciseId` 등)
- [ ] 인덱스 설계 (`sessionId`, `sessionExerciseId`, `workoutDate`)
- [ ] 샘플 데이터 1일치로 모델 검증 (푸시 데이 데이터 권장)

