import Bundlr from '@bundlr-network/client'
import { env } from '@config/environment'
import type { NextApiRequest, NextApiResponse } from 'next'

const jwk = JSON.parse(env.jwt)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('test')

  if (req.method === 'POST') {
    const bundlr = new Bundlr('http://node2.bundlr.network', 'arweave', jwk)
    const { content } = req.body

    bundlr
      .upload(content)
      .then((r) => res.status(200).json({ url: `https://arweave.net/${r.id}` }))
      .catch((err) => res.status(500).json({ error: err.message }))
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
