"use client";

import { useAccount } from "wagmi";
import { mstMainnet, mstTestnet } from "@/lib/chains";

const KNOWN_CHAIN_IDS: number[] = [mstTestnet.id, mstMainnet.id];

export function NetworkWarning() {
  const { chainId, isConnected } = useAccount();

  if (!isConnected || !chainId || KNOWN_CHAIN_IDS.includes(chainId)) {
    return null;
  }

  return (
    <p className="network-warning">
      Your wallet is connected to chain {chainId}, which isn&apos;t MST Testnet or MST Mainnet.
      Switch networks in your wallet to use this app.
    </p>
  );
}
