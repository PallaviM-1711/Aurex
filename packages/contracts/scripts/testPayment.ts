import hre from "hardhat";
import { expect } from "chai";

async function main() {
  console.log("\n🚀 Starting Aurex local payment test...\n");

  // --------------------------------------------------
  // 1. Get local Hardhat accounts
  // --------------------------------------------------

  const [provider, user] = await hre.ethers.getSigners();

  console.log("Provider:", provider.address);
  console.log("User:    ", user.address);

  // --------------------------------------------------
  // 2. Deploy AurexPayment
  // --------------------------------------------------

  console.log("\n📦 Deploying AurexPayment...");

  const AurexPayment = await hre.ethers.getContractFactory(
    "AurexPayment"
  );

  const aurex = await AurexPayment.deploy();

  await aurex.waitForDeployment();

  const contractAddress = await aurex.getAddress();

  console.log("AurexPayment:", contractAddress);

  // --------------------------------------------------
  // 3. Register GPU Pro service
  // --------------------------------------------------

  const pricePerMinute = hre.ethers.parseEther("0.20");

  console.log("\n🖥️ Registering GPU Pro...");
  console.log("Price:", hre.ethers.formatEther(pricePerMinute), "MSTC/min");

  const registerTx = await aurex
    .connect(provider)
    .registerService("GPU Pro", pricePerMinute);

  await registerTx.wait();

  const serviceId = 1;

  const service = await aurex.getService(serviceId);

  expect(service.name).to.equal("GPU Pro");
  expect(service.pricePerMinute).to.equal(pricePerMinute);
  expect(service.provider).to.equal(provider.address);
  expect(service.active).to.equal(true);

  console.log("✓ Service registered");
  console.log("Service ID:", serviceId);

  // --------------------------------------------------
  // 4. User locks maximum budget
  // --------------------------------------------------

  const maxBudget = hre.ethers.parseEther("5");

  console.log("\n💰 Locking user budget...");
  console.log("Maximum budget:", hre.ethers.formatEther(maxBudget), "MSTC");

  const lockTx = await aurex
    .connect(user)
    .lockBudget(serviceId, {
      value: maxBudget,
    });

  await lockTx.wait();

  const sessionId = 1;

  const sessionBefore = await aurex.getSession(sessionId);

  expect(sessionBefore.user).to.equal(user.address);
  expect(sessionBefore.serviceId).to.equal(serviceId);
  expect(sessionBefore.maxBudget).to.equal(maxBudget);
  expect(sessionBefore.settled).to.equal(false);

  console.log("✓ Budget locked");
  console.log("Session ID:", sessionId);

  // --------------------------------------------------
  // 5. Record balances before settlement
  // --------------------------------------------------

  const providerBalanceBefore =
    await hre.ethers.provider.getBalance(provider.address);

  // --------------------------------------------------
  // 6. Settle 20 minutes of usage
  // --------------------------------------------------

  const usageMinutes = 20;

  const expectedCost =
    pricePerMinute * BigInt(usageMinutes);

  const expectedRefund =
    maxBudget - expectedCost;

  console.log("\n⏱️ Settling usage...");
  console.log("Usage:", usageMinutes, "minutes");
  console.log(
    "Final cost:",
    hre.ethers.formatEther(expectedCost),
    "MSTC"
  );
  console.log(
    "Expected refund:",
    hre.ethers.formatEther(expectedRefund),
    "MSTC"
  );

  const settleTx = await aurex
    .connect(user)
    .settleSession(sessionId, usageMinutes);

  await settleTx.wait();

  // --------------------------------------------------
  // 7. Verify settlement
  // --------------------------------------------------

  const sessionAfter = await aurex.getSession(sessionId);

  expect(sessionAfter.settled).to.equal(true);
  expect(sessionAfter.maxBudget).to.equal(maxBudget);

  const contractBalance =
    await hre.ethers.provider.getBalance(contractAddress);

  expect(contractBalance).to.equal(0);

  const providerBalanceAfter =
    await hre.ethers.provider.getBalance(provider.address);

  /*
   * Provider receives exactly 4 MSTC.
   */
  expect(providerBalanceAfter).to.equal(
    providerBalanceBefore + expectedCost
  );

  console.log("\n✓ Session settled successfully");
  console.log(
    "✓ Provider received:",
    hre.ethers.formatEther(expectedCost),
    "MSTC"
  );

  console.log(
    "✓ User refund:",
    hre.ethers.formatEther(expectedRefund),
    "MSTC"
  );

  console.log("✓ Contract balance:", "0 MSTC");

  // --------------------------------------------------
  // 8. Verify double settlement is rejected
  // --------------------------------------------------

  console.log("\n🔒 Testing double-settlement protection...");

  let rejected = false;

  try {
    await aurex
      .connect(user)
      .settleSession(sessionId, usageMinutes);
  } catch (error) {
    rejected = true;
  }

  expect(rejected).to.equal(true);

  console.log("✓ Second settlement correctly rejected");

  // --------------------------------------------------
  // 9. Final result
  // --------------------------------------------------

  console.log("\n========================================");
  console.log("🎉 AUREX LOCAL PAYMENT TEST PASSED");
  console.log("========================================");

  console.log("\nContract:");
  console.log(contractAddress);

  console.log("\nService:");
  console.log("GPU Pro");

  console.log("Price:");
  console.log("0.20 MSTC/minute");

  console.log("\nUsage:");
  console.log("20 minutes");

  console.log("\nPayment:");
  console.log("4 MSTC");

  console.log("\nRefund:");
  console.log("1 MSTC");

  console.log("\nSession:");
  console.log("Settled ✅");

  console.log("\nLocal Aurex payment flow is working correctly. 🚀");
}

main().catch((error) => {
  console.error("\n❌ Test failed:\n");
  console.error(error);
  process.exitCode = 1;
});