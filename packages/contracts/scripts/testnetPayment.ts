import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env.local" });

async function main() {
  console.log("\n🚀 AUREX MST TESTNET PAYMENT FLOW\n");

  // --------------------------------------------------
  // 1. Check contract address
  // --------------------------------------------------

  const contractAddress = process.env.AUREX_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error(
      "AUREX_CONTRACT_ADDRESS is not set in the root .env.local file."
    );
  }

  console.log("Contract address:", contractAddress);

  // --------------------------------------------------
  // 2. Get connected wallet
  // --------------------------------------------------

  const [user] = await hre.ethers.getSigners();

  console.log("Wallet address:", user.address);

  const balance = await hre.ethers.provider.getBalance(user.address);

  console.log(
    "Wallet balance:",
    hre.ethers.formatEther(balance),
    "tMSTC"
  );

  // --------------------------------------------------
  // 3. Connect to deployed AurexPayment contract
  // --------------------------------------------------

  const aurex = await hre.ethers.getContractAt(
    "AurexPayment",
    contractAddress,
    user
  );

  console.log("✓ Connected to AurexPayment");

  // --------------------------------------------------
  // 4. Register a service
  // --------------------------------------------------

  console.log("\n📌 Registering service...");

  const pricePerMinute = hre.ethers.parseEther("0.20");

  const registerTx = await aurex.registerService(
    "GPU Pro",
    pricePerMinute
  );

  console.log("Register transaction:", registerTx.hash);

  const registerReceipt = await registerTx.wait();

  console.log(
    "✓ Service registered in block:",
    registerReceipt?.blockNumber
  );

  // --------------------------------------------------
  // 5. Lock budget
  // --------------------------------------------------

  console.log("\n💰 Locking budget...");

  const serviceId = 1;

  const maxBudget = hre.ethers.parseEther("5");

  const lockTx = await aurex.lockBudget(serviceId, {
    value: maxBudget,
  });

  console.log("Budget lock transaction:", lockTx.hash);

  const lockReceipt = await lockTx.wait();

  console.log(
    "✓ Budget locked in block:",
    lockReceipt?.blockNumber
  );

  // --------------------------------------------------
  // 6. Read session
  // --------------------------------------------------

  const sessionId = 1;

  const session = await aurex.getSession(sessionId);

  console.log("\n📋 Session details:");

  console.log("Session ID:", session.id.toString());
  console.log("User:", session.user);
  console.log("Service ID:", session.serviceId.toString());
  console.log(
    "Maximum budget:",
    hre.ethers.formatEther(session.maxBudget),
    "tMSTC"
  );
  console.log("Settled:", session.settled);

  // --------------------------------------------------
  // 7. Settle usage
  // --------------------------------------------------

  console.log("\n⚡ Settling usage...");

  const usageMinutes = 20;

  const expectedCost = pricePerMinute * BigInt(usageMinutes);

  console.log("Usage:", usageMinutes, "minutes");

  console.log(
    "Expected cost:",
    hre.ethers.formatEther(expectedCost),
    "tMSTC"
  );

  const settleTx = await aurex.settleSession(
    sessionId,
    usageMinutes
  );

  console.log("Settlement transaction:", settleTx.hash);

  const settleReceipt = await settleTx.wait();

  console.log(
    "✓ Settlement confirmed in block:",
    settleReceipt?.blockNumber
  );

  // --------------------------------------------------
  // 8. Verify final session
  // --------------------------------------------------

  const finalSession = await aurex.getSession(sessionId);

  console.log("\n✅ FINAL SESSION STATUS");

  console.log("Session ID:", finalSession.id.toString());
  console.log("Settled:", finalSession.settled);

  // --------------------------------------------------
  // 9. Final output
  // --------------------------------------------------

  console.log("\n======================================");
  console.log("🎉 AUREX TESTNET PAYMENT FLOW DONE");
  console.log("======================================");

  console.log("\nContract:");
  console.log(contractAddress);

  console.log("\nRegister TX:");
  console.log(registerTx.hash);

  console.log("\nLock Budget TX:");
  console.log(lockTx.hash);

  console.log("\nSettlement TX:");
  console.log(settleTx.hash);

  console.log("\nMSTScan:");
  console.log(
    `https://testnet.mstscan.com/address/${contractAddress}`
  );

  console.log(
    `https://testnet.mstscan.com/tx/${settleTx.hash}`
  );

  console.log("\n");
}

main().catch((error) => {
  console.error("\n❌ TESTNET PAYMENT FLOW FAILED\n");
  console.error(error);
  process.exitCode = 1;
});