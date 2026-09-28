"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@/components/ConnectButton";
import { NetworkSwitcher } from "@/components/NetworkSwitcher";
import { NetworkWarning } from "@/components/NetworkWarning";
import { useHello } from "@/hooks/useHello";

export default function Home() {
  const { isConnected } = useAccount();
  const { address, abi, message, refetchMessage } = useHello();
  const { writeContract, isPending } = useWriteContract();
  const [draft, setDraft] = useState("");

  function updateMessage() {
    if (!address || !draft) return;
    writeContract(
      { address, abi, functionName: "setMessage", args: [draft] },
      { onSuccess: () => refetchMessage() }
    );
    setDraft("");
  }

  return (
    <main>
      <h1>{"my-mst-project"}</h1>
      <p>Scaffolded with create-mst-app — blank template.</p>

      <ConnectButton />
      <NetworkSwitcher />
      <NetworkWarning />

      <div className="card">
        <h2>Hello.sol</h2>
        {address ? (
          <>
            <p>
              On-chain message: <strong>{message ?? "loading…"}</strong>
            </p>
            {isConnected && (
              <div className="wallet">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="New message"
                />
                <button disabled={isPending || !draft} onClick={updateMessage}>
                  {isPending ? "Sending…" : "Set message"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p>
            Deploy the contract with <code>npm run deploy:testnet</code> to see it here.
          </p>
        )}
      </div>
    </main>
  );
}
