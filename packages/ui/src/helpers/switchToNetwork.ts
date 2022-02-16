import { BigNumber } from '@ethersproject/bignumber'
import { hexStripZeros } from '@ethersproject/bytes'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
// import { bscConnector } from 'connectors'
// import { NetworkConnector } from '@web3-react/network-connector'

import { Chain } from 'constants/index'
import { store } from 'store/store'

import { addNetwork } from './addNetwork'
import { errorNoti } from './notifaction'
/* 
interface SwitchNetworkArguments {
  library: Web3Provider
  chainId?: SupportedChainId
} */

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
  // console.log(connector)
  // const localConnector = connector as NetworkConnector
  try {
    // await activate!(bscConnector)
    await library?.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }],
    })
    /* const info = CHAIN_INFO[chainId!]
    console.log(connector)
    await library?.send('wallet_addEthereumChain', [
      {
        chainId: formattedChainId,
        chainName: info.label,
        rpcUrls: info.rpcUrls,
        nativeCurrency: info.nativeCurrency,
        blockExplorerUrls: [info.explorer],
      },
      '0x31fF0B83003A89332BcCe9d733732A581C89ad83',
    ]) */
    return true
  } catch (error) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    if ((error as any).code === 4902 && chainId !== undefined) {
      const chain = store.getState().application.availableChains.get(chainId)
      if (!chain) {
        errorNoti(`chain: ${chainId} is not supported!`)
        return
      }
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      await addNetwork({ library, chainId, info: chain as Chain })
    }
    errorNoti(`failed to change chain to ${chainId}, detail is ${(error as any).message}`)
    /*  if (retry) {
      try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: formattedChainId }],
        })
      } catch (retryErr) {
        console.error(retryErr)
      }
    } else {
      console.error(error)
    } */
    // }
  }
}
