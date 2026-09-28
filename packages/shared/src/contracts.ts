// This file is overwritten by `npm run deploy:testnet` / `npm run deploy:mainnet`.
// No contracts have been deployed yet.

export const deployments = {} as const;

export type NetworkName = keyof typeof deployments;
