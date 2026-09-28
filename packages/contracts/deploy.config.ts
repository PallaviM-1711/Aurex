import type { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deployAll(hre: HardhatRuntimeEnvironment) {
  const AurexPayment = await hre.ethers.getContractFactory("AurexPayment");

  const aurexPayment = await AurexPayment.deploy();

  await aurexPayment.waitForDeployment();

  return {
    AurexPayment: {
      address: await aurexPayment.getAddress(),
      constructorArguments: [],
    },
  };
}