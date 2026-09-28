"use client";

import { useAccount, useReadContract } from "wagmi";
import { deployments } from "my-mst-project-shared";
import { mstMainnet } from "@/lib/chains";

export function useHello() {
  const { chainId } = useAccount();
  const network = chainId === mstMainnet.id ? "mainnet" : "testnet";
  const entry = (deployments as Record<string, any>)[network]?.Hello as
    | { address: `0x${string}`; abi: any }
    | undefined;

  const { data: message, refetch: refetchMessage } = useReadContract({
    address: entry?.address,
    abi: entry?.abi,
    functionName: "getMessage",
    query: { enabled: Boolean(entry) },
  });

  return {
    address: entry?.address,
    abi: entry?.abi,
    message: message as string | undefined,
    refetchMessage,
  };
}
