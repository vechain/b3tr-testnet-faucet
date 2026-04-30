"use client"

import { useCallClause, getCallClauseQueryKey, getCallClauseQueryKeyWithArgs } from "@vechain/vechain-kit"
import { FAUCET_ABI } from "./faucet.abi"
import { ERC20_ABI } from "./erc20.abi"
import { getConfig } from "@/config"

const config = getConfig()
const faucetAddress = config.contracts.faucet as `0x${string}`
const b3trAddress = config.contracts.b3tr as `0x${string}`
const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`

export const useAmountPerClaim = () =>
  useCallClause({
    abi: FAUCET_ABI,
    address: faucetAddress,
    method: "amountPerClaim",
    args: [],
    queryOptions: { enabled: !!faucetAddress },
  })

export const useMaxClaimsPerDay = () =>
  useCallClause({
    abi: FAUCET_ABI,
    address: faucetAddress,
    method: "maxClaimsPerDay",
    args: [],
    queryOptions: { enabled: !!faucetAddress },
  })

export const useFaucetOwner = () =>
  useCallClause({
    abi: FAUCET_ABI,
    address: faucetAddress,
    method: "owner",
    args: [],
    queryOptions: { enabled: !!faucetAddress },
  })

export const useCanClaim = (user?: string) =>
  useCallClause({
    abi: FAUCET_ABI,
    address: faucetAddress,
    method: "canClaim",
    args: [(user ?? ZERO) as `0x${string}`],
    queryOptions: { enabled: !!faucetAddress && !!user },
  })

export const useRemainingClaimsForToday = (user?: string) =>
  useCallClause({
    abi: FAUCET_ABI,
    address: faucetAddress,
    method: "remainingClaimsForToday",
    args: [(user ?? ZERO) as `0x${string}`],
    queryOptions: { enabled: !!faucetAddress && !!user },
  })

export const useFaucetBalance = () =>
  useCallClause({
    abi: ERC20_ABI,
    address: b3trAddress,
    method: "balanceOf",
    args: [faucetAddress],
    queryOptions: { enabled: !!b3trAddress && !!faucetAddress },
  })

export const useUserB3trBalance = (user?: string) =>
  useCallClause({
    abi: ERC20_ABI,
    address: b3trAddress,
    method: "balanceOf",
    args: [(user ?? ZERO) as `0x${string}`],
    queryOptions: { enabled: !!b3trAddress && !!user },
  })

export const useB3trAllowance = (owner?: string) =>
  useCallClause({
    abi: ERC20_ABI,
    address: b3trAddress,
    method: "allowance",
    args: [(owner ?? ZERO) as `0x${string}`, faucetAddress],
    queryOptions: { enabled: !!b3trAddress && !!owner && !!faucetAddress },
  })

export const faucetReadKeys = {
  canClaim: (user: string) =>
    getCallClauseQueryKeyWithArgs({
      abi: FAUCET_ABI,
      address: faucetAddress,
      method: "canClaim",
      args: [user as `0x${string}`],
    }),
  remainingClaimsForToday: (user: string) =>
    getCallClauseQueryKeyWithArgs({
      abi: FAUCET_ABI,
      address: faucetAddress,
      method: "remainingClaimsForToday",
      args: [user as `0x${string}`],
    }),
  faucetBalance: () =>
    getCallClauseQueryKeyWithArgs({
      abi: ERC20_ABI,
      address: b3trAddress,
      method: "balanceOf",
      args: [faucetAddress],
    }),
  userB3trBalance: (user: string) =>
    getCallClauseQueryKeyWithArgs({
      abi: ERC20_ABI,
      address: b3trAddress,
      method: "balanceOf",
      args: [user as `0x${string}`],
    }),
  amountPerClaim: () =>
    getCallClauseQueryKey({ abi: FAUCET_ABI, address: faucetAddress, method: "amountPerClaim" }),
  maxClaimsPerDay: () =>
    getCallClauseQueryKey({ abi: FAUCET_ABI, address: faucetAddress, method: "maxClaimsPerDay" }),
  allowance: (owner: string) =>
    getCallClauseQueryKeyWithArgs({
      abi: ERC20_ABI,
      address: b3trAddress,
      method: "allowance",
      args: [owner as `0x${string}`, faucetAddress],
    }),
}
