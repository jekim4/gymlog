import Link from "next/link";

type MainActionsProps = {
  dateQuery: string;
};

export function MainActions({ dateQuery }: MainActionsProps) {
  const q = dateQuery ? `?${dateQuery}` : "";

  return (
    <section className="mt-4 space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-500"
        >
          ▷ 운동 시작/종료 (준비 중)
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-500"
        >
          ⏱ 타이머
        </button>
      </div>

      <Link
        href={`/exercises/select${q}`}
        className="block w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 py-3 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
      >
        + 운동 종목 추가하기
      </Link>

      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white opacity-50 shadow-sm"
        title="W1-C에서 연결 예정"
      >
        ✓ 오늘의 운동 완료
      </button>
      <p className="text-center text-[11px] text-slate-400">
        완료 버튼·피드는 W1-C 이후 연결합니다.
      </p>
    </section>
  );
}
