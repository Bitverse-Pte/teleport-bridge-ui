import { AbstractConnector } from '@web3-react/abstract-connector'

// import INJECTED_ICON_URL from 'public/images/arrow-right.svg'
// import COINBASE_ICON_URL from 'public/images/coinbaseWalletIcon.svg'
// import FORTMATIC_ICON_URL from 'public/images/fortmaticIcon.png'
import METAMASK_ICON_URL from 'public/images/metamask.png'
// import PORTIS_ICON_URL from 'public/images/portisIcon.png'
import WALLETCONNECT_ICON_URL from 'public/images/walletConnectIcon.svg'
import { /* fortmatic, */ injected, /* portis, */ walletconnect /* walletlink */ } from '../connectors'
import { WALLET_TYPE } from './types'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconURL: string | StaticImageData
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
  walletType: WALLET_TYPE
}

export const SUPPORTED_WALLETS = new Map<string, WalletInfo>(
  /*   INJECTED: {
    connector: injected,
    name: 'Injected',
    iconURL: INJECTED_ICON_URL,
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  }, */
  [
    [
      'METAMASK',
      {
        connector: injected,
        name: 'MetaMask',
        iconURL: METAMASK_ICON_URL,
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D',
        walletType: WALLET_TYPE.EVM,
      },
    ],

    [
      'WALLET_CONNECT',
      {
        connector: walletconnect,
        name: 'WalletConnect',
        iconURL: WALLETCONNECT_ICON_URL,
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
        mobile: true,
        walletType: WALLET_TYPE.EVM,
      },
    ],
    /*   [
      'WALLET_LINK',
      {
        connector: walletlink,
        name: 'Coinbase Wallet',
        iconURL: COINBASE_ICON_URL,
        description: 'Use Coinbase Wallet app on mobile device',
        href: null,
        color: '#315CF5',
        walletType: WALLET_TYPE.EVM,
      },
    ], */
    /*  [
      'COINBASE_LINK',
      {
        name: 'Open in Coinbase Wallet',
        iconURL: COINBASE_ICON_URL,
        description: 'Open in Coinbase Wallet app.',
        href: 'https://go.cb-w.com/mtUDhEZPy1',
        color: '#315CF5',
        mobile: true,
        mobileOnly: true,
        walletType: WALLET_TYPE.EVM,
      },
    ], */
    /*   [
      'FORTMATIC',
      {
        connector: fortmatic,
        name: 'Fortmatic',
        iconURL: FORTMATIC_ICON_URL,
        description: 'Login using Fortmatic hosted wallet',
        href: null,
        color: '#6748FF',
        mobile: true,
        walletType: WALLET_TYPE.EVM,
      },
    ],
    [
      'Portis',
      {
        connector: portis,
        name: 'Portis',
        iconURL: PORTIS_ICON_URL,
        description: 'Login using Portis hosted wallet',
        href: null,
        color: '#4A6C9B',
        mobile: true,
        walletType: WALLET_TYPE.EVM,
      },
    ], */
  ]
)
