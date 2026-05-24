import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "sonner";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EscrowDesk — On-chain bounty escrow",
  description: "Web3 engineer home task: escrow quests with wallet-connected dashboard UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Web3Provider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-right" />
        </Web3Provider>
      </body>
    </html>
  );
}
