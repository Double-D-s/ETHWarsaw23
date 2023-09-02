import { SupportedChainId, resolveDomainToAddress } from '@azns/resolver-core'
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
      <div>{address}</div>
      {/* <AzeroIdDisplay addy={address as string} /> */}
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
