import { getAddress } from '@ethersproject/address'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { Chain } from 'constants/types'

export * from './local'
// export * from './utils'

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any,
  )
}

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

export function isObject(obj: any): boolean {
  return typeof obj === 'object' && !!Object.keys(obj).length
}

const API_KEY = process.env.NEXT_PUBLIC_INFURA_ID

export function fillRpc(chain: Chain) {
  for (let index = 0; index < chain.rpc.length; index++) {
    if (
      chain.rpc[index].includes('infura.io') &&
      chain.rpc[index].includes('%API_KEY%') &&
      API_KEY
    ) {
      const rpcUrl = chain.rpc[index].replace('%API_KEY%', API_KEY)
      chain.rpc[index] = rpcUrl
    }
  }
}
