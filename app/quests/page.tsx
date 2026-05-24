"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuestList } from "@/lib/hooks/useQuestEscrow";
import { QuestTable } from "@/components/quest/quest-table";
import { QUEST_STATUS_LABELS } from "@/lib/contracts/questEscrowAbi";

const FILTERS = [
  { key: "all", label: "All" },
  ...QUEST_STATUS_LABELS.map((label, i) => ({ key: String(i), label })),
];

export default function QuestBoardPage() {
  const { quests, loading, refresh } = useQuestList();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return quests;
    return quests.filter((q) => q.status === Number(filter));
  }, [quests, filter]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quest board</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Browse and manage on-chain bounties.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => refresh()}>
            Refresh
          </button>
          <Link href="/quests/create" className="btn-primary">
            Post quest
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`chip ${filter === f.key ? "chip-active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-[var(--muted)]">Reading chain state…</p>}
      {!loading && <QuestTable quests={filtered} />}
    </div>
  );
}
