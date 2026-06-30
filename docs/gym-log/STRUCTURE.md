# gym-log — 파일 구조 (에디터에서 뭘 열지)

## 지금 쓰는 파일만 (자주 연다)

| 파일 | 역할 |
|------|------|
| `src/app/page.tsx` | **메인 화면** `/` — 달력 + 그날 기록 |
| `src/components/main/records-calendar.tsx` | 달력 UI |
| `src/components/main/day-detail.tsx` | 선택한 날 종목·세트 목록 |
| `src/components/main/main-actions.tsx` | +운동 / 완료 버튼 |
| `src/lib/prisma.ts` | DB 연결 |
| `src/lib/kst.ts` | 한국(서울) 날짜 |
| `src/lib/parse-ymd.ts` | URL `?y=&m=&d=` 해석 |
| `prisma/schema.prisma` | DB 테이블 정의 |

## URL ↔ 폴더

| 주소 | 파일 |
|------|------|
| `/` | `src/app/page.tsx` |
| `/dev` | `src/app/dev/page.tsx` (개발용, 사용자 화면 아님) |
| `/records?…` | `src/app/records/page.tsx` → **`/`로 리다이렉트** |
| `/sessions/[id]` | `src/app/sessions/[id]/page.tsx` (W2 스텁) |
| `/exercises/select` | `src/app/exercises/select/page.tsx` (W2 스텁) |

## 건드리지 않아도 되는 것

| 경로 | 설명 |
|------|------|
| `src/generated/prisma/` | `prisma generate` 결과 (자동 생성) |
| `node_modules/` | 패키지 |

## 상위 폴더 `js-practice/` (앱 밖)

기획·와이어·2주 계획만. **코드 수정은 `gym-log/` 안에서만.**

- `PROJECT_PLAN_2W.md` — 할 일 순서
- `WIREFRAME_V1.md`, `FUNCTIONAL_REQUIREMENTS.md`
- `wireframe-*.html` — 그림만 보는 HTML

## 삭제한 중복 (정리 내역)

- `src/app/records/_components/*` — `src/components/main/` 과 동일 기능이라 제거
- `src/app/records/layout.tsx` — 불필요
