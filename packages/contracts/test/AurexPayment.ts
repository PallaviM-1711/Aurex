import { expect } from "chai";
import { ethers } from "hardhat";

describe("AurexPayment", function () {
  it("should lock budget, settle payment, pay provider, and refund unused budget", async function () {
    const [provider, user] = await ethers.getSigners();

    // Deploy AurexPayment
    const AurexPayment = await ethers.getContractFactory("AurexPayment");
    const aurex = await AurexPayment.deploy();

    await aurex.waitForDeployment();

    // ---------------------------------------------------------
    // 1. Provider registers GPU Pro
    // Price = 0.20 MSTC per minute
    // ---------------------------------------------------------

    const pricePerMinute = ethers.parseEther("0.20");

    await aurex
      .connect(provider)
      .registerService("GPU Pro", pricePerMinute);

    const serviceId = 1;

    // Verify service
    const service = await aurex.getService(serviceId);

    expect(service.name).to.equal("GPU Pro");
    expect(service.pricePerMinute).to.equal(pricePerMinute);
    expect(service.provider).to.equal(provider.address);
    expect(service.active).to.equal(true);

    // ---------------------------------------------------------
    // 2. User locks maximum budget
    // Budget = 5 MSTC
    // ---------------------------------------------------------

    const maxBudget = ethers.parseEther("5");

    await aurex
      .connect(user)
      .lockBudget(serviceId, {
        value: maxBudget,
      });

    // Verify session
    const sessionBefore = await aurex.getSession(1);

    expect(sessionBefore.user).to.equal(user.address);
    expect(sessionBefore.serviceId).to.equal(serviceId);
    expect(sessionBefore.maxBudget).to.equal(maxBudget);
    expect(sessionBefore.settled).to.equal(false);

    // ---------------------------------------------------------
    // 3. Record balances before settlement
    // ---------------------------------------------------------

    const providerBalanceBefore = await ethers.provider.getBalance(
      provider.address
    );

    const userBalanceBefore = await ethers.provider.getBalance(
      user.address
    );

    // ---------------------------------------------------------
    // 4. Settle 20 minutes of usage
    //
    // 20 × 0.20 MSTC = 4 MSTC
    // 5 MSTC budget - 4 MSTC = 1 MSTC refund
    // ---------------------------------------------------------

    const tx = await aurex
      .connect(user)
      .settleSession(1, 20);

    const receipt = await tx.wait();

    expect(receipt).to.not.equal(null);

    // Verify settlement event
    await expect(
      Promise.resolve(tx)
    ).to.emit(aurex, "SessionSettled");

    // ---------------------------------------------------------
    // 5. Verify session is settled
    // ---------------------------------------------------------

    const sessionAfter = await aurex.getSession(1);

    expect(sessionAfter.settled).to.equal(true);
    expect(sessionAfter.maxBudget).to.equal(maxBudget);

    // ---------------------------------------------------------
    // 6. Verify smart contract balance is zero
    //
    // Provider received 4 MSTC
    // User received 1 MSTC refund
    // ---------------------------------------------------------

    const contractBalance = await ethers.provider.getBalance(
      await aurex.getAddress()
    );

    expect(contractBalance).to.equal(0);

    // ---------------------------------------------------------
    // 7. Verify provider received 4 MSTC
    // ---------------------------------------------------------

    const providerBalanceAfter = await ethers.provider.getBalance(
      provider.address
    );

    expect(providerBalanceAfter).to.equal(
      providerBalanceBefore + ethers.parseEther("4")
    );

    // ---------------------------------------------------------
    // 8. Verify settlement cannot happen twice
    // ---------------------------------------------------------

    await expect(
      aurex.connect(user).settleSession(1, 20)
    ).to.be.revertedWith("Session already settled");
  });
});