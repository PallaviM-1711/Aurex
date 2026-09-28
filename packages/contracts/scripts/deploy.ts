import hre from "hardhat";
import promptSyncFactory from "prompt-sync";
import { deployAll } from "../deploy.config";
import { writeDeploymentAddresses } from "./lib/writeDeployment";

async function main() {
  const network = hre.network.name;

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set. Copy .env.example to .env.local and set it.");
  }

  if (network === "mainnet") {
    console.log("\n🔴 DEPLOYING TO MAINNET");
    console.log(`Chain ID: ${hre.network.config.chainId}\n`);
    const promptSync = promptSyncFactory({ sigint: true });
    const confirm = promptSync("Type 'yes, deploy to mainnet' to continue: ");
    if (confirm !== "yes, deploy to mainnet") {
      throw new Error("Deployment cancelled.");
    }
  }

  console.log(`\nDeploying to ${network}...\n`);

  const results = await deployAll(hre);

  const deployed: Record<
    string,
    { address: string; abi: unknown; constructorArguments: unknown[] }
  > = {};
  for (const [name, { address, constructorArguments }] of Object.entries(results)) {
    const artifact = await hre.artifacts.readArtifact(name);
    deployed[name] = { address, abi: artifact.abi, constructorArguments };
  }

  writeDeploymentAddresses(network, deployed);

  console.log("✓ Deployed:");
  for (const [name, { address }] of Object.entries(deployed)) {
    console.log(`  ${name}: ${address}`);
  }
  console.log(`\nAddresses + ABIs written to packages/shared/src/contracts.ts`);

  if (network !== "hardhat" && network !== "localhost") {
    console.log(`\nNext: npm run verify:${network}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
