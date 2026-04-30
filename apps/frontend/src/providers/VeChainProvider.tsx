"use client"

import dynamic from "next/dynamic"
import { useColorMode } from "@/components/ui/color-mode"

const VeChainKitProvider = dynamic(
  () => import("@vechain/vechain-kit").then(mod => mod.VeChainKitProvider),
  { ssr: false },
)

interface Props {
  readonly children: React.ReactNode
}

export function VeChainProvider({ children }: Props) {
  const { colorMode } = useColorMode()
  const isDarkMode = colorMode === "dark"
  const networkType = (process.env.NEXT_PUBLIC_NETWORK ?? "test") as "main" | "test"

  return (
    <VeChainKitProvider
      dappKit={{
        allowedWallets: ["veworld", "wallet-connect"],
        walletConnectOptions: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
          ? {
              projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
              metadata: {
                name: "B3TR Testnet Faucet",
                description: "B3TR Testnet Faucet — VeChain dApp",
                url: typeof window !== "undefined" ? window.location.origin : "",
                icons: [],
              },
            }
          : undefined,
      }}
      loginMethods={[
        { method: "vechain", gridColumn: 4 },
        { method: "dappkit", gridColumn: 4 },
      ]}
      darkMode={isDarkMode}
      language="en"
      network={{ type: networkType }}>
      {children}
    </VeChainKitProvider>
  )
}
