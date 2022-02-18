import { BigNumber } from '@ethersproject/bignumber'
import { hexStripZeros } from '@ethersproject/bytes'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'

import { Chain } from 'constants/index'
import { store } from 'store/store'

import { addNetwork } from './addNetwork'
import { errorNoti } from './notifaction'

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function switchToNetwork({ library, chainId, connector }: Partial<Web3ReactContextInterface<Web3Provider>> /* , retry = true */): Promise<boolean | undefined> {
  if (!library?.provider?.request) {
    return
  }
  if (!chainId && library?.getNetwork) {
    ;({ chainId } = await library.getNetwork())
  }
  const formattedChainId = hexStripZeros(BigNumber.from(chainId).toHexString())
  try {
    await library?.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }],
    })
    return true
  } catch (error) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    const chain = store.getState().application.availableChains.get(chainId!)
    if ((error as any).code === 4902 && chainId !== undefined) {
      if (!chain) {
        errorNoti(`chain: ${chainId} is not supported!`)
        return
      }
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      try {
        await addNetwork({ library, chainId, info: chain as Chain })
      } catch (err) {
        errorNoti(`chain: ${chainId} is not supported!`)
      }
    } else {
      errorNoti(`failed to change chain to ${chain?.name}, detail is ${(error as any).message}`)
    }
  }
}
