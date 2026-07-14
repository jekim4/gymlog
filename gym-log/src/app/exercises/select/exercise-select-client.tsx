"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { BODY_PART_LABEL, BODY_PART_ORDER } from "@/lib/body-part";
import type { BodyPart } from "@/generated/prisma/enums";
import { addExerciseToSession, createAndAddExercise, deleteExercise } from "./actions";

type Exercise = {
  id: string;
  name: string;
  bodyPart: BodyPart;
  brand: string | null;
  isSystemDefault: boolean;
};

type Props = {
  exercises: Exercise[];
  sessionId: string | null;
  y: number;
  m: number;
  d: number;
  initialTab: BodyPart;
  backHref: string;
};

export function ExerciseSelectClient({
  exercises,
  sessionId,
  y,
  m,
  d,
  initialTab,
  backHref,
}: Props) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<BodyPart>(initialTab);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBodyPart, setNewBodyPart] = useState<BodyPart>(initialTab);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSearching = search.trim().length > 0;

  const filtered = useMemo(() => {
    if (isSearching) {
      const q = search.trim().toLowerCase();
      return exercises.filter((ex) => ex.name.toLowerCase().includes(q));
    }
    return exercises.filter((ex) => ex.bodyPart === tab);
  }, [exercises, search, tab, isSearching]);

  function handleDelete(ex: Exercise) {
    const warning = ex.isSystemDefault ? "기본 제공 종목입니다. " : "";
    if (!window.confirm(`${warning}"${ex.name}"을(를) 삭제할까요?`)) return;
    startTransition(async () => {
      await deleteExercise(ex.id);
      router.refresh();
    });
  }

  function openAddForm() {
    setNewName(search.trim());
    setNewBodyPart(isSearching ? initialTab : tab);
    setShowAddForm(true);
  }

  function handleCreate() {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createAndAddExercise(sessionId, newName, newBodyPart, y, m, d);
    });
  }

  return (
    <>
      {/* 검색 입력 */}
      <input
        type="search"
        placeholder="종목 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        autoComplete="off"
      />

      {/* 부위 탭 — 검색 중엔 숨김 */}
      {!isSearching && (
        <div className="mb-3 flex gap-1 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200/80">
          {BODY_PART_ORDER.map((bp) => (
            <button
              key={bp}
              type="button"
              onClick={() => setTab(bp)}
              className={`min-w-fit flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold whitespace-nowrap transition ${
                tab === bp
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {BODY_PART_LABEL[bp]}
            </button>
          ))}
        </div>
      )}

      {/* 종목 리스트 */}
      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            {isSearching
              ? `"${search.trim()}" 검색 결과가 없습니다.`
              : "등록된 종목이 없습니다."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((ex) => {
              const addAction = sessionId
                ? addExerciseToSession.bind(null, sessionId, ex.id, y, m, d)
                : null;

              return (
                <li
                  key={ex.id}
                  className="flex items-center justify-between px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{ex.name}</p>
                    {isSearching ? (
                      <p className="text-xs text-slate-400">
                        {BODY_PART_LABEL[ex.bodyPart]}
                      </p>
                    ) : null}
                    {ex.brand ? (
                      <p className="text-xs text-slate-500">{ex.brand}</p>
                    ) : null}
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(ex)}
                      disabled={isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      aria-label="종목 삭제"
                    >
                      ×
                    </button>
                    {addAction ? (
                      <form action={addAction}>
                        <button
                          type="submit"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white transition hover:bg-blue-700"
                        >
                          +
                        </button>
                      </form>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 직접 추가 */}
      {showAddForm ? (
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
          <p className="mb-3 text-sm font-semibold text-slate-800">
            새 종목 직접 추가
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="종목 이름"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              autoFocus
            />
            <select
              value={newBodyPart}
              onChange={(e) => setNewBodyPart(e.target.value as BodyPart)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            >
              {BODY_PART_ORDER.map((bp) => (
                <option key={bp} value={bp}>
                  {BODY_PART_LABEL[bp]}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newName.trim() || isPending}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "추가 중..." : "추가하기"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openAddForm}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition hover:border-blue-300 hover:text-blue-600"
        >
          + 목록에 없는 종목 직접 추가
        </button>
      )}

      <p className="mt-4 text-center">
        <Link
          href={backHref}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 뒤로 가기
        </Link>
      </p>
    </>
  );
}
