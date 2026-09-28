import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env.local" });

async function main() {
  console.log("\n🚀 AUREX MST TESTNET PAYMENT FLOW\n");

  const network = hre.network.name;

  if (network !== "testnet") {
    throw new Error(
      `This script must run on MST Testnet. Current network: ${network}`
    );
  }

  console.log("Network:", network);
  console.log("Chain ID:", hre.network.config.chainId);

  const contractAddress = process.env.AUREX_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error(
      "AUREX_CONTRACT_ADDRESS is not set in the root .env.local file."
    );
  }

  console.log("Contract address:", contractAddress);

  const [user] = await hre.ethers.getSigners();

  console.log("Wallet address:", user.address);

  const balance = await hre.ethers.provider.getBalance(user.address);

  console.log(
    "Wallet balance:",
    hre.ethers.formatEther(balance),
    "tMSTC"
  );

  if (balance === 0n) {
    throw new Error(
      "Wallet has 0 tMSTC. Fund the wallet before running the Testnet payment flow."
    );
  }

  const aurex = await hre.ethers.getContractAt(
    "AurexPayment",
    contractAddress,
    user
  );

  console.log("✓ Connected to AurexPayment");

  // --------------------------------------------------
  // 1. REGISTER SERVICE
  // --------------------------------------------------

  console.log("\n📌 Registering service...");

  const pricePerMinute = hre.ethers.parseEther("0.20");

  const registerTx = await aurex.registerService(
    "GPU Pro",
    pricePerMinute
  );

  console.log("Register transaction:", registerTx.hash);

  const registerReceipt = await registerTx.wait();

  if (!registerReceipt) {
    throw new Error("Service registration transaction failed.");
  }

  console.log(
    "✓ Service registered in block:",
    registerReceipt.blockNumber
  );

  const serviceRegisteredEvent = registerReceipt.logs
    .map((log: any) => {
      try {
        return aurex.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(
      (event: any) => event?.name === "ServiceRegistered"
    );

  if (!serviceRegisteredEvent) {
    throw new Error(
      "Could not find ServiceRegistered event."
    );
  }

  const serviceId = serviceRegisteredEvent.args.serviceId;

  console.log(
    "Service ID:",
    serviceId.toString()
  );

  // --------------------------------------------------
  // 2. LOCK USER BUDGET
  // --------------------------------------------------

  console.log("\n💰 Locking budget...");

  const maxBudget = hre.ethers.parseEther("5");

  const lockTx = await aurex.lockBudget(serviceId, {
    value: maxBudget,
  });

  console.log("Budget lock transaction:", lockTx.hash);

  const lockReceipt = await lockTx.wait();

  if (!lockReceipt) {
    throw new Error("Budget lock transaction failed.");
  }

  console.log(
    "✓ Budget locked in block:",
    lockReceipt.blockNumber
  );

  const budgetLockedEvent = lockReceipt.logs
    .map((log: any) => {
      try {
        return aurex.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(
      (event: any) => event?.name === "BudgetLocked"
    );

  if (!budgetLockedEvent) {
    throw new Error(
      "Could not find BudgetLocked event."
    );
  }

  const sessionId = budgetLockedEvent.args.sessionId;

  console.log(
    "Session ID:",
    sessionId.toString()
  );

  // --------------------------------------------------
  // 3. SHOW SESSION DETAILS
  // --------------------------------------------------

  const session = await aurex.getSession(sessionId);

  console.log("\n📋 Session details:");

  console.log(
    "Session ID:",
    session.id.toString()
  );

  console.log("User:", session.user);

  console.log(
    "Service ID:",
    session.serviceId.toString()
  );

  console.log(
    "Maximum budget:",
    hre.ethers.formatEther(session.maxBudget),
    "tMSTC"
  );

  console.log("Settled:", session.settled);

  // --------------------------------------------------
  // 4. SETTLE USAGE
  // --------------------------------------------------

  console.log("\n⚡ Settling usage...");

  const usageMinutes = 20;

  const expectedCost =
    pricePerMinute * BigInt(usageMinutes);

  const expectedRefund =
    maxBudget - expectedCost;

  console.log(
    "Usage:",
    usageMinutes,
    "minutes"
  );

  console.log(
    "Expected cost:",
    hre.ethers.formatEther(expectedCost),
    "tMSTC"
  );

  console.log(
    "Expected refund:",
    hre.ethers.formatEther(expectedRefund),
    "tMSTC"
  );

  const settleTx = await aurex.settleSession(
    sessionId,
    usageMinutes
  );

  console.log(
    "Settlement transaction:",
    settleTx.hash
  );

  const settleReceipt = await settleTx.wait();

  if (!settleReceipt) {
    throw new Error("Settlement transaction failed.");
  }

  console.log(
    "✓ Settlement confirmed in block:",
    settleReceipt.blockNumber
  );

  // --------------------------------------------------
  // 5. READ SETTLEMENT EVENT
  // --------------------------------------------------

  const sessionSettledEvent = settleReceipt.logs
    .map((log: any) => {
      try {
        return aurex.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(
      (event: any) => event?.name === "SessionSettled"
    );

  if (!sessionSettledEvent) {
    throw new Error(
      "Could not find SessionSettled event."
    );
  }

  const eventUsageMinutes =
    sessionSettledEvent.args.usageMinutes;

  const providerPayment =
    sessionSettledEvent.args.providerPayment;

  const userRefund =
    sessionSettledEvent.args.userRefund;

  // --------------------------------------------------
  // 6. VERIFY FINAL SESSION
  // --------------------------------------------------

  const finalSession =
    await aurex.getSession(sessionId);

  if (!finalSession.settled) {
    throw new Error(
      "Session was not marked as settled."
    );
  }

  // --------------------------------------------------
  // 7. FINAL RESULT
  // --------------------------------------------------

  console.log("\n======================================");
  console.log("🎉 AUREX TESTNET PAYMENT SUCCESS");
  console.log("======================================");

  console.log("\nContract:");
  console.log(contractAddress);

  console.log("\nService ID:");
  console.log(serviceId.toString());

  console.log("\nSession ID:");
  console.log(sessionId.toString());

  console.log("\nUsage:");
  console.log(
    eventUsageMinutes.toString(),
    "minutes"
  );

  console.log("\nProvider payment:");
  console.log(
    hre.ethers.formatEther(providerPayment),
    "tMSTC"
  );

  console.log("\nUser refund:");
  console.log(
    hre.ethers.formatEther(userRefund),
    "tMSTC"
  );

  console.log("\nRegister TX:");
  console.log(registerTx.hash);

  console.log("\nLock Budget TX:");
  console.log(lockTx.hash);

  console.log("\nSettlement TX:");
  console.log(settleTx.hash);

  console.log("\nMSTScan Contract:");
  console.log(
    `https://testnet.mstscan.com/address/${contractAddress}`
  );

  console.log("\nMSTScan Settlement TX:");
  console.log(
    `https://testnet.mstscan.com/tx/${settleTx.hash}`
  );

  console.log("\n✅ Real MST Testnet payment flow completed.\n");
}

main().catch((error) => {
  console.error(
    "\n❌ TESTNET PAYMENT FLOW FAILED\n"
  );

  console.error(error);

  process.exitCode = 1;
});