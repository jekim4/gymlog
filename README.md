# GymLog

헬스장 운동 기록 웹 앱 (MVP). 날짜별 세션, 종목, 세트를 기록하고 달력에서 조회한다.

## 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| DB | SQLite (`gym-log/dev.db`) |
| ORM | Prisma 7 + `@prisma/adapter-better-sqlite3` |
| 스타일 | Tailwind CSS 4 |
| 런타임 | Node.js |

## 시작하기

```bash
# 의존성 설치 및 Prisma 클라이언트 생성
npm install --prefix gym-log

# DB 마이그레이션 (최초 실행 시 dev.db 생성)
cd gym-log && npm run db:migrate

# 개발 서버 실행
npm run dev           # js-practice 루트에서
# 또는
cd gym-log && npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

> Cursor 내장 미리보기에서 localhost가 막히면 `http://127.0.0.1:3000` 또는 일반 브라우저를 사용한다.

## 주요 명령

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (루트 또는 `gym-log/`) |
| `npm run build` | 프로덕션 빌드 (`gym-log/` 내) |
| `npm run db:migrate` | DB 스키마 마이그레이션 (`gym-log/` 내) |
| `npm run db:studio` | Prisma Studio (`gym-log/` 내) |
| `npm run db:check` | DB 연결 확인 (`gym-log/` 내) |

## 데이터 모델

```
Session          운동 세션 (날짜, 제목, 메모)
  └─ SessionExercise   세션 내 종목 (스냅샷 보존)
       └─ SetEntry     세트별 기록 (원판 무게, 횟수)

Exercise         종목 라이브러리 (이름, 부위, 브랜드, 시작저항)
```

- `exerciseNameSnapshot` — 종목 삭제 후에도 과거 기록의 표시명을 보존
- `plateWeightKg` — 원판 무게만 저장, 시작저항(startResistanceKg)과 합산해 총 부하 계산
- 부위: 가슴 / 등 / 하체 / 어깨 / 팔 / 복근 / 기타

## 화면 구성

| URL | 화면 |
|-----|------|
| `/` | 메인 — 달력 + 선택 날짜의 운동 요약 |
| `/sessions/[id]` | 세션 상세 및 세트 편집 (W2) |
| `/exercises/select` | 부위별 종목 선택 (W2) |
| `/dev` | 개발 대시보드 |

## 구현 현황

**W1 완료**
- 달력 UI (월별 운동 유무 표시, 날짜 선택)
- 선택 날짜의 종목별 세트 수·볼륨 요약
- DB 스키마 및 Prisma 셋업
- KST(서울) 시간대 처리

**W2 예정**
- 세션 생성·수정·삭제
- 종목 선택 및 세트 입력 UI
- Server Actions 기반 CRUD API

## 프로젝트 문서

| 파일 | 내용 |
|------|------|
| `FUNCTIONAL_REQUIREMENTS.md` | MVP 기능 요구사항 |
| `FLOW.md` | 화면 흐름 |
| `WIREFRAME_V1.md` | 와이어프레임 |
| `DATA_MODEL_TEMPLATE.md` | 데이터 모델 초안 |
| `PROJECT_PLAN_2W.md` | 2주 개발 계획 |

## 트러블슈팅

**`better-sqlite3` Node 버전 오류**
```bash
cd gym-log && npm rebuild better-sqlite3
```

**DB 파일 없음**
```bash
cd gym-log && npm run db:migrate
```

**OneDrive 환경**
`dev.db`가 "온라인 전용"이면 SQLite 접근 실패. 탐색기에서 해당 파일을 "이 디바이스에 항상 유지"로 설정한다.
