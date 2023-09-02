import { env } from '@config/environment'
import { SubstrateDeployment } from '@scio-labs/use-inkathon'

export enum ContractIds {
  Greeter = 'greeter',
  AzeroId = 'azeroId',
  Post = 'post',
}

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  const networks = env.supportedChains
  const deployments = networks
    .map(async (network) => [
      {
        contractId: ContractIds.Greeter,
        networkId: network,
        abi: await import(`@inkathon/contracts/deployments/greeter/metadata.json`),
        address: (await import(`@inkathon/contracts/deployments/greeter/${network}.ts`)).address,
      },
      {
        contractId: ContractIds.AzeroId,
        networkId: network,
        abi: await import(`metadata-registry.json`),
        address: '5FsB91tXSEuMj6akzdPczAtmBaVKToqHmtAwSUzXh49AYzaD',
      },
      {
        contractId: ContractIds.Post,
        networkId: network,
        abi: await import(`@inkathon/contracts/deployments/blog_post/blog_post.json`),
        address: (await import(`@inkathon/contracts/deployments/blog_post/${network}.ts`)).address,
      },
    ])
    .reduce(async (acc, curr) => [...(await acc), ...(await curr)], [] as any)
  return deployments
}
