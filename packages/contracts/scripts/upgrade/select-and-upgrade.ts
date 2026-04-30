import inquirer from "inquirer"
import { upgradeConfig } from "./upgradesConfig"
import { getConfig } from "@b3tr-testnet-faucet/config"
import { ethers, network } from "hardhat"
import { upgradeProxy } from "../helpers/upgrades"

async function main() {
  const env = process.env.NEXT_PUBLIC_APP_ENV
  if (!env) throw new Error("NEXT_PUBLIC_APP_ENV is not set")

  const config = getConfig()

  if (Object.keys(upgradeConfig).length === 0) {
    console.log("No upgrades configured yet. Add entries to upgradesConfig.ts first.")
    process.exit(0)
  }

  const { contract } = await inquirer.prompt<{ contract: keyof typeof upgradeConfig }>({
    type: "list",
    name: "contract",
    message: "Which contract do you want to upgrade?",
    choices: Object.keys(upgradeConfig),
  })

  const selected = upgradeConfig[contract]
  const { version } = await inquirer.prompt<{ version: string }>({
    type: "list",
    name: "version",
    message: `Which version do you want to upgrade ${contract} to?`,
    choices: selected.versions.map((v) => ({
      name: `${v} - ${selected.descriptions[v]}`,
      value: v,
    })),
  })

  const deployer = (await ethers.getSigners())[0]
  const address = (config.contracts as any)[selected.configAddressField]

  console.log(`\nContract: ${selected.name}`)
  console.log(`Address: ${address}`)
  console.log(`Version: ${version}`)
  console.log(`Upgrader: ${deployer.address}`)
  console.log(`Network: ${network.name}\n`)

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
    type: "confirm",
    name: "confirm",
    message: "Proceed with upgrade?",
    default: false,
  })

  if (!confirm) {
    console.log("Upgrade aborted.")
    process.exit(0)
  }

  const versionNum = parseInt(version.replace("v", ""))
  const previousVersion = versionNum === 2 ? contract : `${contract}V${versionNum - 1}`
  const newVersion = contract

  const upgraded = await upgradeProxy(
    String(previousVersion),
    String(newVersion),
    address,
    [],
    { version: versionNum },
  )

  const newVer = await (upgraded as any).version()
  console.log(`Upgrade complete! New version: ${newVer}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
