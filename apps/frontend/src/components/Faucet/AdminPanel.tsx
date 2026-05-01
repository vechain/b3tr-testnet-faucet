"use client"

import { Box, Button, Flex, Heading, Input, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { useWallet } from "@vechain/vechain-kit"
import { ethers } from "ethers"
import { useState } from "react"

import {
  useAmountPerClaim,
  useFaucetOwner,
  useMaxClaimsPerDay,
  useUserB3trBalance,
} from "@/api/contracts/useFaucetReads"
import {
  useFundFaucet,
  useSetAmountPerClaim,
  useSetMaxClaimsPerDay,
} from "@/api/contracts/useFaucetMutations"

export function AdminPanel() {
  const { account } = useWallet()
  const owner = useFaucetOwner().data?.[0]
  const amountPerClaim = useAmountPerClaim().data?.[0]
  const maxPerDay = useMaxClaimsPerDay().data?.[0]
  const userBalance = useUserB3trBalance(account?.address).data?.[0]

  const isOwner = !!owner && !!account?.address && owner.toLowerCase() === account.address.toLowerCase()
  if (!isOwner) return null

  return (
    <Box
      bg="bg.secondary"
      borderWidth="1px"
      borderColor="border.primary"
      borderRadius="lg"
      p={{ base: 4, md: 8 }}>
      <VStack align="stretch" gap={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={1}>
          <Heading size={{ base: "sm", md: "md" }}>Admin</Heading>
          <Text textStyle={{ base: "sm", md: "md" }} color="text.subtle">
            You are the faucet owner. Fund and configure below.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
          <FundForm walletBalance={userBalance} />
          <SetAmountForm current={amountPerClaim} />
          <SetMaxForm current={maxPerDay} />
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

function FundForm({ walletBalance }: { walletBalance?: bigint }) {
  const [value, setValue] = useState("")
  const { fund, status } = useFundFaucet()
  const pending = status === "pending" || status === "waitingConfirmation"
  const balanceText = walletBalance == null ? "—" : Number(ethers.formatEther(walletBalance)).toLocaleString()

  return (
    <VStack align="stretch" gap={2}>
      <Text fontWeight="semibold">Fund faucet</Text>
      <Text textStyle="sm" color="text.subtle">
        Wallet B3TR: {balanceText}
      </Text>
      <Flex direction={{ base: "column", sm: "row" }} gap={2}>
        <Input
          placeholder="Amount in B3TR"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          min={0}
          inputMode="decimal"
        />
        <Button
          colorPalette="blue"
          loading={pending}
          disabled={!value || Number(value) <= 0}
          onClick={() => fund(value).then(() => setValue(""))}>
          Fund
        </Button>
      </Flex>
    </VStack>
  )
}

function SetAmountForm({ current }: { current?: bigint }) {
  const [value, setValue] = useState("")
  const { setAmount, status } = useSetAmountPerClaim()
  const pending = status === "pending" || status === "waitingConfirmation"
  const currentText = current == null ? "—" : ethers.formatEther(current)

  return (
    <VStack align="stretch" gap={2}>
      <Text fontWeight="semibold">Amount per claim</Text>
      <Text textStyle="sm" color="text.subtle">
        Current: {currentText} B3TR
      </Text>
      <Flex direction={{ base: "column", sm: "row" }} gap={2}>
        <Input
          placeholder="New amount in B3TR"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          min={0}
          inputMode="decimal"
        />
        <Button
          loading={pending}
          disabled={!value || Number(value) <= 0}
          onClick={() => setAmount(value).then(() => setValue(""))}>
          Update
        </Button>
      </Flex>
    </VStack>
  )
}

function SetMaxForm({ current }: { current?: bigint }) {
  const [value, setValue] = useState("")
  const { setMax, status } = useSetMaxClaimsPerDay()
  const pending = status === "pending" || status === "waitingConfirmation"

  return (
    <VStack align="stretch" gap={2}>
      <Text fontWeight="semibold">Max claims per day</Text>
      <Text textStyle="sm" color="text.subtle">
        Current: {current?.toString() ?? "—"}
      </Text>
      <Flex direction={{ base: "column", sm: "row" }} gap={2}>
        <Input
          placeholder="New max"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          min={0}
          inputMode="numeric"
        />
        <Button
          loading={pending}
          disabled={!value || Number(value) <= 0}
          onClick={() => setMax(value).then(() => setValue(""))}>
          Update
        </Button>
      </Flex>
    </VStack>
  )
}
