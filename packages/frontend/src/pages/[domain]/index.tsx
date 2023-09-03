'use client'
import { SupportedChainId, resolveDomainToAddress } from '@azns/resolver-core'
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'

import { ContractIds } from '@deployments/deployments'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// const [data, posts] = await Promise.all([
//   getProfileData(params.domain),
//   getPostsForSite(params.domain),
// ]);

// if (!data) {
//   notFound();
// }

interface AzeroIdDisplayProps {
  addy: string
}

export const AzeroIdDisplay: FC<AzeroIdDisplayProps> = ({ addy }) => {
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const { api, activeAccount, isConnected, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.AzeroId)
  const [azeroData, setAzeroData] = useState<string>()

  // Fetch metadata
  const fetchMetadata = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'get_all_records', {}, [
        '5GBtboofzYttmovaH1rVgNGuDAXcorZ6QVSrGKDKFh2yggRY',
      ])
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'get_all_records')
      console.log(output, 'for')

      if (isError) throw new Error(decodedOutput)
      setAzeroData(output)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching id data. Try again…')
      setAzeroData(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchMetadata()
  }, [contract])

  return (
    <div>
      <h1>alephzeroid</h1>
      <p>addy</p>
      <div>all the metadata</div>
    </div>
  )
}

export default function Index(props: { domain: string }) {
  const [pageIsLoading, setPageIsLoading] = useState<boolean>()
  const [address, setAddress] = useState<string>()
  const { api, activeAccount, isConnected, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Post)
  const { activeChain } = useInkathon()
  const { domain } = props

  async function resolveDomain() {
    try {
      setPageIsLoading(true)

      const { address, error } = await resolveDomainToAddress(`${domain}.tzero`, {
        chainId: SupportedChainId.AlephZeroTestnet,
      })

      if (error) throw new Error(error.message)

      setAddress(address!)
    } catch (e) {
      console.error(e)
      // TODO not found page
      setAddress(undefined)
    } finally {
      setPageIsLoading(false)
    }
  }
  useEffect(() => {
    resolveDomain()
  }, [])

  return (
    <>
      {/* <AzeroIdDisplay addy={address as string} /> */}
      <Container maxW="container.sm" mt={'100px'}>
        <HStack spacing={4}>
          <VStack align={'flex-start'}>
            <Heading as="h1" size="3xl">
              Blog from: {domain}!
            </Heading>
            <Text fontSize="xs">{activeAccount}</Text>
          </VStack>
          <Spacer />
          <HStack>{DonationModal()}</HStack>
        </HStack>
        <VStack align={'flex-start'} mt={'20px'}>
          <Heading as="h2" size="xl">
            Recent Posts
          </Heading>
          <SimpleGrid columns={2} spacing={10} w={'full'}>
            <Link as={NextLink} href="/01">
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

function DonationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} colorScheme="pink">
        Donate
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Donate to azureid</ModalHeader>

          <ModalBody>donation form here</ModalBody>

          <ModalFooter>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

// TODO 500.js if the getServerSideProps fails
export async function getServerSideProps({ req, res, resolvedUrl }) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=59')
  const subdomain = resolvedUrl.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? resolvedUrl.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null

  return { props: { domain: subdomain.slice(1) } }
}
