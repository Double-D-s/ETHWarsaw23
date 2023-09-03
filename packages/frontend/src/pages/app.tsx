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

import { HomeTopBar } from '@components/home/HomeTopBar'

export default function App() {
  return (
    <>
      <HomeTopBar />
      <Container maxW="container.sm" mt={'100px'}>
        <HStack spacing={4}>
          <VStack align={'flex-start'}>
            <Heading as="h1" size="3xl">
              Hi, azeroId!
            </Heading>
            <Text fontSize="xs">Wa1llet Addy</Text>
          </VStack>
          <Spacer />
          <HStack>
            {BioModal()}
            {/* <Link as={NextLink} href="/newpost">
              <Button as="a" colorScheme="blue">
                Create Post
              </Button>
            </Link> */}
            {CreatePostModal()}
          </HStack>
        </HStack>
        <VStack align={'flex-start'} mt={'20px'}>
          <Heading as="h2" size="xl">
            Your Posts
          </Heading>
          <SimpleGrid columns={2} spacing={10} w={'full'}>
            <Link as={NextLink} href="http://alephblog.localhost:3000">
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

export function BioModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSubmit = (event: { preventDefault: () => void }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    event.preventDefault()
    // asd
  }
  return (
    <>
      <Button onClick={onOpen} colorScheme="pink">
        Update Bio
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Upadte Bio</ModalHeader>

            <ModalBody>Bio form here</ModalBody>

            <ModalFooter>
              <Button onClick={onClose} variant="ghost">
                Close
              </Button>
              <Button colorScheme="blue" mr={3} type="submit">
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

function CreatePostModal() {
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
