import { ConnectButton } from '@components/web3/ConnectButton'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'

export const HomeTopBar: FC = () => {
  return (
    <>
      <div tw="absolute top-0 left-0 right-0 z-10 flex items-center justify-center whitespace-pre-wrap bg-gray-900 py-3 px-2 text-center font-bold font-semibold text-sm text-white/75 hover:text-white">
        <ConnectButton />
      </div>
    </>
  )
}
