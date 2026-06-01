import { lastDayOfMonth, todaySeoulParts } from "@/lib/kst";

export function parseYmd(
  sp: Record<string, string | string[] | undefined>,
): { y: number; m: number; d: number } {
  const t = todaySeoulParts();
  const yRaw = Number(Array.isArray(sp.y) ? sp.y[0] : sp.y);
  const mRaw = Number(Array.isArray(sp.m) ? sp.m[0] : sp.m);
  const dStr = Array.isArray(sp.d) ? sp.d[0] : sp.d;

  const y = Number.isFinite(yRaw) ? Math.min(2100, Math.max(2000, yRaw)) : t.y;
  const m = Number.isFinite(mRaw) ? Math.min(12, Math.max(1, mRaw)) : t.m;
  const last = lastDayOfMonth(y, m);

  if (dStr !== undefined && dStr !== "") {
    const dRaw = Number.parseInt(String(dStr), 10);
    if (Number.isFinite(dRaw)) {
      return { y, m, d: Math.min(last, Math.max(1, dRaw)) };
    }
  }

  if (y === t.y && m === t.m) {
    return { y, m, d: Math.min(last, t.d) };
  }
  return { y, m, d: 1 };
}

export function ymdSearchString(
  sp: Record<string, string | string[] | undefined>,
): string {
  const { y, m, d } = parseYmd(sp);
  return `y=${y}&m=${m}&d=${d}`;
}