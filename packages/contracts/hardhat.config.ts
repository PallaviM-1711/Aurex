import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

// packages/contracts/.env.local doesn't exist — secrets live at the repo root.
dotenv.config({ path: "../../.env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    testnet: {
      url: "https://testnetrpc.mstblockchain.com",
      chainId: 91562037,
      accounts,
    },
    mainnet: {
      url: "https://mariorpc.mstblockchain.com",
      chainId: 4646,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.MSTSCAN_API_KEY || "",
      testnet: process.env.MSTSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "testnet",
        chainId: 91562037,
        urls: {
          apiURL: "https://testnet.mstscan.com/api",
          browserURL: "https://testnet.mstscan.com",
        },
      },
      {
        network: "mainnet",
        chainId: 4646,
        urls: {
          apiURL: "https://mstscan.com/api",
          browserURL: "https://mstscan.com",
        },
      },
    ],
  },
};

export default config;
