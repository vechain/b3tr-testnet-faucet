# B3TR Testnet Faucet

A faucet dApp for distributing B3TR tokens on VeChain testnet. Users can claim a fixed amount per day; the owner can fund and configure the faucet.

## Stack

- Next.js 14 (App Router, static export) + Chakra UI v3
- VeChain Kit (VeWorld + WalletConnect)
- Hardhat + OpenZeppelin UUPS
- Turborepo monorepo

## Local development

```bash
nvm use
yarn install
cp .env.example .env
make solo-up   # Thor solo node (Docker)
yarn dev       # auto-deploys MockB3TR + B3TRFaucet to solo
```

For testnet:

```bash
yarn dev:testnet
```

Stop solo: `make solo-down` — Reset: `make solo-clean && make solo-up`.

## Contracts

- `B3TRFaucet` — UUPS upgradeable. Holds B3TR; users call `claimTokens()` up to `maxClaimsPerDay` per day. Owner can `fundFaucet`, `setAmountPerClaim`, `setMaxClaimsPerDay`.
- `MockB3TR` — minimal ERC20 used only on local solo (so you can mint and fund the faucet without a real B3TR deploy).

```bash
yarn contracts:compile
yarn contracts:test
```

## Deployment

```bash
yarn workspace @b3tr-testnet-faucet/contracts deploy:testnet
yarn workspace @b3tr-testnet-faucet/contracts deploy:mainnet
```

Both write the resulting addresses back into `packages/config/{testnet,mainnet}.ts`.
