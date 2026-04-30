# Deployment

This repo deploys via GitHub Actions. There are two workflows:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | PRs and push to `main` | Lint, typecheck, contract tests, frontend build |
| `deploy.yml` | Push to `main` (frontend/contracts/config paths) | Build static export and publish to GitHub Pages |

Contract deploys are run **locally** from a maintainer's machine — see [Deploying contracts](#deploying-contracts) below.

## One-time GitHub setup

### 1. Enable GitHub Pages

Repo → **Settings → Pages → Source: GitHub Actions**.

The deploy workflow serves the dApp at `https://vechain.github.io/b3tr-testnet-faucet/`. The `basePath` is set automatically from the repo name.

### 2. Branch protection on `main`

Settings → **Branches → Add rule** for `main`:

- Require pull request before merging
- Require status checks: `CI / Lint & typecheck`, `CI / Contract tests`, `CI / Build static export`
- Require branches to be up to date before merging
- Restrict who can push directly (no one)

## Deploying contracts (local)

Run from your machine, with `MNEMONIC` set in `.env` to the deployer wallet.

```bash
# testnet
yarn workspace @b3tr-testnet-faucet/contracts deploy:testnet

# mainnet
yarn workspace @b3tr-testnet-faucet/contracts deploy:mainnet
```

The deploy script writes the new faucet address back into `packages/config/<network>.ts`. Commit that change, open a PR, and once it merges to `main` the next push triggers `deploy.yml` and the new address is live in the frontend.

## Frontend deploy

Automatic on every push to `main` that touches frontend / contracts / config. The Pages URL is shown in the workflow output.

## Security notes

- Third-party actions are pinned to full SHA where possible. Dependabot keeps them current.
- `GITHUB_TOKEN` permissions are scoped per workflow (`permissions:` blocks).
- `pull_request` triggers do not run on untrusted code with secrets — only `pull_request_target` would, and we don't use it.
- All values from `github.*` context are passed to `run:` steps via `env:` to prevent shell injection.
