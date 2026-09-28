"use client";

import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useMstWallet } from "@/hooks/useMstWallet";

/**
 * Demonstrates the MST SDK end-to-end: generate a wallet, check its
 * balance through the provider, estimate gas, and send a native transfer.
 * Uses a fresh in-browser burner key, so it's safe to click around with —
 * fund it from the testnet faucet, never a real wallet.
 */
export function SdkWalletPanel() {
  const {
    address,
    balance,
    loadingBalance,
    sending,
    error,
    generateWallet,
    refreshBalance,
    estimateGas,
    sendNative,
  } = useMstWallet();

  const [showKey, setShowKey] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function handleGenerate() {
    const client = generateWallet();
    setPrivateKey(client.signer.getPrivateKey());
    setShowKey(false);
    setGasEstimate(null);
    setTxHash(null);
    setFormError(null);
  }

  async function handleEstimate() {
    setFormError(null);
    setGasEstimate(null);
    try {
      const gas = await estimateGas(to, parseEther(amount || "0").toString());
      setGasEstimate(gas);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gas estimate failed");
    }
  }

  async function handleSend() {
    setFormError(null);
    setTxHash(null);
    try {
      const result = await sendNative(to, parseEther(amount || "0").toString());
      setTxHash(result.txHash);
      setGasEstimate(result.gasLimit);
      setTo("");
      setAmount("");
      setTimeout(refreshBalance, 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Transaction failed");
    }
  }

  return (
    <div className="card">
      <h2>SDK Wallet Playground</h2>
      <p className="hint">
        Powered by <code>@mstblockchain/mst-sdk</code>. Generates a burner wallet in your
        browser — testnet only, never fund it with real assets.
      </p>

      {!address ? (
        <button onClick={handleGenerate}>Generate test wallet</button>
      ) : (
        <>
          <div className="sdk-row">
            <span className="hint">Address</span>
            <span className="wallet-address mono">{address}</span>
          </div>

          <div className="sdk-row">
            <span className="hint">Private key</span>
            {showKey ? (
              <span className="wallet-address mono">{privateKey}</span>
            ) : (
              <button onClick={() => setShowKey(true)}>Reveal</button>
            )}
          </div>

          <div className="sdk-row">
            <span className="hint">Balance</span>
            <span className="wallet-address mono">
              {balance !== null ? `${formatEther(BigInt(balance))} MST` : "—"}
            </span>
            <button disabled={loadingBalance} onClick={refreshBalance}>
              {loadingBalance ? "Checking…" : "Check balance"}
            </button>
          </div>

          <div className="wallet" style={{ marginTop: "1rem" }}>
            <input placeholder="Recipient 0x…" value={to} onChange={(e) => setTo(e.target.value)} />
            <input
              placeholder="Amount (MST)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button disabled={!to || !amount || sending} onClick={handleEstimate}>
              Estimate gas
            </button>
            <button disabled={!to || !amount || sending} onClick={handleSend}>
              {sending ? "Sending…" : "Send"}
            </button>
          </div>

          {gasEstimate && <p className="hint">Estimated gas: {gasEstimate}</p>}
          {txHash && (
            <p className="hint">
              Sent: <span className="mono">{txHash}</span>
            </p>
          )}
          {(formError || error) && <p className="network-warning">{formError ?? error}</p>}
        </>
      )}
    </div>
  );
}
