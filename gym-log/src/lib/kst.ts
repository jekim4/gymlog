/** 한국(서울) 달력 기준 날짜 유틸 — 운동일(workoutDate)을 같은 날짜 키로 묶기 위함 */

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function seoulDateKeyFromUtc(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

export function todaySeoulParts(): { y: number; m: number; d: number } {
  const key = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });
  const [y, m, d] = key.split("-").map(Number);
  return { y, m, d };
}

export function lastDayOfMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

/** 0=일 … 6=토 (서울 달력 해당일) */
export function weekdayIndexSeoul(y: number, m: number, day: number): number {
  const s = `${y}-${pad2(m)}-${pad2(day)}T12:00:00+09:00`;
  const date = new Date(s);
  const short = date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  });
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[short] ?? 0;
}

export function seoulDayRangeUtc(y: number, m: number, day: number) {
  const start = new Date(`${y}-${pad2(m)}-${pad2(day)}T00:00:00+09:00`);
  const end = new Date(`${y}-${pad2(m)}-${pad2(day)}T23:59:59.999+09:00`);
  return { start, end };
}

export function seoulMonthRangeUtc(y: number, m: number) {
  const last = lastDayOfMonth(y, m);
  const start = new Date(`${y}-${pad2(m)}-01T00:00:00+09:00`);
  const end = new Date(`${y}-${pad2(m)}-${pad2(last)}T23:59:59.999+09:00`);
  return { start, end };
}

export function formatHeaderDate(y: number, m: number, d: number): string {
  return `${y}.${pad2(m)}.${pad2(d)}.`;
}

export function monthLabel(y: number, m: number): string {
  return new Date(`${y}-${pad2(m)}-01T12:00:00+09:00`).toLocaleDateString(
    "ko-KR",
    { year: "numeric", month: "long", timeZone: "Asia/Seoul" },
  );
}
