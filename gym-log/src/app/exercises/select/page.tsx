import { ExerciseSelectClient } from "./exercise-select-client";
import { BODY_PART_ORDER } from "@/lib/body-part";
import { prisma } from "@/lib/prisma";
import type { BodyPart } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export default async function ExerciseSelectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sessionId = typeof sp.sessionId === "string" ? sp.sessionId : null;
  const y = Number(sp.y) || 0;
  const m = Number(sp.m) || 0;
  const d = Number(sp.d) || 0;

  const tabRaw = typeof sp.tab === "string" ? sp.tab : "CHEST";
  const initialTab = (BODY_PART_ORDER as readonly string[]).includes(tabRaw)
    ? (tabRaw as BodyPart)
    : BODY_PART_ORDER[0];

  const exercises = await prisma.exercise.findMany({
    orderBy: [{ bodyPart: "asc" }, { name: "asc" }],
    select: { id: true, name: true, bodyPart: true, brand: true, isSystemDefault: true },
  });

  const backHref = sessionId
    ? `/sessions/${sessionId}?y=${y}&m=${m}&d=${d}`
    : `/?y=${y}&m=${m}&d=${d}`;

  return (
    <div className="min-h-screen bg-slate-100 pb-10 pt-4 text-slate-900">
      <div className="mx-auto max-w-md px-3">
        <p className="mb-2 text-center text-xs font-medium text-slate-500">
          GymLog · 종목 선택
        </p>
        <ExerciseSelectClient
          exercises={exercises}
          sessionId={sessionId}
          y={y}
          m={m}
          d={d}
          initialTab={initialTab}
          backHref={backHref}
        />
      </div>
    </div>
  );
}
