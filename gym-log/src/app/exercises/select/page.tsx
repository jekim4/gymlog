import Link from "next/link";
import { addExerciseToSession } from "./actions";
import { BODY_PART_LABEL, BODY_PART_ORDER } from "@/lib/body-part";
import { prisma } from "@/lib/prisma";
import type { BodyPart } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export default async function ExerciseSelectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sessionId = typeof sp.sessionId === "string" ? sp.sessionId : null;
  const y = Number(sp.y) || 0;
  const m = Number(sp.m) || 0;
  const d = Number(sp.d) || 0;

  const tabRaw = typeof sp.tab === "string" ? sp.tab : "CHEST";
  const tab = (BODY_PART_ORDER as readonly string[]).includes(tabRaw)
    ? (tabRaw as BodyPart)
    : BODY_PART_ORDER[0];

  const exercises = await prisma.exercise.findMany({
    where: { bodyPart: tab },
    orderBy: { name: "asc" },
  });

  const backHref = sessionId
    ? `/sessions/${sessionId}?y=${y}&m=${m}&d=${d}`
    : `/?y=${y}&m=${m}&d=${d}`;

  const tabHref = (bp: BodyPart) => {
    const extras = sessionId
      ? `&sessionId=${sessionId}&y=${y}&m=${m}&d=${d}`
      : `&y=${y}&m=${m}&d=${d}`;
    return `/exercises/select?tab=${bp}${extras}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-10 pt-4 text-slate-900">
      <div className="mx-auto max-w-md px-3">
        <p className="mb-2 text-center text-xs font-medium text-slate-500">
          GymLog · 종목 선택
        </p>

        {/* 부위 탭 */}
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200/80">
          {BODY_PART_ORDER.map((bp) => (
            <Link
              key={bp}
              href={tabHref(bp)}
              className={`min-w-fit flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold whitespace-nowrap transition ${
                tab === bp
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {BODY_PART_LABEL[bp]}
            </Link>
          ))}
        </div>

        {/* 종목 리스트 */}
        <section className="mt-3 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
          {exercises.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              등록된 종목이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {exercises.map((ex) => {
                const addAction = sessionId
                  ? addExerciseToSession.bind(null, sessionId, ex.id, y, m, d)
                  : null;

                return (
                  <li
                    key={ex.id}
                    className="flex items-center justify-between px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{ex.name}</p>
                      {ex.brand ? (
                        <p className="text-xs text-slate-500">{ex.brand}</p>
                      ) : null}
                    </div>
                    {addAction ? (
                      <form action={addAction}>
                        <button
                          type="submit"
                          className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white transition hover:bg-blue-700"
                        >
                          +
                        </button>
                      </form>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="mt-4 text-center">
          <Link
            href={backHref}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← 뒤로 가기
          </Link>
        </p>
      </div>
    </div>
  );
}
