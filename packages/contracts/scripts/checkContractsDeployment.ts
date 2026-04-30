import { ethers, network } from "hardhat"
import { getConfig, AppConfig, AppEnv } from "@b3tr-testnet-faucet/config"
import { deployProxy } from "./helpers/upgrades"
import fs from "fs"
import path from "path"

const DEFAULT_AMOUNT_PER_CLAIM = ethers.parseEther("100")
const DEFAULT_MAX_CLAIMS_PER_DAY = 1n

const config = getConfig()
const env = config.environment

async function main() {
  console.log(`Checking contracts deployment on ${network.name} (${config.nodeUrl})...`)

  try {
    const faucetCode = await getCodeOrEmpty(config.contracts.faucet)
    const b3trCode = await getCodeOrEmpty(config.contracts.b3tr)

    let b3trAddress = config.contracts.b3tr
    let faucetAddress = config.contracts.faucet
    let needsConfigWrite = false

    // On local, the B3TR token must be deployed too (MockB3TR).
    if (env === AppEnv.LOCAL && b3trCode === "0x") {
      console.log(`MockB3TR not deployed at ${b3trAddress} — deploying...`)
      const [deployer] = await ethers.getSigners()
      const mockFactory = await ethers.getContractFactory("MockB3TR")
      const mock = await mockFactory.connect(deployer).deploy()
      await mock.waitForDeployment()
      b3trAddress = await mock.getAddress()
      console.log(`MockB3TR deployed to: ${b3trAddress}`)
      // Force redeploy faucet too — old faucet (if any) points at a non-existent B3TR.
      faucetAddress = ""
      needsConfigWrite = true
    } else if (env !== AppEnv.LOCAL && b3trCode === "0x") {
      throw new Error(
        `B3TR token (${b3trAddress}) is not deployed on ${env}. Set the correct address in packages/config/${env}.ts`,
      )
    }

    if (faucetCode === "0x" || faucetAddress === "") {
      console.log(`B3TRFaucet not deployed — deploying...`)
      const [deployer] = await ethers.getSigners()
      const faucet = await deployProxy(
        "B3TRFaucet",
        [b3trAddress, DEFAULT_AMOUNT_PER_CLAIM, DEFAULT_MAX_CLAIMS_PER_DAY, deployer.address],
        {},
        undefined,
        true,
      )
      faucetAddress = await faucet.getAddress()
      console.log(`B3TRFaucet deployed to: ${faucetAddress}`)
      needsConfigWrite = true
    } else {
      console.log("Contracts already deployed")
    }

    if (needsConfigWrite) {
      await overrideConfigWithNewContracts(b3trAddress, faucetAddress)
    }
  } catch (e) {
    console.error(e)
  }

  process.exit(0)
}

async function getCodeOrEmpty(address: string): Promise<string> {
  if (!address || address === ethers.ZeroAddress) return "0x"
  return await ethers.provider.getCode(address)
}

async function overrideConfigWithNewContracts(b3trAddress: string, faucetAddress: string) {
  const newConfig: AppConfig = {
    ...config,
    contracts: { b3tr: b3trAddress, faucet: faucetAddress },
  }

  const toWrite = `import { AppConfig } from "."
const config: AppConfig = ${JSON.stringify(newConfig, null, 2)}
export default config
`

  let fileToWrite: string
  switch (env) {
    case AppEnv.LOCAL:
      fileToWrite = "local.ts"
      break
    case AppEnv.TESTNET:
      fileToWrite = "testnet.ts"
      break
    case AppEnv.MAINNET:
      fileToWrite = "mainnet.ts"
      break
    default:
      throw new Error(`Unsupported NEXT_PUBLIC_APP_ENV: ${env}`)
  }

  const configPath = path.resolve(__dirname, `../../config/${fileToWrite}`)
  console.log(`Writing new config to ${configPath}`)
  fs.writeFileSync(configPath, toWrite)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
