"use client"

import { Box, Button, Heading, SimpleGrid, Stat, Text, VStack } from "@chakra-ui/react"
import { useConnectModal, useWallet } from "@vechain/vechain-kit"
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
  const { open: openConnectModal } = useConnectModal()

  const amountPerClaim = useAmountPerClaim().data?.[0]
  const maxPerDay = useMaxClaimsPerDay().data?.[0]
  const faucetBalance = useFaucetBalance().data?.[0]
  const canClaim = useCanClaim(user).data?.[0]
  const remaining = useRemainingClaimsForToday(user).data?.[0]
  const userBalance = useUserB3trBalance(user).data?.[0]

  const { claim, status } = useClaimTokens()

  const isPending = status === "pending" || status === "waitingConfirmation"
  const isEmpty = faucetBalance != null && amountPerClaim != null && faucetBalance < amountPerClaim
  const limitReached = !!user && canClaim === false
  // When disconnected, the button is enabled and opens the connect modal.
  const disabled = !!user && (limitReached || isEmpty || isPending)

  const onClick = () => {
    if (!user) {
      openConnectModal()
      return
    }
    claim()
  }

  return (
    <Box
      bg="bg.secondary"
      borderWidth="1px"
      borderColor="border.primary"
      borderRadius="lg"
      p={{ base: 4, md: 8 }}>
      <VStack align="stretch" gap={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={1}>
          <Heading size={{ base: "md", md: "lg" }}>Claim B3TR</Heading>
          <Text textStyle={{ base: "sm", md: "md" }} color="text.subtle">
            {amountPerClaim != null
              ? `Get ${fmt(amountPerClaim)} B3TR per claim, up to ${maxPerDay?.toString() ?? "—"} times per day.`
              : "Loading faucet…"}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={{ base: 3, md: 4 }}>
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
        </SimpleGrid>

        <Button
          size={{ base: "md", md: "lg" }}
          width="full"
          colorPalette="green"
          disabled={disabled}
          loading={isPending}
          onClick={onClick}>
          {!user
            ? "Connect wallet to claim"
            : isEmpty
              ? "Faucet empty"
              : limitReached
                ? "Daily limit reached"
                : "Claim B3TR"}
        </Button>
      </VStack>
    </Box>
  )
}
