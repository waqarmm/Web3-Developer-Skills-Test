"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useQuestList } from "@/lib/hooks/useQuestEscrow";
import { QuestTable } from "@/components/quest/quest-table";
import { shortAddress } from "@/lib/utils/format";

export default function HomePage() {
  const { isConnected, address } = useAccount();
  const { quests, loading } = useQuestList();

  const openCount = quests.filter((q) => q.status === 0).length;
  const activeCount = quests.filter((q) => q.status >= 1 && q.status <= 2).length;
  const doneCount = quests.filter((q) => q.status === 3).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="eyebrow">Web3 home task</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Implement the escrow contract, then wire this dashboard so clients and freelancers can post,
          accept, and settle quests on-chain via the sidebar wallet.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Wallet</p>
          <p className="mt-1 text-lg font-semibold">
            {isConnected ? (
              <span className="text-[var(--success)]">{shortAddress(address!)}</span>
            ) : (
              <span className="text-[var(--warning)]">Not connected</span>
            )}
          </p>
          {!isConnected && (
            <p className="mt-1 text-xs text-[var(--muted)]">Use Connect Wallet in the sidebar</p>
          )}
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Open quests</p>
          <p className="mt-1 text-2xl font-bold">{loading ? "—" : openCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">In progress</p>
          <p className="mt-1 text-2xl font-bold">{loading ? "—" : activeCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Completed</p>
          <p className="mt-1 text-2xl font-bold">{loading ? "—" : doneCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/quests" className="btn-primary">
          View quest board
        </Link>
        <Link href="/quests/create" className="btn-secondary">
          Post a quest
        </Link>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent quests</h2>
          <Link href="/quests" className="text-sm font-medium text-[var(--accent)] hover:underline">
            See all
          </Link>
        </div>
        {loading && <p className="text-sm text-[var(--muted)]">Loading from contract…</p>}
        {!loading && <QuestTable quests={quests.slice(0, 5)} compact />}
      </section>
    </div>
  );
}
