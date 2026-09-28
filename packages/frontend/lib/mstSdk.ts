import { Client } from "@mstblockchain/mst-sdk";
import { mstTestnet } from "./chains";

// The SDK talks to the chain over plain JSON-RPC (via ethers'
// JsonRpcProvider under the hood), so it works for read-only calls
// (balances, gas estimates, receipts) without ever needing a private key.
// `createMstClient` optionally accepts one for flows that sign and send
// (see hooks/useMstWallet.ts).
//
// MST Testnet's RPC doesn't send CORS headers, so a browser calling it
// directly is blocked — route through the same-origin proxy at
// app/api/rpc/[network]/route.ts instead. ethers' JsonRpcProvider requires
// an absolute URL, so this resolves it against the current origin; outside
// the browser (SSR) there's no page origin to proxy through, so it falls
// back to the direct RPC URL.
export const MST_RPC_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/rpc/testnet`
    : mstTestnet.rpcUrls.default.http[0];

export function createMstClient(privateKey?: string): InstanceType<typeof Client> {
  return privateKey ? new Client(MST_RPC_URL, privateKey) : Client.createRandom(MST_RPC_URL);
}
