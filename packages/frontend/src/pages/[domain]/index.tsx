import { SupportedChainId, resolveDomainToAddress } from '@azns/resolver-core'
import { Suspense, useEffect, useState } from 'react'

export default function Index() {
  const [pageIsLoading, setPageIsLoading] = useState<boolean>()
  const [address, setAddress] = useState<string>()

  const { domain } = { domain: window.location.hostname.split('.')[0] }
  console.log('domain', domain)

  async function resolveDomain() {
    try {
      setPageIsLoading(true)
      const { address, error } = await resolveDomainToAddress(`${domain}.tzero`, {
        chainId: SupportedChainId.AlephZeroTestnet,
      })
      if (error) throw new Error(error.message)
      console.log('address', address)
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
    <Suspense fallback={<div>Loading...</div>}>
      <div>{address}</div>
    </Suspense>
  )
}
