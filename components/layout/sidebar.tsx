"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/quests", label: "Quest board" },
  { href: "/quests/create", label: "Post quest" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <Link href="/" className="block">
          <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">EscrowDesk</span>
          <span className="mt-0.5 block text-xs text-[var(--muted)]">On-chain bounty escrow</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--accent-muted)] text-[var(--accent-hover)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Wallet</p>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </aside>
  );
}
