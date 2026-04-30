"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useSendTransaction, useWallet, type EnhancedClause } from "@vechain/vechain-kit"
import { ethers } from "ethers"
import { useCallback } from "react"

import { FAUCET_ABI } from "./faucet.abi"
import { ERC20_ABI } from "./erc20.abi"
import { faucetReadKeys } from "./useFaucetReads"
import { getConfig } from "@/config"

const config = getConfig()
const faucetAddress = config.contracts.faucet
const b3trAddress = config.contracts.b3tr

const faucetIface = new ethers.Interface(FAUCET_ABI as unknown as ethers.InterfaceAbi)
const erc20Iface = new ethers.Interface(ERC20_ABI as unknown as ethers.InterfaceAbi)

const clause = (to: string, data: string, comment: string): EnhancedClause => ({
  to,
  value: "0x0",
  data,
  comment,
})

const invalidateFaucetReads = (qc: ReturnType<typeof useQueryClient>, user?: string) => {
  qc.invalidateQueries({ queryKey: faucetReadKeys.faucetBalance() })
  qc.invalidateQueries({ queryKey: faucetReadKeys.amountPerClaim() })
  qc.invalidateQueries({ queryKey: faucetReadKeys.maxClaimsPerDay() })
  if (user) {
    qc.invalidateQueries({ queryKey: faucetReadKeys.canClaim(user) })
    qc.invalidateQueries({ queryKey: faucetReadKeys.remainingClaimsForToday(user) })
    qc.invalidateQueries({ queryKey: faucetReadKeys.userB3trBalance(user) })
    qc.invalidateQueries({ queryKey: faucetReadKeys.allowance(user) })
  }
}

export const useClaimTokens = () => {
  const { account } = useWallet()
  const qc = useQueryClient()

  const tx = useSendTransaction({
    signerAccountAddress: account?.address,
    onTxConfirmed: () => invalidateFaucetReads(qc, account?.address),
  })

  const claim = useCallback(async () => {
    const data = faucetIface.encodeFunctionData("claimTokens", [])
    return tx.sendTransaction([clause(faucetAddress, data, "Claim B3TR from faucet")])
  }, [tx])

  return { ...tx, claim }
}

export const useFundFaucet = () => {
  const { account } = useWallet()
  const qc = useQueryClient()

  const tx = useSendTransaction({
    signerAccountAddress: account?.address,
    onTxConfirmed: () => invalidateFaucetReads(qc, account?.address),
  })

  const fund = useCallback(
    async (amountEther: string) => {
      const amount = ethers.parseEther(amountEther)
      const approveData = erc20Iface.encodeFunctionData("approve", [faucetAddress, amount])
      const fundData = faucetIface.encodeFunctionData("fundFaucet", [amount])
      return tx.sendTransaction([
        clause(b3trAddress, approveData, `Approve ${amountEther} B3TR for faucet`),
        clause(faucetAddress, fundData, `Fund faucet with ${amountEther} B3TR`),
      ])
    },
    [tx],
  )

  return { ...tx, fund }
}

export const useSetAmountPerClaim = () => {
  const { account } = useWallet()
  const qc = useQueryClient()

  const tx = useSendTransaction({
    signerAccountAddress: account?.address,
    onTxConfirmed: () => invalidateFaucetReads(qc, account?.address),
  })

  const setAmount = useCallback(
    async (amountEther: string) => {
      const amount = ethers.parseEther(amountEther)
      const data = faucetIface.encodeFunctionData("setAmountPerClaim", [amount])
      return tx.sendTransaction([clause(faucetAddress, data, `Set amount per claim to ${amountEther} B3TR`)])
    },
    [tx],
  )

  return { ...tx, setAmount }
}

export const useSetMaxClaimsPerDay = () => {
  const { account } = useWallet()
  const qc = useQueryClient()

  const tx = useSendTransaction({
    signerAccountAddress: account?.address,
    onTxConfirmed: () => invalidateFaucetReads(qc, account?.address),
  })

  const setMax = useCallback(
    async (max: string) => {
      const value = BigInt(max)
      const data = faucetIface.encodeFunctionData("setMaxClaimsPerDay", [value])
      return tx.sendTransaction([clause(faucetAddress, data, `Set max claims per day to ${max}`)])
    },
    [tx],
  )

  return { ...tx, setMax }
}
