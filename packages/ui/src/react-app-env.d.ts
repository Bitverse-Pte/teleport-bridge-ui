/// <reference types="react-scripts" />
import '@metamask/types'
declare module '@walletconnect/web3-provider'
declare module 'web3'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare namespace Storage {}

export interface EthereumProvider {
  [x: string]: any
  on?: (...args: any[]) => void
  removeListener?: (...args: any[]) => void
  autoRefreshOnNetworkChange?: boolean
  isCoinbaseWallet?: true
  isMetaMask?: true
}
// tslint:disable-next-line

declare global {
  interface Window {
    Box: any
    web3: Record<string, unknown>
    box: any
    space: any
    ethereum: EthereumProvider
    [name: string]: any
  }
}
