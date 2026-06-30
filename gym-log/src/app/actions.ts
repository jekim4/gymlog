'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { seoulDayRangeUtc, pad2 } from '@/lib/kst'

export async function getOrCreateSession(y: number, m: number, d: number) {
  const { start, end } = seoulDayRangeUtc(y, m, d)

  let session = await prisma.session.findFirst({
    where: { workoutDate: { gte: start, lte: end } },
    orderBy: { createdAt: 'asc' },
  })

  if (!session) {
    session = await prisma.session.create({
      data: {
        workoutDate: start,
        title: `${y}-${pad2(m)}-${pad2(d)} 운동`,
      },
    })
  }

  redirect(`/sessions/${session.id}?y=${y}&m=${m}&d=${d}`)
}
