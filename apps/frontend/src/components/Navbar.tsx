"use client"

import { Box, Flex, Heading, HStack } from "@chakra-ui/react"
import { WalletButton } from "@vechain/vechain-kit"
import { ColorModeButton } from "@/components/ui/color-mode"

export function Navbar() {
  return (
    <Box as="nav" bg="bg.secondary" px={4} py={3} borderBottomWidth="1px">
      <Flex maxW="breakpoint-xl" mx="auto" align="center" justify="space-between">
        <Heading size="md" fontWeight="bold">
          B3TR Testnet Faucet
        </Heading>
        <HStack gap={2}>
          <ColorModeButton />
          <WalletButton />
        </HStack>
      </Flex>
    </Box>
  )
}
