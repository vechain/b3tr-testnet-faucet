import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@vechain/sdk-hardhat-plugin"
import "hardhat-contract-sizer"
import "hardhat-ignore-warnings"
import "solidity-coverage"
import "solidity-docgen"
import { EnvConfig, getConfig } from "@b3tr-testnet-faucet/config"
import { HDKey } from "@vechain/sdk-core"

const SOLO_MNEMONIC = "denial kitchen pet squirrel other broom bar gas better priority spoil cross"

const getSoloUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_ENV
    ? getConfig(process.env.NEXT_PUBLIC_APP_ENV as EnvConfig).network.urls[0]
    : "http://localhost:8669"
  return url
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 1 },
          evmVersion: "paris",
        },
      },
    ],
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    except: ["mocks", "deprecated", "interfaces", "test", "templates", "openzeppelin", "libraries"],
  },
  mocha: {
    timeout: 1800000,
  },
  gasReporter: {
    enabled: false,
    excludeContracts: ["mocks", "deprecated", "interfaces", "test", "templates"],
  },
  docgen: {
    pages: "files",
  },
  defaultNetwork: process.env.IS_TEST_COVERAGE ? "hardhat" : "vechain_solo",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 20,
        accountsBalance: "1000000000000000000000000",
      },
    },
    vechain_solo: {
      url: getSoloUrl(),
      accounts: {
        mnemonic: process.env.MNEMONIC ?? SOLO_MNEMONIC,
        count: 20,
        path: HDKey.VET_DERIVATION_PATH,
        accountsBalance: "1000000000000000000000000",
      },
      gas: 10000000,
    },
    vechain_testnet: {
      url: "https://testnet.vechain.org",
      chainId: 100010,
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "",
        count: 20,
        path: HDKey.VET_DERIVATION_PATH,
      },
      gas: 10000000,
    },
    vechain_mainnet: {
      url: "https://mainnet.vechain.org",
      chainId: 100009,
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "",
        count: 20,
        path: HDKey.VET_DERIVATION_PATH,
      },
      gas: 10000000,
    },
  },
}

export default config
