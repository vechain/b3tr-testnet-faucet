# Contributing to B3TR Testnet Faucet

Thanks for your interest in contributing.

This is a small dApp — a faucet that distributes B3TR on VeChain testnet. Contributions are welcome for bug fixes, UX improvements, contract hardening, and documentation.

## Getting started

1. Fork the repo and clone it locally
2. Follow the setup instructions in [README.md](README.md)
3. Create a feature branch from `main`

## Branch naming

Use descriptive names:

- `feat/<short-description>` — new feature
- `fix/<short-description>` — bug fix
- `chore/<short-description>` — tooling, refactor, docs

## Pull requests

- Keep PRs focused — one feature or fix per PR.
- Include a short description of the change and how to verify it.
- Link related issues.
- Make sure all checks pass locally before opening the PR.

## Before submitting

Run from the monorepo root:

```bash
yarn typecheck       # TypeScript type checking
yarn lint            # Linting
yarn contracts:test  # Smart contract tests (Hardhat)
yarn build           # Verify the static export builds
```

## Code style

- TypeScript for all code, ES modules (`import`/`export`)
- Prettier for formatting
- ESLint for linting
- **Mobile-first** — most users will hit this from a mobile wallet's in-app browser. Build for small viewports first, then add `md`/`lg` breakpoints.
- Chakra UI v3 design system: use semantic colors and `textStyle`/`size` tokens, no raw hex colors or arbitrary `fontSize`/`lineHeight`.

## Smart contracts

- Solidity 0.8.20, OpenZeppelin 5.0.2 (upgradeable)
- The `B3TRFaucet` contract is **UUPS upgradeable**. Storage layout must remain compatible across upgrades — never reorder, remove, or change the type of existing storage variables. Add new variables only at the end.
- Use NatSpec on all public/external functions.
- Add tests for any behavior change. Contract tests run on the Hardhat network, not Thor solo:

  ```bash
  yarn contracts:test
  ```

- For new versions (V2, V3, …) follow the upgrade flow: add a new contract `B3TRFaucetV2.sol` extending the previous version, register it in `scripts/upgrade/upgradesConfig.ts`, and add a corresponding upgrade script.

## Faucet-specific guidelines

- **Don't lower the security of claim limits** without a clear reason. The daily limit is the only sybil-resistance mechanism.
- **Don't introduce off-chain dependencies** for claim eligibility (e.g. proof-of-humanity APIs). Faucet logic should stay fully on-chain.
- **Mainnet is unusual.** This is intended as a testnet utility. If you propose a mainnet deployment, justify it in the PR description.

## Reporting bugs

Open a GitHub issue with:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Network (local solo / testnet) and your wallet address (only if relevant)
- Browser / wallet client

Security issues should NOT be opened as public issues — see [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
