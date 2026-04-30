import { getConfig as getConfigFromPackage } from "@b3tr-testnet-faucet/config"

// Resolve at module load — Next.js inlines NEXT_PUBLIC_* at build time, so this
// works in client components too.
export const getConfig = () => getConfigFromPackage(process.env.NEXT_PUBLIC_APP_ENV)
