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
