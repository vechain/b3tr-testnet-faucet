export interface UpgradeContract {
  name: string
  configAddressField: string
  versions: readonly string[]
  descriptions: Record<string, string>
}

export const upgradeConfig: Record<string, UpgradeContract> = {
  // Add entries here when creating B3TRFaucetV2, V3, etc.
  // B3TRFaucet: {
  //   name: "b3tr-faucet",
  //   configAddressField: "faucet",
  //   versions: ["v2"],
  //   descriptions: {
  //     v2: "Description of what V2 changes",
  //   },
  // },
} as const
