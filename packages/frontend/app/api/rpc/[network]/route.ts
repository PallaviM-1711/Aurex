import { NextRequest, NextResponse } from "next/server";

/**
 * Same-origin proxy for MST JSON-RPC calls.
 *
 * The MST Testnet RPC (testnetrpc.mstblockchain.com) doesn't send
 * Access-Control-Allow-Origin headers, so a browser calling it directly via
 * fetch — which is what wagmi's public client does for every contract read
 * — gets blocked by CORS before the request even reaches it (MST Mainnet's
 * RPC does set these headers correctly; this is a testnet-only gap).
 * Wallet-signed writes are unaffected since those go through the wallet
 * extension's own provider, not a page-level fetch.
 *
 * Routing reads through this same-origin Next.js route handler sidesteps
 * the problem: the browser only ever talks to same-origin /api/rpc/*, and
 * this server-side handler — not bound by CORS — forwards to the real RPC.
 */
const RPC_URLS: Record<string, string> = {
  testnet: "https://testnetrpc.mstblockchain.com",
  mainnet: "https://mariorpc.mstblockchain.com",
};

export async function POST(request: NextRequest, { params }: { params: { network: string } }) {
  const target = RPC_URLS[params.network];
  if (!target) {
    return NextResponse.json({ error: `Unknown network "${params.network}"` }, { status: 400 });
  }

  const body = await request.text();

  const upstream = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
