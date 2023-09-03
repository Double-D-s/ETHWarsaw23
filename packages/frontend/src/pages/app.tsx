import { SupportedChainId } from '@azns/resolver-core'
import { useResolveAddressToDomain } from '@azns/resolver-react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
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
import { HomeTopBar } from '@components/home/HomeTopBar'
import { CenterBody } from '@components/layout/CenterBody'
import { ContractIds } from '@deployments/deployments'
import { encodeAddress } from '@polkadot/util-crypto'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { contractTxWithToast } from '@utils/contractTxWithToast'
import { truncateHash } from '@utils/truncateHash'
import NextLink from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function App() {
  const { api, activeAccount, isConnected, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Post)
  const { activeChain } = useInkathon()
  const doResolveAddress = useMemo(
    () => Object.values(SupportedChainId).includes(activeChain?.network as SupportedChainId),
    [activeChain?.network],
  )
  const form = useForm<{ newMessage: string }>()
  const { control, handleSubmit, setValue, getValues } = useForm()
  const { primaryDomain } = useResolveAddressToDomain(
    doResolveAddress ? activeAccount?.address : undefined,
    {
      chainId: activeChain?.network,
      debug: true,
    },
  )
  const [userBioResult, setUserBioResult] = useState<string>()
  const [userPosts, setUserPosts] = useState([])
  const fetchGreeting = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) return

    try {
      const userBioResult = await contractQuery(api, '', contract, 'getUserBio', {}, [
        activeAccount.address,
      ])

      const { output, isError, decodedOutput } = decodeOutput(userBioResult, contract, 'getUserBio')
      setUserBioResult(output)
      const userPostsResult = await contractQuery(api, '', contract, 'getUserPosts', {}, [
        activeAccount.address,
      ])

      const {
        output: customOutput,
        isError: customIsError,
        decodedOutput: customDecodedOutput,
      } = decodeOutput(userPostsResult, contract, 'getUserPosts')
      setUserPosts(JSON.parse(customDecodedOutput))
      console.log(userPosts, customIsError, userPosts.length)
      if (isError) throw new Error(decodedOutput)
      setValue('fieldName', output)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    fetchGreeting()
  }, [contract, activeAccount])

  if (!isConnected)
    return (
      <>
        <HomeTopBar />
        <CenterBody>Connect first.</CenterBody>
      </>
    )
  return (
    <>
      <HomeTopBar />
      <Container maxW="container.sm" mt={'100px'}>
        <HStack spacing={4}>
          <VStack align={'flex-start'}>
            <Heading as="h1" size="xl">
              Hi, {primaryDomain}
            </Heading>
            <Text fontSize="xs">
              {truncateHash(
                encodeAddress(activeAccount!.address, activeChain?.ss58Prefix || 42),
                8,
              )}
            </Text>
            <Text fontSize="xs">{userBioResult}</Text>
          </VStack>
          <Spacer />
          <HStack>
            <BioModal />
            <CreatePostModal />
          </HStack>
        </HStack>
        <VStack align={'flex-start'} mt={'20px'}>
          <Heading as="h2" size="md">
            Your Posts
          </Heading>
          <SimpleGrid columns={2} spacing={10} w={'full'}>
            {userPosts ? (
              userPosts?.map((post, i) => (
                <Link key={i} as={NextLink} href={`http://${primaryDomain}.localhost:3000/${i}`}>
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
              ))
            ) : (
              <Text>No posts yet</Text>
            )}
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  )
}

export function BioModal() {
  const { api, activeAccount, isConnected, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Post)
  const form = useForm<{ newMessage: string }>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const { control, handleSubmit, setValue, getValues } = useForm()

  const updateGreeting = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    const newMessage = getValues('fieldName')

    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'setUserBio', {}, [
        newMessage,
      ])
      form.reset()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme="pink">
        Update Bio
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Upadte Bio</ModalHeader>

          <ModalBody>
            <Controller
              name="fieldName"
              control={control}
              defaultValue="" // Set an initial value here (can be empty)
              render={({ field }) => (
                <>
                  <FormControl>
                    <FormLabel>User Bio</FormLabel>
                    <Input disabled={updateIsLoading} {...field} />
                  </FormControl>
                </>
              )}
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={updateGreeting}
              disabled={updateIsLoading}
              isLoading={updateIsLoading}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export function CreatePostModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        CreatePost
      </Button>
      <Modal isOpen={isOpen} size={'6xl'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>New post</ModalHeader>

          <ModalBody>create post textbox</ModalBody>

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
