"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="wallet">
        <span className="wallet-address">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className="wallet">
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })} disabled={isPending}>
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}
