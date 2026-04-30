import { AppConfig } from "."

const config: AppConfig = {
  environment: "mainnet",
  nodeUrl: "https://mainnet.vechain.org",
  network: {
    id: "mainnet",
    name: "mainnet",
    urls: ["https://mainnet.vechain.org"],
    explorerUrl: "https://explore.vechain.org",
    genesis: {
      id: "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a",
    },
  },
  contracts: {
    // VeBetterDAO B3TR on mainnet
    b3tr: "0x5ef79995FE8a89e0812330E4378eB2660ceDe699",
    // Filled in by deploy:mainnet (a faucet on mainnet is unusual — leave blank by default)
    faucet: "",
  },
}

export default config
