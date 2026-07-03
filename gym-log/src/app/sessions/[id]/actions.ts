"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateSessionInfo(sessionId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const memoRaw = String(formData.get("memo") ?? "");
  const memo = memoRaw.trim() === "" ? null : memoRaw;

  if (!title) return;

  await prisma.session.update({
    where: { id: sessionId },
    data: { title, memo },
  });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function deleteSessionExercise(
  sessionExerciseId: string,
  sessionId: string,
) {
  await prisma.sessionExercise.delete({ where: { id: sessionExerciseId } });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function deleteSession(
  sessionId: string,
  y: number,
  m: number,
  d: number,
) {
  await prisma.session.delete({ where: { id: sessionId } });

  redirect(`/?y=${y}&m=${m}&d=${d}`);
}

export async function addSet(
  sessionExerciseId: string,
  sessionId: string,
  formData: FormData,
) {
  const plateWeightKg = Number(formData.get("plateWeightKg"));
  const reps = Number(formData.get("reps"));

  if (!Number.isFinite(plateWeightKg) || plateWeightKg < 0) return;
  if (!Number.isFinite(reps) || reps < 1) return;

  const last = await prisma.setEntry.findFirst({
    where: { sessionExerciseId },
    orderBy: { setOrder: "desc" },
    select: { setOrder: true },
  });

  await prisma.setEntry.create({
    data: {
      sessionExerciseId,
      setOrder: (last?.setOrder ?? 0) + 1,
      plateWeightKg,
      reps,
    },
  });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function updateSet(
  setId: string,
  sessionId: string,
  formData: FormData,
) {
  const plateWeightKg = Number(formData.get("plateWeightKg"));
  const reps = Number(formData.get("reps"));

  if (!Number.isFinite(plateWeightKg) || plateWeightKg < 0) return;
  if (!Number.isFinite(reps) || reps < 1) return;

  await prisma.setEntry.update({
    where: { id: setId },
    data: { plateWeightKg, reps },
  });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function deleteSet(setId: string, sessionId: string) {
  await prisma.setEntry.delete({ where: { id: setId } });

  revalidatePath(`/sessions/${sessionId}`);
}
