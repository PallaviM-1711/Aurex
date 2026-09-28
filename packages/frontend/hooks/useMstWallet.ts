"use client";

import { useCallback, useState } from "react";
import { createMstClient } from "@/lib/mstSdk";

type MstClient = ReturnType<typeof createMstClient>;

export interface SendResult {
  txHash: string;
  gasLimit: string;
}

/**
 * Drives the MST SDK directly: a burner wallet generated in-browser for
 * trying out balance checks, gas estimation, and native sends without
 * touching the user's real wallet. Separate from the wagmi ConnectButton,
 * which remains the way to transact from a real, browser-extension wallet.
 */
export function useMstWallet() {
  const [client, setClient] = useState<MstClient | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWallet = useCallback(() => {
    const nextClient = createMstClient();
    setClient(nextClient);
    setAddress(nextClient.signer.address);
    setBalance(null);
    setError(null);
    return nextClient;
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!client || !address) return;
    setLoadingBalance(true);
    setError(null);
    try {
      const raw = await client.provider.getBalance(address);
      setBalance(raw.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setLoadingBalance(false);
    }
  }, [client, address]);

  const estimateGas = useCallback(
    async (to: string, amountWei: string) => {
      if (!client) throw new Error("Generate a wallet first");
      const gasLimit = await client.signer.estimateGas("sendNative", [to, amountWei]);
      return gasLimit.toString();
    },
    [client]
  );

  const sendNative = useCallback(
    async (to: string, amountWei: string): Promise<SendResult> => {
      if (!client) throw new Error("Generate a wallet first");
      setSending(true);
      setError(null);
      try {
        const gasLimit = await client.signer.estimateGas("sendNative", [to, amountWei]);
        const txHash = await client.signer.sendNative(to, amountWei);
        return { txHash, gasLimit: gasLimit.toString() };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transaction failed");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [client]
  );

  return {
    client,
    address,
    balance,
    loadingBalance,
    sending,
    error,
    generateWallet,
    refreshBalance,
    estimateGas,
    sendNative,
  };
}
