"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { mstMainnet, mstTestnet } from "@/lib/chains";

export function NetworkSwitcher() {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const isTestnet = chainId === mstTestnet.id;
  const target = isTestnet ? mstMainnet : mstTestnet;

  return (
    <button
      className="network-switcher"
      disabled={isPending}
      onClick={() => switchChain({ chainId: target.id })}
    >
      Switch to {target.name}
    </button>
  );
}
