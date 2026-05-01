"use client"

import { Box, Flex, Heading, HStack } from "@chakra-ui/react"
import { WalletButton } from "@vechain/vechain-kit"
import { ColorModeButton } from "@/components/ui/color-mode"
import { B3TRIcon } from "@/components/Icons/B3TRIcon"

export function Navbar() {
  return (
    <Box as="nav" bg="bg.secondary" px={{ base: 3, md: 4 }} py={3} borderBottomWidth="1px">
      <Flex maxW="breakpoint-xl" mx="auto" align="center" justify="space-between" gap={2}>
        <HStack gap={2} minW={0}>
          <B3TRIcon boxSize={{ base: 6, md: 7 }} borderRadius="md" flexShrink={0} />
          <Heading
            size={{ base: "sm", md: "md" }}
            fontWeight="bold"
            truncate>
            <Box as="span" hideBelow="sm">
              B3TR Testnet Faucet
            </Box>
            <Box as="span" hideFrom="sm">
              B3TR Faucet
            </Box>
          </Heading>
        </HStack>
        <HStack gap={1} flexShrink={0}>
          <ColorModeButton />
          <WalletButton />
        </HStack>
      </Flex>
    </Box>
  )
}
