import type { Metadata } from "next"
import dynamic from "next/dynamic"

const ClientApp = dynamic(() => import("./ClientApp").then(mod => mod.ClientApp), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading…
    </div>
  ),
})

export const metadata: Metadata = {
  title: "B3TR Testnet Faucet",
  description: "B3TR Testnet Faucet — claim B3TR tokens on VeChain testnet",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientApp>{children}</ClientApp>
      </body>
    </html>
  )
}
