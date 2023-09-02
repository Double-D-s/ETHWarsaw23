'use client'
import { SupportedChainId, resolveDomainToAddress } from '@azns/resolver-core'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { CenterBody } from '@components/layout/CenterBody'
import { ContractIds } from '@deployments/deployments'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import Image from 'next/image'
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
      <CenterBody>
        <Text fontSize={'2xl'}>
          {domain}
          <span color={'yellow'}>.TZERO</span>
          {/* TODO use tailwind color yellow ^^ */}
          <Text marginBottom={'8px'} fontWeight={'thin'} fontSize={'1xs'}>
            {address}
          </Text>
          <hr />
        </Text>
        <Box>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            {[
              {
                id: 1,
                title: 'Post 1',
                img: 'https://via.placeholder.com/150x150.png?text=Thumbnail',
                description: 'Description for post 1',
              },
              {
                id: 2,
                title: 'Post 2',
                img: 'https://via.placeholder.com/150x150.png?text=Thumbnail',
                description: 'Description for post 2',
              },
              {
                id: 3,
                title: 'Post 3',
                img: 'https://via.placeholder.com/150x150.png?text=Thumbnail',
                description: 'Description for post 3',
              },
            ].map((post) => (
              <GridItem key={post.id}>
                <Box p={4}>
                  <Image src={post.img} width={250} height={150} alt={''} />
                  <Text fontSize={'1xl'}>Recent Posts</Text>
                  <Text>{post.description}</Text>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </CenterBody>
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
