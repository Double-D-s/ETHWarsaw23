import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { ContractIds } from '@deployments/deployments'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { contractTxWithToast } from '@utils/contractTxWithToast'
import { Editor } from 'novel'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

export async function areweaveContent(postContent: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: postContent,
      }),
    })
    const data = await response.json()
    // Do something with the data
    return data['url'].split('/').pop()
  } catch (error) {
    console.error(error)
    return null
  }
}

export const PostContract: FC = () => {
  const { api, activeAccount, isConnected, activeSigner } = useInkathon()
  console.log(useInkathon())
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Post)
  const [greeterMessage, setGreeterMessage] = useState<string>()
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const form = useForm<{ newMessage: string }>()
  const { control, handleSubmit, setValue, getValues } = useForm()

  // Fetch Greeting
  const fetchGreeting = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) return

    setFetchIsLoading(true)
    try {
      console.log(activeSigner)
      // activeSigner.signRaw('test')

      // const mnemonic = mnemonicGenerate()
      // const alice = await new Keyring({ type: 'sr25519', ss58Format: 2 })
      // const alice = PolkadotKeyring.keyring.addFromUri('//Alice')
      // console.log(alice)

      // create & add the pair to the keyring with the type and some additional
      // metadata specified
      // const pair = PolkadotKeyring.keyring.addFromUri(mnemonic, { name: 'first pair' }, 'ed25519')

      // the pair has been added to our keyring
      // console.log(PolkadotKeyring.keyring.pairs.length, 'pairs available')

      // create Alice based on the development seed
      // const alice = activeSigner //keyring.addFromUri('//Alice')

      // create the message, actual signature and verify
      // const message = stringToU8a('this is our message')
      // const signature = alice.sign(message)
      // const isValid = alice.verify(message, signature, alice.publicKey)

      // output the result
      // console.log(`${u8aToHex(signature)} is ${isValid ? 'valid' : 'invalid'}`)

      // return
      const userBioResult = await contractQuery(api, '', contract, 'getUserBio', {}, [
        // "5GYt4zkpjYreEGEnn6WqRSVyhANhV8EabBEnKKtcbxW46ezN",
        // "5FnBcmam9fAqxW7yG3NSW9gK1bMPwgqbEZBeeJCR9hryNjWM"
        activeAccount.address,
      ])

      const { output, isError, decodedOutput } = decodeOutput(userBioResult, contract, 'getUserBio')

      const userPostsResult = await contractQuery(api, '', contract, 'getUserPosts', {}, [
        activeAccount.address,
      ])

      const {
        output: customOutput,
        isError: customIsError,
        decodedOutput: customDecodedOutput,
      } = decodeOutput(userPostsResult, contract, 'getUserPosts')

      console.log(output, isError, decodedOutput, customOutput, customIsError, customDecodedOutput)
      if (isError) throw new Error(decodedOutput)
      setGreeterMessage(output)
      setValue('fieldName', output)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching greeting. Try again…')
      setGreeterMessage(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchGreeting()
  }, [contract, activeAccount])

  // Update user bio
  const updateGreeting = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    console.log(activeSigner)

    const newMessage = getValues('fieldName')

    // Gather form value
    // const newMessage = form.getValues('fieldName')

    console.log(newMessage)

    // Send transaction
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
      fetchGreeting()
    }
  }

  const addPost = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    console.log('adding new post')

    const postTitle = getValues('postTitle')
    const postContent = await areweaveContent(getValues('postContent')) //should be set to arweave link storing content
    const isGated = false //getValues('isGated')
    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'createPost', {}, [
        postTitle,
        postContent,
        isGated,
      ])
      form.reset()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      fetchGreeting()
    }
  }

  if (!contract) return null

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">User Profile</h2>
        <p tw="text-center font-bold font-mono text-gray-200">AZERO.ID Username</p>
        <p tw="text-center font-mono text-gray-400">
          {fetchIsLoading ? 'Loading…' : greeterMessage}{' '}
        </p>

        {/* Fetched Greeting */}
        {/* <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Fetched Greeting</FormLabel>
            <Input placeholder={fetchIsLoading ? 'Loading…' : greeterMessage} disabled={true} />
          </FormControl>
        </Card> */}

        {/* Update Greeting */}
        {!!isConnected && (
          <>
            <Card variant="outline" p={4} bgColor="whiteAlpha.100">
              <form>
                <Stack direction="row" spacing={2} align="end">
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

                  <Button
                    mt={4}
                    colorScheme="green"
                    isLoading={updateIsLoading}
                    disabled={updateIsLoading}
                    type="button"
                    onClick={updateGreeting}
                  >
                    Edit
                  </Button>
                </Stack>
              </form>
            </Card>

            <Card variant="outline" p={4} bgColor="whiteAlpha.100">
              <form>
                <Stack direction="row" spacing={2} align="end">
                  <Controller
                    name="postTitle"
                    control={control}
                    defaultValue=" " // Set an initial value here (can be empty)
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <FormLabel> Post Title</FormLabel>
                          <Input disabled={updateIsLoading} {...field} />
                        </FormControl>
                      </>
                    )}
                  />

                  <Controller
                    name="postContent"
                    control={control}
                    defaultValue=" " // Set an initial value here (can be empty)
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <FormLabel>Post Content</FormLabel>
                          <Input disabled={updateIsLoading} {...field} />
                          <Editor />;
                        </FormControl>
                      </>
                    )}
                  />

                  <Button
                    mt={4}
                    colorScheme="green"
                    isLoading={updateIsLoading}
                    disabled={updateIsLoading}
                    type="button"
                    onClick={addPost}
                  >
                    Add
                  </Button>
                </Stack>
              </form>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
