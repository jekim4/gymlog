"use client";

import { useTransition } from "react";
import { deleteSession } from "@/app/sessions/[id]/actions";

type DeleteSessionButtonProps = {
  sessionId: string;
  y: number;
  m: number;
  d: number;
};

export function DeleteSessionButton({
  sessionId,
  y,
  m,
  d,
}: DeleteSessionButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          window.confirm(
            "이 세션을 삭제할까요? 포함된 종목과 세트가 모두 함께 삭제됩니다.",
          )
        ) {
          startTransition(() => {
            deleteSession(sessionId, y, m, d);
          });
        }
      }}
      className="w-full rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
    >
      세션 삭제
    </button>
  );
}
