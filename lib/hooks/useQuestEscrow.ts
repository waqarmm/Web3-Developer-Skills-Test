"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, zeroAddress } from "viem";
import { QUEST_ESCROW_ADDRESS } from "@/lib/contracts/addresses";
import { questEscrowAbi, QUEST_STATUS_LABELS } from "@/lib/contracts/questEscrowAbi";

type QuestTuple = readonly [
  `0x${string}`,
  `0x${string}`,
  string,
  string,
  bigint,
  `0x${string}`,
  bigint,
  bigint,
  bigint,
  number,
  string,
];

export type QuestView = {
  id: bigint;
  poster: string;
  worker: string;
  title: string;
  description: string;
  reward: bigint;
  token: string;
  acceptDeadline: bigint;
  reviewPeriod: bigint;
  reviewDeadline: bigint;
  status: number;
  statusLabel: (typeof QUEST_STATUS_LABELS)[number];
  deliverableUri: string;
  isEth: boolean;
};

export function useQuestCount() {
  return useReadContract({
    address: QUEST_ESCROW_ADDRESS,
    abi: questEscrowAbi,
    functionName: "questCount",
  });
}

export function useQuest(questId: bigint | undefined) {
  const { data, refetch, isLoading } = useReadContract({
    address: QUEST_ESCROW_ADDRESS,
    abi: questEscrowAbi,
    functionName: "getQuest",
    args: questId !== undefined ? [questId] : undefined,
    query: { enabled: questId !== undefined },
  });

  const row = data as QuestTuple | undefined;
  const quest: QuestView | null =
    row && questId !== undefined
      ? {
          id: questId,
          poster: row[0],
          worker: row[1],
          title: row[2],
          description: row[3],
          reward: row[4],
          token: row[5],
          acceptDeadline: row[6],
          reviewPeriod: row[7],
          reviewDeadline: row[8],
          status: row[9],
          statusLabel: QUEST_STATUS_LABELS[row[9]] ?? "Open",
          deliverableUri: row[10],
          isEth: row[5].toLowerCase() === zeroAddress,
        }
      : null;

  return { quest, refetch, isLoading };
}

export function useQuestList() {
  const { data: count } = useQuestCount();
  const publicClient = usePublicClient();
  const [quests, setQuests] = useState<QuestView[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const total = count as bigint | undefined;
    if (!publicClient || !total || total === 0n) {
      setQuests([]);
      return;
    }
    setLoading(true);
    try {
      const items: QuestView[] = [];
      for (let id = 1n; id <= total; id++) {
        const data = (await publicClient.readContract({
          address: QUEST_ESCROW_ADDRESS,
          abi: questEscrowAbi,
          functionName: "getQuest",
          args: [id],
        })) as QuestTuple;
        items.push({
          id,
          poster: data[0],
          worker: data[1],
          title: data[2],
          description: data[3],
          reward: data[4],
          token: data[5],
          acceptDeadline: data[6],
          reviewPeriod: data[7],
          reviewDeadline: data[8],
          status: data[9],
          statusLabel: QUEST_STATUS_LABELS[data[9]] ?? "Open",
          deliverableUri: data[10],
          isEth: data[5].toLowerCase() === zeroAddress,
        });
      }
      setQuests(items.reverse());
    } finally {
      setLoading(false);
    }
  }, [publicClient, count]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { quests, loading, refresh };
}

export function useCreateQuest() {
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending, data: txHash } = useWriteContract();

  // track confirmation state separately
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const createEthQuest = async (input: {
    title: string;
    description: string;
    rewardEth: string;
    acceptDeadline: Date;
    reviewPeriodHours: number;
  }) => {
    if (!isConnected) throw new Error("Connect MetaMask or another Web3 wallet first");

    const reward = parseEther(input.rewardEth);
    const deadlineUnix = BigInt(Math.floor(input.acceptDeadline.getTime() / 1000));
    const reviewSeconds = BigInt(input.reviewPeriodHours * 3600);

    const hash = await writeContractAsync({
      address: QUEST_ESCROW_ADDRESS,
      abi: questEscrowAbi,
      functionName: "createQuest",
      args: [input.title, input.description, reward, deadlineUnix, reviewSeconds, zeroAddress],
      value: reward,
    });

    // wait for the tx to be mined before resolving
    await publicClient?.waitForTransactionReceipt({ hash });
  };

  return { createEthQuest, isPending: isPending || isConfirming };
}

export function useQuestActions(questId: bigint) {
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending, data: txHash } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  // helper to send a tx and wait for confirmation
  const sendAndWait = async (functionName: string, args: unknown[] = [], value?: bigint) => {
    const hash = await writeContractAsync({
      address: QUEST_ESCROW_ADDRESS,
      abi: questEscrowAbi,
      functionName,
      args,
      ...(value ? { value } : {}),
    } as any);
    await publicClient?.waitForTransactionReceipt({ hash });
  };

  const accept = async () => {
    await sendAndWait("acceptQuest", [questId]);
  };

  const submit = async (deliverableUri: string) => {
    await sendAndWait("submitWork", [questId, deliverableUri]);
  };

  const approve = async () => {
    await sendAndWait("approveAndPay", [questId]);
  };

  const claimTimeout = async () => {
    await sendAndWait("claimTimeoutPayout", [questId]);
  };

  const cancel = async () => {
    await sendAndWait("cancelQuest", [questId]);
  };

  const refund = async () => {
    await sendAndWait("refundPoster", [questId]);
  };

  return { accept, submit, approve, claimTimeout, cancel, refund, isPending: isPending || isConfirming };
}
