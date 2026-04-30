"use client"

import { Container, Flex, VStack } from "@chakra-ui/react"
import { Navbar } from "@/components/Navbar"
import { Providers } from "./providers"

export function ClientApp({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <VStack minH="100vh" gap={0} align="stretch">
        <Navbar />
        <Flex flex={1}>
          <Container flex={1} my={{ base: 4, md: 10 }} px={4} maxW="breakpoint-xl">
            {children}
          </Container>
        </Flex>
      </VStack>
    </Providers>
  )
}
