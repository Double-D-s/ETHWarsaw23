import { SupportedChainId, resolveDomainToAddress } from '@azns/resolver-core'
import { useEffect, useState } from 'react'
import { HomeTopBar } from '@components/home/HomeTopBar'

// const [data, posts] = await Promise.all([
//   getProfileData(params.domain),
//   getPostsForSite(params.domain),
// ]);

// if (!data) {
//   notFound();
// }
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
