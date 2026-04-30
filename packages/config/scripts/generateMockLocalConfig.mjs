import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const generateMockLocalConfig = () => {
  console.log("Checking if @b3tr-testnet-faucet/config/local.ts exists...")
  const localConfigPath = path.resolve(__dirname, "../local.ts")
  if (fs.existsSync(localConfigPath)) {
    console.log(`${localConfigPath} exists, skipping...`)
    return
  }

  console.log(`${localConfigPath} does not exist, generating mock...`)
  const toWrite = `import { AppConfig } from "."
const config: AppConfig = {
  environment: "local",
  nodeUrl: "http://localhost:8669",
  network: {
    id: "solo",
    name: "solo",
    urls: ["http://localhost:8669"],
    explorerUrl: "http://localhost:8669",
    genesis: {
      id: "0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6",
    },
  },
  contracts: {
    b3tr: "0x0000000000000000000000000000000000000000",
    faucet: "0x0000000000000000000000000000000000000000",
  },
}
export default config
`

  console.log(`Writing mock config file to ${localConfigPath}`)
  fs.writeFileSync(localConfigPath, toWrite)
  console.log("Done!")
}

generateMockLocalConfig()
