import { useMemo } from 'react'
import { getContract } from 'helpers'
import { useActiveWeb3React } from 'hooks/web3'
import TransferFromTeleABI from './Transfer-tele.json'
import TransferFromRinkebyABI from './Transfer-rinkeby.json'

export function useTransferFromEvmContract() {
  //transparentFromEvmContract
  const { library, account } = useActiveWeb3React()
  const contract = getContract('0x0C13DfFf49787Cb831752C83e18BCCA4B65fC8b9', TransferFromRinkebyABI, library!, account!)

  return useMemo(() => {
    if (!library || !account) return null
    return contract
  }, [library, account])
}

export function useTransferFromTeleContract() {
  const { library, account } = useActiveWeb3React()
  const contract = getContract('0x0000000000000000000000000000000010000003', TransferFromTeleABI, library!, account!)

  return useMemo(() => {
    if (!library || !account) return null
    return contract
  }, [library, account])
}
