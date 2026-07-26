# GymLog

헬스장 운동 기록 웹 앱 (MVP). 날짜별 세션, 종목, 세트를 기록하고 달력에서 조회한다.

**라이브:** https://gymlog-fit.duckdns.org

## 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| DB | SQLite (Prisma 7 + `@prisma/adapter-better-sqlite3`) |
| 스타일 | Tailwind CSS 4 |
| 배포 | Docker + GCP Compute Engine (asia-northeast3) |
| HTTPS | Caddy + Let's Encrypt (DuckDNS) |

## 로컬 실행

```bash
cd gym-log
npm install
npm run db:migrate   # 최초 1회: dev.db 생성
node prisma/seed.mjs # 최초 1회: 기본 종목 데이터 삽입
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 주요 명령

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (`gym-log/` 내) |
| `npm run build` | 프로덕션 빌드 |
| `npm run db:migrate` | DB 스키마 마이그레이션 |
| `npm run db:studio` | Prisma Studio |

## 화면 구성

| URL | 화면 |
|-----|------|
| `/` | 메인 — 달력 + 선택 날짜의 운동 요약 |
| `/sessions/[id]` | 세션 상세 — 종목·세트 CRUD |
| `/exercises/select` | 종목 선택 — 부위별 탭, 검색, 직접 추가 |

## 데이터 모델

```
Session              운동 세션 (날짜, 제목, 메모)
  └─ SessionExercise   세션 내 종목 (이름 스냅샷)
       └─ SetEntry      세트별 기록 (원판 무게 kg, 횟수)

Exercise             종목 라이브러리 (이름, 부위, 브랜드)
```

- `exerciseNameSnapshot` — 종목 삭제 후에도 과거 기록의 표시명을 보존
- `plateWeightKg` — 원판 무게만 저장
- 부위: 가슴 / 등 / 하체 / 어깨 / 팔 / 복근 / 기타

## 구현 현황

**W1 완료**
- 달력 UI (월별 운동 유무 표시, 날짜 선택)
- 선택 날짜의 종목별 세트 수 요약
- DB 스키마 및 Prisma 셋업, KST 시간대 처리

**W2 완료**
- 세션 생성·수정·삭제
- 종목 선택 (부위별 탭, 검색, 직접 추가, 삭제)
- 세트 입력·수정·삭제 (Server Actions 기반 CRUD)
- 프리웨이트 기본 종목 18개 시드 데이터
- 사이드 메뉴 (홈, 종목 라이브러리)
- 세션 상세 상단 뒤로가기, 메인에서 세션 바로가기

**배포**
- Docker 멀티스테이지 빌드 (`gym-log/Dockerfile`)
- GCP Compute Engine + Docker Compose (`docker-compose.yml`)
- Caddy 리버스 프록시로 HTTPS 자동 설정 (`Caddyfile`)

## 배포 (GCP)

```bash
# VM에서
cd ~/gymlog
git pull
docker compose down
docker compose up -d --build
```
