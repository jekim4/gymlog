# GymLog (가칭) — Next.js 앱

**에디터에서 뭘 열지 헷갈리면 → [`STRUCTURE.md`](./STRUCTURE.md) 먼저 보기.**

상위 폴더(`js-practice`)의 기획 문서와 함께 둔다.

- 요구사항: `../FUNCTIONAL_REQUIREMENTS.md`
- 화면 흐름: `../FLOW.md`
- 와이어프레임 v1: `../WIREFRAME_V1.md`
- 데이터 모델 초안: `../DATA_MODEL_TEMPLATE.md`

## 스택

- Next.js (App Router) + TypeScript
- Prisma 7 + SQLite (`dev.db`)
- 런타임: `@prisma/adapter-better-sqlite3` + `better-sqlite3` (Prisma 7 드라이버 어댑터)

## 명령

`gym-log` 폴더 안에서:

```bash
cd gym-log
npm install
npm run dev
```

터미널이 **`js-practice`(상위 폴더)** 에만 열려 있다면, 상위에 두는 `package.json`으로 같은 서버를 띄울 수 있다:

```bash
npm install --prefix gym-log
npm run dev
```

브라우저는 **`http://127.0.0.1:3000`** 을 권장한다(Cursor 내장 미리보기에서 `localhost`가 막히는 경우가 있음). 터미널에 `Network: http://192.168.x.x:3000`이 보이면, 그 주소로 같은 PC에서 접속해 볼 수 있다.

서버가 떠 있는지 확인: 터미널에 `✓ Ready`가 나온 뒤에 주소를 연다. `ERR_CONNECTION_REFUSED`면 대부분 **아직 `npm run dev`가 안 돌아가는 상태**이거나 **다른 포트**다.

DB 스키마 변경 후:

```bash
npm run db:migrate
```

DB 파일이 열리는지만 빠르게 보려면 (`gym-log` 안에서):

```bash
npm run db:check
```

## 연결이 안 될 때 (자주 나오는 원인)

1. **작업 폴더** — `db:studio`, `db:check`는 **`gym-log` 안**에서 실행하는 것이 안전하다. `npm run dev`만큼은 상위 `js-practice`에서 **`npm run dev`**(루트 `package.json`이 `gym-log`로 넘겨 줌)도 가능하다. 예전처럼 상위에서 아무 스크립트 없이 `next dev`를 켜면 **서버가 안 떠서** localhost가 열리지 않는다.
2. **브라우저** — Cursor/VS Code **내장 Simple Browser**는 환경에 따라 `http://localhost:3000` 접속이 막히는 경우가 있다. 그럴 때는 **Chrome·Edge 등 일반 브라우저**로 연다.
3. **외부 SQLite 도구** — DBeaver 등에 `file:./dev.db`만 넣으면, 그 프로그램의 현재 작업 폴더 기준으로 해석된다. **`dev.db`의 전체 경로**(또는 `db:check`에 찍힌 `resolved path`)를 사용한다.
4. **DB 파일 없음** — 처음 클론한 뒤라면 `npm run db:migrate`로 `dev.db`와 테이블을 만든다.
5. **OneDrive** — `dev.db`가 “온라인 전용”이면 SQLite가 실패할 수 있다. 탐색기에서 해당 파일을 **이 디바이스에 항상 유지**로 두어 본다.

## 참고

- Prisma 7에서는 `schema.prisma`에 `url`을 두지 않고 `prisma.config.ts` + `.env`의 `DATABASE_URL`을 사용한다.
- Prisma Client는 `prisma generate` 결과가 `src/generated/prisma`에 생성된다(`.gitignore` 처리됨 → `postinstall`으로 재생성).
