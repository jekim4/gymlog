import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const milestones = [
  { label: "Next.js (App Router) + TypeScript + Tailwind", done: true },
  { label: "Prisma 7 + SQLite 스키마·마이그레이션", done: true },
  { label: "better-sqlite3 드라이버 어댑터 연결", done: true },
  { label: "세션·운동·세트 데이터 모델", done: true },
  { label: "메인 허브 (캘린더) W1-A", done: true },
  { label: "세션 상세·종목 선택 (W2)", done: false },
];

export default async function DevDashboardPage() {
  const [sessions, exercises, sessionExercises, setEntries] = await Promise.all([
    prisma.session.count(),
    prisma.exercise.count(),
    prisma.sessionExercise.count(),
    prisma.setEntry.count(),
  ]);

  const stats = [
    { name: "Session", value: sessions, hint: "운동 일지" },
    { name: "Exercise", value: exercises, hint: "종목 마스터" },
    { name: "SessionExercise", value: sessionExercises, hint: "일지 속 종목" },
    { name: "SetEntry", value: setEntries, hint: "세트 기록" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200/80 px-4 py-12 text-zinc-900 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="text-center sm:text-left">
          <p className="mb-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              ← 메인 (캘린더)
            </Link>
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            GymLog · Dev
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            개발 대시보드
          </h1>
          <p className="mt-3 max-w-xl text-zinc-600">
            DB 카운트·진행 체크리스트. 사용자 앱 진입점은{" "}
            <Link href="/" className="font-medium text-blue-600 hover:underline">
              /
            </Link>
            입니다.
          </p>
        </header>

        <section
          aria-label="데이터베이스 레코드 수"
          className="grid gap-3 sm:grid-cols-2"
        >
          {stats.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {s.name}
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-zinc-900">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{s.hint}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 py-3">
            <h2 className="text-sm font-semibold text-zinc-800">
              구현 진행 상황
            </h2>
          </div>
          <ul className="divide-y divide-zinc-100">
            {milestones.map((m) => (
              <li
                key={m.label}
                className="flex items-start gap-3 px-5 py-3.5 text-sm"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    backgroundColor: m.done ? "#059669" : "#d4d4d8",
                  }}
                  aria-hidden
                >
                  {m.done ? "✓" : ""}
                </span>
                <span className={m.done ? "text-zinc-800" : "text-zinc-500"}>
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <nav className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
          <p className="font-semibold text-zinc-800">라우트 껍데기 (W1-A)</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                /
              </Link>{" "}
              — 메인
            </li>
            <li>
              <Link
                href="/sessions/stub-id"
                className="text-blue-600 hover:underline"
              >
                /sessions/[id]
              </Link>{" "}
              — 세션 상세
            </li>
            <li>
              <Link
                href="/exercises/select"
                className="text-blue-600 hover:underline"
              >
                /exercises/select
              </Link>{" "}
              — 종목 선택
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
