"use client"

import { Box, Button, HStack, Heading, Stat, Text, VStack } from "@chakra-ui/react"
import { useWallet } from "@vechain/vechain-kit"
import { ethers } from "ethers"

import {
  useAmountPerClaim,
  useCanClaim,
  useFaucetBalance,
  useMaxClaimsPerDay,
  useRemainingClaimsForToday,
  useUserB3trBalance,
} from "@/api/contracts/useFaucetReads"
import { useClaimTokens } from "@/api/contracts/useFaucetMutations"

const fmt = (v?: bigint) => (v == null ? "—" : Number(ethers.formatEther(v)).toLocaleString())

export function ClaimCard() {
  const { account } = useWallet()
  const user = account?.address

  const amountPerClaim = useAmountPerClaim().data?.[0]
  const maxPerDay = useMaxClaimsPerDay().data?.[0]
  const faucetBalance = useFaucetBalance().data?.[0]
  const canClaim = useCanClaim(user).data?.[0]
  const remaining = useRemainingClaimsForToday(user).data?.[0]
  const userBalance = useUserB3trBalance(user).data?.[0]

  const { claim, status } = useClaimTokens()

  const isEmpty = faucetBalance != null && amountPerClaim != null && faucetBalance < amountPerClaim
  const disabled = !user || canClaim === false || isEmpty || status === "pending" || status === "waitingConfirmation"

  return (
    <Box bg="bg.secondary" borderWidth="1px" borderColor="border.primary" borderRadius="lg" p={{ base: 5, md: 8 }}>
      <VStack align="stretch" gap={6}>
        <VStack align="stretch" gap={1}>
          <Heading size="lg">Claim B3TR</Heading>
          <Text color="text.subtle">
            {amountPerClaim != null
              ? `Get ${fmt(amountPerClaim)} B3TR per claim, up to ${maxPerDay?.toString() ?? "—"} times per day.`
              : "Loading faucet…"}
          </Text>
        </VStack>

        <HStack gap={6} wrap="wrap">
          <Stat.Root>
            <Stat.Label>Faucet balance</Stat.Label>
            <Stat.ValueText>{fmt(faucetBalance)}</Stat.ValueText>
            <Stat.HelpText>B3TR</Stat.HelpText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Your balance</Stat.Label>
            <Stat.ValueText>{fmt(userBalance)}</Stat.ValueText>
            <Stat.HelpText>B3TR</Stat.HelpText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Remaining today</Stat.Label>
            <Stat.ValueText>{remaining?.toString() ?? "—"}</Stat.ValueText>
            <Stat.HelpText>claims</Stat.HelpText>
          </Stat.Root>
        </HStack>

        <Button
          size="lg"
          colorPalette="green"
          disabled={disabled}
          loading={status === "pending" || status === "waitingConfirmation"}
          onClick={() => claim()}>
          {!user
            ? "Connect wallet to claim"
            : isEmpty
              ? "Faucet empty"
              : canClaim === false
                ? "Daily limit reached"
                : "Claim B3TR"}
        </Button>
      </VStack>
    </Box>
  )
}
