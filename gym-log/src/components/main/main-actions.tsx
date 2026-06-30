type MainActionsProps = {
  addExerciseAction: () => Promise<void>;
  dateQuery: string;
};

export function MainActions({ addExerciseAction }: MainActionsProps) {
  return (
    <section className="mt-4 space-y-2">
      <form action={addExerciseAction}>
        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
        >
          운동 시작하기
        </button>
      </form>

      <button
        type="button"
        disabled
        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-400 shadow-sm"
      >
        ✓ 오늘의 운동 완료
      </button>
    </section>
  );
}
