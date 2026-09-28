import hre from "hardhat";
import promptSyncFactory from "prompt-sync";
import { deployAll } from "../deploy.config";
import { writeDeploymentAddresses } from "./lib/writeDeployment";

async function main() {
  const network = hre.network.name;

  // PRIVATE_KEY is required only for real external networks.
  // Hardhat and localhost provide their own test accounts.
  if (
    network !== "hardhat" &&
    network !== "localhost" &&
    !process.env.PRIVATE_KEY
  ) {
    throw new Error(
      "PRIVATE_KEY not set. Copy .env.example to .env.local and set it."
    );
  }

  // Extra confirmation before deploying to mainnet.
  if (network === "mainnet") {
    console.log("\n🔴 DEPLOYING TO MAINNET");
    console.log(`Chain ID: ${hre.network.config.chainId}\n`);

    const promptSync = promptSyncFactory({ sigint: true });

    const confirm = promptSync(
      "Type 'yes, deploy to mainnet' to continue: "
    );

    if (confirm !== "yes, deploy to mainnet") {
      throw new Error("Deployment cancelled.");
    }
  }

  console.log(`\nDeploying to ${network}...\n`);

  // Deploy contracts defined in deploy.config.ts
  const results = await deployAll(hre);

  const deployed: Record<
    string,
    {
      address: string;
      abi: unknown;
      constructorArguments: unknown[];
    }
  > = {};

  // Read ABI and deployment information for each contract.
  for (const [
    name,
    { address, constructorArguments },
  ] of Object.entries(results)) {
    const artifact = await hre.artifacts.readArtifact(name);

    deployed[name] = {
      address,
      abi: artifact.abi,
      constructorArguments,
    };
  }

  // Save deployment addresses and ABIs.
  writeDeploymentAddresses(network, deployed);

  console.log("✓ Deployed:");

  for (const [name, { address }] of Object.entries(deployed)) {
    console.log(`  ${name}: ${address}`);
  }

  console.log(
    "\nAddresses + ABIs written to packages/shared/src/contracts.ts"
  );

  // Verification is only relevant for external networks.
  if (network !== "hardhat" && network !== "localhost") {
    console.log(`\nNext: npm run verify:${network}\n`);
  }
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:\n");
  console.error(error);
  process.exitCode = 1;
});