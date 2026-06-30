import Link from "next/link";
import { getOrCreateSession } from "./actions";
import { DayDetail, type DayExerciseRow } from "@/components/main/day-detail";
import { MainActions } from "@/components/main/main-actions";
import { RecordsCalendar } from "@/components/main/records-calendar";
import {
  seoulDateKeyFromUtc,
  seoulDayRangeUtc,
  seoulMonthRangeUtc,
} from "@/lib/kst";
import { parseYmd, ymdSearchString } from "@/lib/parse-ymd";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MainPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const { y, m, d } = parseYmd(sp);
  const dateQuery = ymdSearchString(sp);

  const { start: monthStart, end: monthEnd } = seoulMonthRangeUtc(y, m);
  const { start: dayStart, end: dayEnd } = seoulDayRangeUtc(y, m, d);

  const [monthSessions, daySessions] = await Promise.all([
    prisma.session.findMany({
      where: { workoutDate: { gte: monthStart, lte: monthEnd } },
      select: { workoutDate: true },
    }),
    prisma.session.findMany({
      where: { workoutDate: { gte: dayStart, lte: dayEnd } },
      orderBy: { createdAt: "asc" },
      include: {
        sessionExercises: {
          orderBy: { displayOrder: "asc" },
          include: { sets: { orderBy: { setOrder: "asc" } } },
        },
      },
    }),
  ]);

  const daysWithWorkouts = new Set<string>();
  for (const s of monthSessions) {
    daysWithWorkouts.add(seoulDateKeyFromUtc(s.workoutDate));
  }

  const rows: DayExerciseRow[] = [];
  for (const session of daySessions) {
    for (const se of session.sessionExercises) {
      const setCount = se.sets.length;
      let volumeKg = 0;
      let totalReps = 0;
      for (const st of se.sets) {
        volumeKg += st.plateWeightKg * st.reps;
        totalReps += st.reps;
      }
      rows.push({
        id: se.id,
        sessionTitle: session.title,
        name: se.exerciseNameSnapshot,
        setCount,
        volumeKg,
        totalReps,
        done: setCount > 0,
      });
    }
  }

  const sessionCount = daySessions.length;
  const exerciseCount = rows.length;

  const addExerciseAction = getOrCreateSession.bind(null, y, m, d);

  return (
    <div className="min-h-screen bg-slate-100 pb-10 pt-4 text-slate-900">
      <div className="mx-auto max-w-md px-3">
        <p className="mb-2 text-center text-xs font-medium text-slate-500">
          GymLog · 메인
        </p>

        <RecordsCalendar
          year={y}
          month={m}
          selectedDay={d}
          daysWithWorkouts={daysWithWorkouts}
        />

        {sessionCount > 0 ? (
          <p className="mt-3 rounded-lg bg-white px-3 py-2 text-center text-xs text-slate-600 ring-1 ring-slate-200/80">
            세션 요약: {exerciseCount}개 종목 ·{" "}
            {rows.reduce((n, r) => n + r.setCount, 0)}세트
          </p>
        ) : null}

        <DayDetail year={y} month={m} day={d} rows={rows} />

        <MainActions addExerciseAction={addExerciseAction} dateQuery={dateQuery} />

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/dev" className="text-blue-600 hover:underline">
            개발 대시보드
          </Link>
        </p>
      </div>
    </div>
  );
}
