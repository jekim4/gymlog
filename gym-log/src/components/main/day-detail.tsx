import { formatHeaderDate } from "@/lib/kst";

export type DayExerciseRow = {
  id: string;
  sessionTitle: string;
  name: string;
  setCount: number;
  volumeKg: number;
  totalReps: number;
  done: boolean;
};

type DayDetailProps = {
  year: number;
  month: number;
  day: number;
  rows: DayExerciseRow[];
};

function IconRow() {
  return (
    <div className="flex gap-2" aria-hidden>
      {["○", "□", "×"].map((sym, i) => (
        <span
          key={i}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-400"
        >
          {sym}
        </span>
      ))}
    </div>
  );
}

export function DayDetail({ year, month, day, rows }: DayDetailProps) {
  const header = formatHeaderDate(year, month, day);

  return (
    <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {header}
        </h2>
        <IconRow />
      </div>

      <ul className="mt-4 divide-y divide-slate-100">
        {rows.length === 0 ? (
          <li className="py-8 text-center text-sm text-slate-500">
            이 날짜에 저장된 운동이 없습니다.
          </li>
        ) : (
          rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {row.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {row.sessionTitle}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {row.setCount}세트 / {row.volumeKg.toFixed(1)}kg /{" "}
                  {row.totalReps}회
                </p>
              </div>
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 ${
                  row.done
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
                aria-label={row.done ? "기록 완료" : "기록 없음"}
              >
                {row.done ? "✓" : ""}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
