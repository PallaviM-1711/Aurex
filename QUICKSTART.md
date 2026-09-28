# QUICKSTART

## 1. Install dependencies

Already done if you used `create-mst-app`. Otherwise, from the project root:

```
pnpm/npm install
```

## 2. Add your private key

Copy `.env.example` to `.env.local` (already done for you by `create-mst-app`) and
set `PRIVATE_KEY` to a funded testnet account's private key. **Never commit
`.env.local`.**

## 3. Start the local stack

```
npm run dev
```

This starts a local Hardhat node and the Next.js frontend on http://localhost:3000.

## 4. Run the tests

```
npm run test
```

## 5. Deploy to testnet

```
npm run deploy:testnet
```

Contract addresses and ABIs are written to `packages/shared/src/contracts.ts` and
`packages/contracts/deployments.json` automatically. Refresh the frontend and your
deployed contract shows up in the example page.

## 6. Verify on MSTScan (optional)

```
npm run verify:testnet
```

## 7. Ship to mainnet

```
npm run deploy:mainnet
```

You'll be asked to type a confirmation phrase before anything is sent to mainnet.
