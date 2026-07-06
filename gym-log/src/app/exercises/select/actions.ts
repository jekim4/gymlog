"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { type BodyPart } from "@/generated/prisma/enums";

export async function addExerciseToSession(
  sessionId: string,
  exerciseId: string,
  y: number,
  m: number,
  d: number,
) {
  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return;

  const last = await prisma.sessionExercise.findFirst({
    where: { sessionId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  await prisma.sessionExercise.create({
    data: {
      sessionId,
      exerciseId,
      exerciseNameSnapshot: exercise.name,
      brandSnapshot: exercise.brand ?? null,
      startResistanceKgSnapshot: exercise.startResistanceKg ?? null,
      displayOrder: (last?.displayOrder ?? -1) + 1,
    },
  });

  redirect(`/sessions/${sessionId}?y=${y}&m=${m}&d=${d}`);
}

export async function createAndAddExercise(
  sessionId: string | null,
  name: string,
  bodyPart: BodyPart,
  y: number,
  m: number,
  d: number,
) {
  const trimmed = name.trim();
  if (!trimmed) return;

  const exercise = await prisma.exercise.create({
    data: { name: trimmed, bodyPart, isSystemDefault: false },
  });

  if (sessionId) {
    const last = await prisma.sessionExercise.findFirst({
      where: { sessionId },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    await prisma.sessionExercise.create({
      data: {
        sessionId,
        exerciseId: exercise.id,
        exerciseNameSnapshot: exercise.name,
        brandSnapshot: null,
        startResistanceKgSnapshot: null,
        displayOrder: (last?.displayOrder ?? -1) + 1,
      },
    });
    redirect(`/sessions/${sessionId}?y=${y}&m=${m}&d=${d}`);
  } else {
    redirect(`/exercises/select?y=${y}&m=${m}&d=${d}`);
  }
}
