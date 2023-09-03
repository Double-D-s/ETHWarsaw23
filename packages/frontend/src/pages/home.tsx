import { Button, Link } from '@chakra-ui/react'
import { CenterBody } from '@components/layout/CenterBody'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import Image from 'next/image'
import NextLink from 'next/link'
import inkathon from 'public/brand/laptop.png'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import 'twin.macro'

const HomePage: NextPage = () => {
  // Display `useInkathon` error messages (optional)
  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <>
      <CenterBody tw="mt-20 mb-10 px-5">
        {/* Title */}
        <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4">
          <h1>
            AlephBlog is your go-to place to post on-chian blog posts in the Aleph Zero ecosystem.
            You have 100% ownership of your content - all on-chain and all immutable.{' '}
          </h1>
          <div tw="mt-10">
            <Image src={inkathon} width={500} alt="ink!athon Logo" />
          </div>
        </div>
      </CenterBody>
      <CenterBody>
        <div tw="mb-20">
          <Link as={NextLink} href="http://app.localhost:3000">
            <Button colorScheme="blue">launch my blog</Button>
          </Link>
        </div>
      </CenterBody>
    </>
  )
}

export default HomePage
