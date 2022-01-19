import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks/web3'
import { RootState } from './../store/store'
import { useSelector } from 'react-redux'
import { Chain } from 'constants/types'
export function useChain() {
  const { chainId } = useActiveWeb3React()
  const availableChains = useSelector((state: RootState) => state.application.availableChains)
  return useMemo(() => {
    let data
    try {
      const chainData = availableChains!.get(chainId!)

      if (!chainData) {
        throw new Error('ChainId missing or not supported')
      }

      const API_KEY = process.env.REACT_APP_INFURA_ID
      for (let index = 0; index < chainData.rpc.length; index++) {
        if (chainData.rpc[index].includes('infura.io') && chainData.rpc[index].includes('%API_KEY%') && API_KEY) {
          const rpcUrl = chainData.rpc[index].replace('%API_KEY%', API_KEY)
          chainData.rpc[index] = rpcUrl
        }
      }

      return chainData
    } catch (error) {
      data = {} as Chain
      // setReady(false)
      // setError(error as Error)
    }
    return data
  }, [chainId, availableChains])
}
