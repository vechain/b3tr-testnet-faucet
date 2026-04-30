import { AppConfig } from "."
const config: AppConfig = {
  "environment": "testnet",
  "nodeUrl": "https://testnet.vechain.org",
  "network": {
    "id": "testnet",
    "name": "testnet",
    "urls": [
      "https://testnet.vechain.org"
    ],
    "explorerUrl": "https://explore-testnet.vechain.org",
    "genesis": {
      "id": "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127"
    }
  },
  "contracts": {
    "b3tr": "0x95761346d18244bb91664181bf91193376197088",
    "faucet": "0x377425b1db8d03f3c9fb8af0e88860b86a18d17e"
  }
}
export default config
