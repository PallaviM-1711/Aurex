import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const network = hre.network.name;
  const deploymentsPath = path.join(__dirname, "..", "deployments.json");

  if (!fs.existsSync(deploymentsPath)) {
    throw new Error(`No deployments.json found. Run "npm run deploy:${network}" first.`);
  }

  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
  const forNetwork = deployments[network];

  if (!forNetwork || Object.keys(forNetwork).length === 0) {
    throw new Error(`No contracts deployed to ${network} yet.`);
  }

  for (const [name, info] of Object.entries(
    forNetwork as Record<string, { address: string; constructorArguments: unknown[] }>
  )) {
    console.log(`Verifying ${name} at ${info.address} on ${network}...`);
    try {
      await hre.run("verify:verify", {
        address: info.address,
        constructorArguments: info.constructorArguments ?? [],
      });
      console.log(`✓ ${name} verified`);
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes("already verified")) {
        console.log(`✓ ${name} already verified`);
      } else {
        console.error(`✖ Failed to verify ${name}:`, error?.message ?? error);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
