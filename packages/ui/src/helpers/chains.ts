import { SupportedChains } from 'constants/chains'
import { IChainData } from '../constants/types'

export function getChainData(chainId = 1): IChainData {
  const chainData = SupportedChains.get(chainId)

  if (!chainData) {
    throw new Error('ChainId missing or not supported')
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID

  if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%API_KEY%') && API_KEY) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)

    return {
      ...chainData,
      rpc_url: rpcUrl,
    }
  }

  return chainData
}
