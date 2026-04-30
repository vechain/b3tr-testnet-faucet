# Deployment

This repo deploys via GitHub Actions. There are three workflows:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | PRs and push to `main` | Lint, typecheck, contract tests, frontend build |
| `deploy.yml` | Push to `main` (frontend/contracts/config paths) | Build static export and publish to GitHub Pages |
| `contracts-deploy.yml` | Manual dispatch | Deploy `B3TRFaucet` to testnet/mainnet, open a PR with the new addresses |

## One-time setup

### 1. Enable GitHub Pages

Repo → **Settings → Pages → Source: GitHub Actions**.

The deploy workflow serves the dApp at `https://vechain.github.io/b3tr-testnet-faucet/`. The `basePath` is set automatically from the repo name.

### 2. Create environments

Repo → **Settings → Environments**.

| Environment | Purpose | Recommended protections |
|---|---|---|
| `github-pages` | Frontend deploy target | Auto-created by GitHub |
| `testnet` | `contracts-deploy.yml` testnet runs | None (or 1 reviewer) |
| `mainnet` | `contracts-deploy.yml` mainnet runs | **Required reviewers**, restrict to `main` branch |

### 3. Add secrets

Per environment (Settings → Environments → `<env>` → Secrets):

| Secret | Used by | Notes |
|---|---|---|
| `DEPLOYER_MNEMONIC` | `contracts-deploy.yml` | Mnemonic for the deployer account on that network. **Never commit.** |

The default `GITHUB_TOKEN` is used for opening PRs — no extra secret needed.

### 4. Branch protection on `main`

Settings → **Branches → Add rule** for `main`:

- Require pull request before merging
- Require status checks: `CI / Lint & typecheck`, `CI / Contract tests`, `CI / Build static export`
- Require branches to be up to date before merging
- Restrict who can push directly (no one)

## Deploying contracts

1. Go to **Actions → Deploy contracts (manual) → Run workflow**.
2. Choose `testnet` or `mainnet`.
3. The workflow:
   - Compiles contracts
   - Deploys `B3TRFaucet` (and reads B3TR address from the existing config)
   - Opens a PR updating `packages/config/<network>.ts` with the new faucet address
4. Merge the PR. The next push to `main` triggers `deploy.yml` and the new address is live in the frontend.

## Frontend deploy

Automatic on every push to `main` that touches frontend / contracts / config. The Pages URL is shown in the workflow output.

## Security notes

- Third-party actions are pinned to full SHA where possible. Dependabot keeps them current.
- `GITHUB_TOKEN` permissions are scoped per workflow (`permissions:` blocks).
- `pull_request` triggers do not run on untrusted code with secrets — only `pull_request_target` would, and we don't use it.
- All values from `github.*` context are passed to `run:` steps via `env:` to prevent shell injection.
