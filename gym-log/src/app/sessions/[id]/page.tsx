import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSessionExercise, updateSessionInfo } from "./actions";
import { DeleteSessionButton } from "@/components/session/delete-session-button";
import { formatHeaderDate, seoulDateKeyFromUtc } from "@/lib/kst";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      sessionExercises: {
        orderBy: { displayOrder: "asc" },
        include: { sets: { orderBy: { setOrder: "asc" } } },
      },
    },
  });

  if (!session) notFound();

  const [y, m, d] = seoulDateKeyFromUtc(session.workoutDate)
    .split("-")
    .map(Number);
  const backHref = `/?y=${y}&m=${m}&d=${d}`;
  const addExerciseHref = `/exercises/select?sessionId=${session.id}&y=${y}&m=${m}&d=${d}`;
  const updateAction = updateSessionInfo.bind(null, session.id);

  return (
    <div className="min-h-screen bg-slate-100 pb-10 pt-4 text-slate-900">
      <div className="mx-auto max-w-md px-3">
        <p className="mb-2 text-center text-xs font-medium text-slate-500">
          GymLog · 세션 상세
        </p>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-xs text-slate-500">{formatHeaderDate(y, m, d)}</p>

          <form action={updateAction} className="mt-3 space-y-3">
            <div>
              <label
                htmlFor="title"
                className="text-xs font-medium text-slate-500"
              >
                제목
              </label>
              <input
                id="title"
                name="title"
                defaultValue={session.title}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="memo"
                className="text-xs font-medium text-slate-500"
              >
                메모
              </label>
              <textarea
                id="memo"
                name="memo"
                defaultValue={session.memo ?? ""}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              저장
            </button>
          </form>
        </section>

        <section className="mt-4 space-y-3">
          {session.sessionExercises.length === 0 ? (
            <p className="rounded-2xl bg-white p-4 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80">
              아직 추가된 종목이 없습니다.
            </p>
          ) : (
            session.sessionExercises.map((se) => {
              const deleteExerciseAction = deleteSessionExercise.bind(
                null,
                se.id,
                session.id,
              );
              const totalVolume = se.sets.reduce(
                (sum, s) => sum + s.plateWeightKg * s.reps,
                0,
              );

              return (
                <div
                  key={se.id}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {se.exerciseNameSnapshot}
                      </p>
                      {se.brandSnapshot ? (
                        <p className="text-xs text-slate-500">
                          {se.brandSnapshot}
                        </p>
                      ) : null}
                    </div>
                    <form action={deleteExerciseAction}>
                      <button
                        type="submit"
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </form>
                  </div>

                  {se.sets.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">세트 없음</p>
                  ) : (
                    <ul className="mt-2 divide-y divide-slate-100 text-sm">
                      {se.sets.map((set) => (
                        <li
                          key={set.id}
                          className="flex items-center justify-between py-1.5"
                        >
                          <span className="text-slate-500">
                            {set.setOrder}세트
                          </span>
                          <span className="text-slate-800">
                            {set.plateWeightKg}kg × {set.reps}회
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {se.sets.length > 0 ? (
                    <p className="mt-2 text-xs text-slate-400">
                      총 볼륨 {totalVolume.toFixed(1)}kg
                    </p>
                  ) : null}
                </div>
              );
            })
          )}

          <Link
            href={addExerciseHref}
            className="block w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 py-3 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            + 종목 추가
          </Link>
        </section>

        <section className="mt-6 space-y-2">
          <DeleteSessionButton sessionId={session.id} y={y} m={m} d={d} />
          <p className="text-center">
            <Link
              href={backHref}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← 메인으로
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
