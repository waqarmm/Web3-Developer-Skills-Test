import Link from "next/link";
import { format } from "date-fns";
import type { QuestView } from "@/lib/hooks/useQuestEscrow";
import { StatusBadge } from "./status-badge";
import { formatReward, shortAddress } from "@/lib/utils/format";

type QuestTableProps = {
  quests: QuestView[];
  compact?: boolean;
};

export function QuestTable({ quests, compact = false }: QuestTableProps) {
  if (quests.length === 0) {
    return (
      <p className="surface p-6 text-sm text-[var(--muted)]">
        No quests yet. Deploy <code className="text-xs">QuestEscrow</code>, set{" "}
        <code className="text-xs">.env.local</code>, then post one.
      </p>
    );
  }

  return (
    <div className="table-wrap">
      <table className="quest-table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            {!compact && <th>Description</th>}
            <th>Status</th>
            <th>Reward</th>
            <th>Poster</th>
            {!compact && <th>Worker</th>}
            <th>Accept by</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quests.map((q) => (
            <tr key={String(q.id)}>
              <td className="font-mono text-sm text-[var(--muted)]">#{String(q.id)}</td>
              <td className="font-medium">{q.title}</td>
              {!compact && (
                <td className="max-w-[200px] truncate text-[var(--muted)]">{q.description}</td>
              )}
              <td>
                <StatusBadge status={q.status} />
              </td>
              <td>{formatReward(q.reward, q.isEth)}</td>
              <td className="font-mono text-sm">{shortAddress(q.poster)}</td>
              {!compact && (
                <td className="font-mono text-sm">
                  {q.worker === "0x0000000000000000000000000000000000000000"
                    ? "—"
                    : shortAddress(q.worker)}
                </td>
              )}
              <td className="text-sm text-[var(--muted)]">
                {format(Number(q.acceptDeadline) * 1000, "PP")}
              </td>
              <td>
                <Link
                  href={`/quests/${q.id}`}
                  className="text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
