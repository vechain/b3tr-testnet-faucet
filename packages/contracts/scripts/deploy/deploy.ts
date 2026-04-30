import { ethers } from "hardhat"
import { deployProxy } from "../helpers/upgrades"
import { getConfig, AppConfig, AppEnv } from "@b3tr-testnet-faucet/config"
import fs from "fs"
import path from "path"

// Defaults: 100 B3TR per claim, 1 claim per day
const DEFAULT_AMOUNT_PER_CLAIM = ethers.parseEther("100")
const DEFAULT_MAX_CLAIMS_PER_DAY = 1n

async function main() {
  const config = getConfig()
  const [deployer] = await ethers.getSigners()
  console.log(`Deploying to ${config.environment} with ${deployer.address}`)

  let b3trAddress = config.contracts.b3tr

  // On local, deploy a MockB3TR if none is configured.
  if (config.environment === AppEnv.LOCAL && (!b3trAddress || b3trAddress === ethers.ZeroAddress)) {
    console.log("No B3TR configured for local — deploying MockB3TR...")
    const mockFactory = await ethers.getContractFactory("MockB3TR")
    const mock = await mockFactory.deploy()
    await mock.waitForDeployment()
    b3trAddress = await mock.getAddress()
    console.log(`MockB3TR deployed to: ${b3trAddress}`)
  }

  if (!b3trAddress) {
    throw new Error(`No B3TR address available for environment: ${config.environment}`)
  }

  const faucet = await deployProxy(
    "B3TRFaucet",
    [b3trAddress, DEFAULT_AMOUNT_PER_CLAIM, DEFAULT_MAX_CLAIMS_PER_DAY, deployer.address],
    {},
    undefined,
    true,
  )
  const faucetAddress = await faucet.getAddress()
  console.log(`B3TRFaucet deployed to: ${faucetAddress}`)

  await writeConfig(config, { b3tr: b3trAddress, faucet: faucetAddress })
}

async function writeConfig(config: AppConfig, contracts: AppConfig["contracts"]) {
  const newConfig: AppConfig = { ...config, contracts }
  const toWrite = `import { AppConfig } from "."
const config: AppConfig = ${JSON.stringify(newConfig, null, 2)}
export default config
`

  let fileToWrite: string
  switch (config.environment) {
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
      throw new Error(`Unsupported env: ${config.environment}`)
  }

  const configPath = path.resolve(__dirname, `../../../config/${fileToWrite}`)
  console.log(`Writing config to ${configPath}`)
  fs.writeFileSync(configPath, toWrite)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
