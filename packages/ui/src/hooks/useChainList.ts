import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { SupportedChains } from 'constants/chains'
import { RootState } from 'store/store'

export function useFromChainList() {
  const destinationChain = useSelector((state: RootState) => state.application.destinationChain)
  return useMemo(() => {
    const fromChainList = []
    for (const [chainId, chain] of SupportedChains.entries()) {
      if (chainId !== destinationChain.chain_id) {
        fromChainList.push(chain)
      }
    }
    return fromChainList
  }, [destinationChain])
}
