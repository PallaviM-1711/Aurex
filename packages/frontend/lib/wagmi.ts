import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { mstMainnet, mstTestnet } from "./chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [mstTestnet, mstMainnet],
  connectors: [
    injected(),
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  // Same-origin proxy, not the RPC URLs directly — MST Testnet's RPC
  // doesn't send CORS headers, so a direct browser fetch to it is blocked.
  // See app/api/rpc/[network]/route.ts.
  transports: {
    [mstTestnet.id]: http("/api/rpc/testnet"),
    [mstMainnet.id]: http("/api/rpc/mainnet"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
