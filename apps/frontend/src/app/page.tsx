"use client"

import { Heading, Text, VStack } from "@chakra-ui/react"

import { AdminPanel } from "@/components/Faucet/AdminPanel"
import { ClaimCard } from "@/components/Faucet/ClaimCard"

export default function HomePage() {
  return (
    <VStack gap={{ base: 5, md: 8 }} align="stretch" maxW="2xl" mx="auto" w="full">
      <VStack gap={2} textAlign="center" pt={{ base: 2, md: 8 }} px={2}>
        <Heading size={{ base: "lg", md: "2xl" }}>B3TR Testnet Faucet</Heading>
        <Text textStyle={{ base: "sm", md: "lg" }} color="text.subtle">
          Connect your wallet and claim B3TR on VeChain testnet.
        </Text>
      </VStack>

      <ClaimCard />
      <AdminPanel />
    </VStack>
  )
}
