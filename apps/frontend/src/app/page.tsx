"use client"

import { Heading, Text, VStack } from "@chakra-ui/react"

import { AdminPanel } from "@/components/Faucet/AdminPanel"
import { ClaimCard } from "@/components/Faucet/ClaimCard"

export default function HomePage() {
  return (
    <VStack gap={8} align="stretch" maxW="2xl" mx="auto" w="full">
      <VStack gap={2} textAlign="center" pt={{ base: 4, md: 8 }}>
        <Heading size="2xl">B3TR Testnet Faucet</Heading>
        <Text textStyle="lg" color="text.subtle">
          Connect your wallet and claim B3TR on VeChain testnet.
        </Text>
      </VStack>

      <ClaimCard />
      <AdminPanel />
    </VStack>
  )
}
