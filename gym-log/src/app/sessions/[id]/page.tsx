import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** W2: 세션 상세·세트 편집 (준비 중) */
export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-slate-900">
      <p className="text-xs font-medium text-slate-500">GymLog · W2 예정</p>
      <h1 className="mt-2 text-xl font-bold">세션 상세</h1>
      <p className="mt-2 text-sm text-slate-600">
        세션 ID: <code className="rounded bg-slate-100 px-1">{id}</code>
      </p>
      <p className="mt-4 text-sm text-slate-500">
        제목·메모·세트 테이블은 2주차에 구현합니다.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
          ← 메인으로
        </Link>
      </p>
    </div>
  );
}
