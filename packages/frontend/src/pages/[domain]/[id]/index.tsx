'use client'
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Link,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { HomeTopBar } from '@components/home/HomeTopBar'
import NextLink from 'next/link'
export default function Index() {
  return (
    <>
      <HomeTopBar />
      <Container maxW="container.sm" mt={'100px'}>
        <HStack spacing={4}>
          <VStack align={'flex-start'}>
            <Heading as="h1" size="3xl">
              title
            </Heading>
            <Text fontSize="xs">posted</Text>
          </VStack>
          <Spacer />
          <HStack>
            <Link as={NextLink} href="http://alephblog.localhost:3000">
              <Button colorScheme="blue">Donate on the User Page</Button>
            </Link>
          </HStack>
        </HStack>
        <VStack align={'flex-start'} mt={'20px'}>
          <Heading as="h2" size="xl">
            Recent Posts
          </Heading>
          <SimpleGrid columns={2} spacing={10} w={'full'}>
            <Link as={NextLink} href="http://alephblog.localhost:3000/01">
              <Box p={'13px'} bg="whiteAlpha.300" height="150px" position="relative">
                <Text fontSize={'md'} fontWeight={'bold'}>
                  Post Title
                </Text>
                <Text
                  fontWeight={'light'}
                  position="absolute"
                  bottom="0"
                  right="0"
                  marginRight="13px"
                  marginBottom="13px"
                >
                  Posted
                </Text>
              </Box>
            </Link>
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  )
}
