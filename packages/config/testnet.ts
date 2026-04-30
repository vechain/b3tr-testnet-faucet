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
    "b3tr": "0x026771d1be764467f8bdb78bb230df10c924b00d",
    "faucet": "0xfca716f9c93575f428fe49402424454077ccbfee"
  }
}
export default config
