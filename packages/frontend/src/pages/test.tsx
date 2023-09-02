import { Button, Text } from '@chakra-ui/react'
import { HomePageTitle } from '@components/home/HomePageTitle'
import { HomeTopBar } from '@components/home/HomeTopBar'
import { CenterBody } from '@components/layout/CenterBody'
import { ChainInfo } from '@components/web3/ChainInfo'
import { ConnectButton } from '@components/web3/ConnectButton'
import { PostContract } from '@components/web3/PostContract'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import 'twin.macro'

const Test: NextPage = () => {
  // Display `useInkathon` error messages (optional)
  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <>
      {/* Top Bar */}
      <HomeTopBar />

      <CenterBody tw="mt-20 mb-10 px-5">
        <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4">
          {/* Greeter Read/Write Contract Interactions */}
          <PostContract />
        </div>
      </CenterBody>
    </>
  )
}

export default Test
