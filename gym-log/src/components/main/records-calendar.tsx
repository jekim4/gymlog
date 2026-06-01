import Link from "next/link";
import {
  lastDayOfMonth,
  monthLabel,
  pad2,
  weekdayIndexSeoul,
} from "@/lib/kst";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

type RecordsCalendarProps = {
  year: number;
  month: number;
  selectedDay: number;
  daysWithWorkouts: Set<string>;
};

export function RecordsCalendar({
  year,
  month,
  selectedDay,
  daysWithWorkouts,
}: RecordsCalendarProps) {
  const last = lastDayOfMonth(year, month);
  const lead = weekdayIndexSeoul(year, month, 1);
  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= last; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);

  const prev =
    month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next =
    month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  const prevLast = lastDayOfMonth(prev.y, prev.m);
  const prevD = Math.min(selectedDay, prevLast);

  const nextLast = lastDayOfMonth(next.y, next.m);
  const nextD = Math.min(selectedDay, nextLast);

  const href = (y: number, m: number, d: number) => `/?y=${y}&m=${m}&d=${d}`;

  return (
    <section className="rounded-2xl bg-white px-3 pb-4 pt-2 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-center justify-between px-1 py-2">
        <Link
          href={href(prev.y, prev.m, prevD)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
          aria-label="이전 달"
        >
          <span className="text-lg" aria-hidden>
            ‹
          </span>
        </Link>
        <h1 className="text-base font-semibold tracking-tight text-slate-900">
          {monthLabel(year, month)}
        </h1>
        <Link
          href={href(next.y, next.m, nextD)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
          aria-label="다음 달"
        >
          <span className="text-lg" aria-hidden>
            ›
          </span>
        </Link>
      </div>

      <div
        className="grid grid-cols-7 gap-y-1 text-center text-xs text-slate-500"
        role="grid"
        aria-label="운동 기록 달력"
      >
        {WEEK_LABELS.map((w) => (
          <div key={w} className="py-2 font-medium" role="columnheader">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="h-11" />;
          }
          const key = `${year}-${pad2(month)}-${pad2(day)}`;
          const hasWorkout = daysWithWorkouts.has(key);
          const selected = day === selectedDay;
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-start py-0.5"
            >
              <Link
                href={href(year, month, day)}
                className="relative flex h-9 w-9 items-center justify-center"
                role="gridcell"
                aria-current={selected ? "date" : undefined}
                aria-label={`${month}월 ${day}일`}
              >
                {selected ? (
                  <span className="absolute inset-0 rounded-full bg-blue-600" />
                ) : null}
                <span
                  className={`relative z-10 text-sm font-medium ${
                    selected ? "text-white" : "text-slate-800"
                  }`}
                >
                  {day}
                </span>
              </Link>
              <span
                className="mt-0.5 h-1.5 w-1.5 rounded-sm"
                aria-hidden
                style={{
                  backgroundColor: hasWorkout ? "#fb923c" : "transparent",
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
