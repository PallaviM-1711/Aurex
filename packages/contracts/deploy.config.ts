import type { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deployAll(hre: HardhatRuntimeEnvironment) {
  const message = "Hello, MST!";

  const Hello = await hre.ethers.getContractFactory("Hello");
  const hello = await Hello.deploy(message);
  await hello.waitForDeployment();

  return {
    Hello: {
      address: await hello.getAddress(),
      constructorArguments: [message],
    },
  };
}
