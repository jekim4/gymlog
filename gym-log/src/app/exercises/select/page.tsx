import Link from "next/link";
import { ymdSearchString } from "@/lib/parse-ymd";

/** W2: 부위 탭 + 종목 선택 (준비 중) */
export default async function ExerciseSelectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const back = `/?${ymdSearchString(sp)}`;

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-slate-900">
      <p className="text-xs font-medium text-slate-500">GymLog · W2 예정</p>
      <h1 className="mt-2 text-xl font-bold">운동 종목 선택</h1>
      <p className="mt-4 text-sm text-slate-500">
        가슴/등/하체/어깨/팔/복근/기타 탭과 [+] 추가는 2주차에 구현합니다.
      </p>
      <p className="mt-8">
        <Link href={back} className="text-sm font-medium text-blue-600 hover:underline">
          ← 메인으로
        </Link>
      </p>
    </div>
  );
}
