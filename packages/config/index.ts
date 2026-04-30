import localConfig from "./local"
import testnetConfig from "./testnet"
import mainnetConfig from "./mainnet"

export type AppConfig = {
  environment: string
  nodeUrl: string
  network: {
    id: string
    name: string
    urls: string[]
    explorerUrl: string
    genesis: {
      id: string
    }
  }
  contracts: {
    /** B3TR token (ERC20). On local, this is a deployed MockB3TR. */
    b3tr: string
    /** B3TRFaucet proxy address. */
    faucet: string
  }
}

export const AppEnv = {
  LOCAL: "local",
  TESTNET: "testnet",
  MAINNET: "mainnet",
} as const

export type EnvConfig = (typeof AppEnv)[keyof typeof AppEnv]

export const getConfig = (env?: string): AppConfig => {
  const appEnv = env || process.env.NEXT_PUBLIC_APP_ENV
  if (!appEnv) throw new Error("NEXT_PUBLIC_APP_ENV must be set or env must be passed to getConfig()")

  switch (appEnv) {
    case AppEnv.LOCAL:
      return localConfig
    case AppEnv.TESTNET:
      return testnetConfig
    case AppEnv.MAINNET:
      return mainnetConfig
    default:
      throw new Error(`Unsupported NEXT_PUBLIC_APP_ENV: ${appEnv}`)
  }
}
