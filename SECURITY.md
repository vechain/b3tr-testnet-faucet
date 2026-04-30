# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue.**

Email **security@vechain.org** with:

- A description of the vulnerability
- Steps to reproduce
- Affected component(s) (faucet contract, frontend, deploy scripts)
- Severity assessment (if possible)

We will acknowledge your report within 48 hours and aim to provide a fix or mitigation plan within 7 business days.

## Scope

In scope:

- The `B3TRFaucet` contract in `packages/contracts/contracts/`
- The frontend application in `apps/frontend/`
- Deploy and upgrade scripts in `packages/contracts/scripts/`

Out of scope:

- The B3TR token itself — report to the [VeBetterDAO repo](https://github.com/vechain/b3tr)
- The VeChain Thor node — report to [VeChain](https://www.vechain.org)
- Third-party dependencies — report to the upstream project
- Issues that only affect the local solo `MockB3TR` (test-only contract)

## Notes on the faucet's threat model

This faucet is for **testnet only** and distributes test B3TR. The realistic threats are:

- Bypassing the daily-claim limit (sybil / contract-level)
- Draining the faucet through unintended paths
- Bricking the contract (e.g. via a broken upgrade)

Reports about wallets claiming "too much" via legitimate use of multiple addresses are not in scope — the daily limit is per-address by design.

## Supported versions

Security fixes are applied to the latest version on `main`. We do not backport fixes to older releases.

## Recognition

We appreciate responsible disclosure and will credit reporters (with permission) in the release notes.
