// import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
// import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
// import { PortisConnector } from '@web3-react/portis-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/index'
import { INFURA_NETWORK_URLS } from 'constants/infura'
import UNISWAP_LOGO_URL from 'public/svg/uniswap.svg'

// import { PortisConnector } from '@web3-react/portis-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'

// import { SupportedChainId } from 'constants/chains'
// import { FortmaticConnector } from './Fortmatic'
// import { NetworkConnector } from './NetworkConnector'

// const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY
// const FORMATIC_KEY = process.env.NEXT_PUBLIC_FORTMATIC_KEY
// const PORTIS_ID = process.env.NEXT_PUBLIC_PORTIS_ID

// if (typeof INFURA_KEY === 'undefined') {
//   throw new Error('NEXT_PUBLIC_INFURA_KEY must be a defined environment variable')
// }

// const NETWORK_URLS: { [key in SupportedChainId]: string } = {
//   [SupportedChainId.BSC]: 'https://bsc-dataseed.binance.org/',
//   [SupportedChainId.BSC_TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
//   [SupportedChainId.TELEPORT]: 'http://10.41.20.10:8545',
//   [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.OPTIMISM]: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.OPTIMISTIC_KOVAN]: `https://optimism-kovan.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.ARBITRUM_ONE]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
//   [SupportedChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
// }

/* 

export const bscConnector = new NetworkConnector({
  urls: { [BSC_CHAIN_ID]: 'https://bsc-dataseed.binance.org' },
  defaultChainId: 56,
}) */

/* let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
} */

/* export const network = new NetworkConnector({
  urls: [],
  defaultChainId: 1,
})
 */
export const injected = new InjectedConnector({
  // supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

/* const gnosisSafe = dynamic(
  async () => {
    const { SafeAppConnector } = await import('@gnosis.pm/safe-apps-web3-react')
    return new SafeAppConnector()
  },
  {
    ssr: false,
  },
) */

// export const gnosisSafe = new SafeAppConnector()

// const FORMATIC_KEY = process.env.NEXT_PUBLIC_FORTMATIC_KEY
// const PORTIS_ID = process.env.NEXT_PUBLIC_PORTIS_ID

export const walletconnect = new WalletConnectConnector({
  // supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: INFURA_NETWORK_URLS,
  qrcode: true,
})

// mainnet only
// export const fortmatic = new FortmaticConnector({
//   apiKey: FORMATIC_KEY ?? '',
//   chainId: 1,
// })

// mainnet only
// export const portis = new PortisConnector({
//   dAppId: PORTIS_ID ?? '',
//   networks: [1],
// })

// export const walletlink = new WalletLinkConnector({
//   url: INFURA_NETWORK_URLS[SupportedChainId.MAINNET],
//   appName: 'Uniswap',
//   appLogoUrl: UNISWAP_LOGO_URL,
//   // supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
// })
