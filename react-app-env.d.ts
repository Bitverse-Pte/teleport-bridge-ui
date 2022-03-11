/// <reference types="react-scripts" />
import '@metamask/types'
import type { Window as KeplrWindow } from '@keplr-wallet/types'
declare module '@walletconnect/web3-provider'
declare module 'web3'
declare module '*.tiff'
// this file is conditionally added/removed to next-env.d.ts
// if the static image import handling is enabled

interface StaticImageData {
  src: string
  height: number
  width: number
  blurDataURL?: string
}

declare module '*.png' {
  const content: StaticImageData

  export default content
}

declare module '*.svg' {
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: StaticImageData

  export default content
}

declare module '*.jpg' {
  const content: StaticImageData

  export default content
}

declare module '*.jpeg' {
  const content: StaticImageData

  export default content
}

declare module '*.gif' {
  const content: StaticImageData

  export default content
}

declare module '*.webp' {
  const content: StaticImageData

  export default content
}

declare module '*.avif' {
  const content: StaticImageData

  export default content
}

declare module '*.ico' {
  const content: StaticImageData

  export default content
}

declare module '*.bmp' {
  const content: StaticImageData

  export default content
}

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
  interface Window extends KeplrWindow {
    Box: any
    web3: Record<string, unknown>
    box: any
    space: any
    ethereum: EthereumProvider
    [name: string]: any
  }
}
