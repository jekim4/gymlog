import { redirect } from "next/navigation";
import { ymdSearchString } from "@/lib/parse-ymd";

/** 예전 URL `/records` → 메인 `/` 로 통합 */
export default async function RecordsRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = ymdSearchString(sp);
  redirect(q ? `/?${q}` : "/");
}
