import { ethers, network } from "hardhat";
import { getConfig, AppEnv } from "@b3tr-testnet-faucet/config";
import { deployFaucet, deployMockB3TR, writeConfig } from "./deploy/deploy";

const config = getConfig();
const env = config.environment;

async function main() {
  console.log(
    `Checking contracts deployment on ${network.name} (${config.nodeUrl})...`,
  );

  try {
    const faucetCode = await getCodeOrEmpty(config.contracts.faucet);
    const b3trCode = await getCodeOrEmpty(config.contracts.b3tr);

    let b3trAddress = config.contracts.b3tr;
    let faucetAddress = config.contracts.faucet;
    let needsConfigWrite = false;

    // On local, the B3TR token must be deployed too (MockB3TR).
    if (env === AppEnv.LOCAL && b3trCode === "0x") {
      console.log(`MockB3TR not deployed at ${b3trAddress} — deploying...`);
      b3trAddress = await deployMockB3TR();
      // Force redeploy faucet too — old faucet (if any) points at a non-existent B3TR.
      faucetAddress = "";
      needsConfigWrite = true;
    } else if (env !== AppEnv.LOCAL && b3trCode === "0x") {
      throw new Error(
        `B3TR token (${b3trAddress}) is not deployed on ${env}. Set the correct address in packages/config/${env}.ts`,
      );
    }

    if (faucetCode === "0x" || faucetAddress === "") {
      console.log(`B3TRFaucet not deployed — deploying...`);
      faucetAddress = await deployFaucet(b3trAddress);
      needsConfigWrite = true;
    } else {
      console.log("Contracts already deployed");
    }

    if (needsConfigWrite) {
      await writeConfig(config, { b3tr: b3trAddress, faucet: faucetAddress });
    }
  } catch (e) {
    console.error(e);
  }

  process.exit(0);
}

async function getCodeOrEmpty(address: string): Promise<string> {
  if (!address || address === ethers.ZeroAddress) return "0x";
  return await ethers.provider.getCode(address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
