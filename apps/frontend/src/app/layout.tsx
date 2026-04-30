import type { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"

const ClientApp = dynamic(() => import("./ClientApp").then(mod => mod.ClientApp), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading…
    </div>
  ),
})

const TITLE = "B3TR Testnet Faucet"
const DESCRIPTION =
  "Claim B3TR tokens on VeChain testnet. Connect your wallet and get up to the daily limit per address."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: TITLE,
  keywords: ["VeChain", "B3TR", "VeBetterDAO", "Faucet", "Testnet"],
  authors: [{ name: "Vechain Foundation" }],
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: "#004CFC",
  width: "device-width",
  initialScale: 1,
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
