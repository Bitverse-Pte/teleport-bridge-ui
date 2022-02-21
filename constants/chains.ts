import { ETH_ON_MAINNET, ETH_ON_RINKEBY, ETH_ON_TELEPORT_TEST, TELE_ON_RINKEBY, TELE_ON_TELEPORT_TEST, USDT_ON_MAINNET, USDT_ON_RINKEBY, USDT_ON_TELEPORT_TEST } from './tokens'
import { ChainDataList, IChainData } from 'constants/index'

import EthereumLogo from 'assets/images/ethereum-logo.png'
import BSCLogo from 'assets/BSC.png'
import ethereumLogoUrl from 'assets/images/ethereum-logo.png'
import arbitrumLogoUrl from 'assets/svg/arbitrum_logo.svg'
import defaultIcon from 'assets/defaultIcon.svg'
import optimismLogoUrl from 'assets/svg/optimistic_ethereum.svg'
import ms from 'ms.macro'

import { ARBITRUM_LIST, BSC_LIST, OPTIMISM_LIST } from './lists'
export const CHAIN_DATA_LIST: ChainDataList = {
  1: {
    chainId: 1,
    chain: 'ETH',
    network: 'mainnet',
    networkId: 1,
  },
  2: {
    chainId: 2,
    chain: 'EXP',
    network: 'expanse',
    networkId: 1,
  },
  3: {
    chainId: 3,
    chain: 'ETH',
    network: 'ropsten',
    networkId: 3,
  },
  4: {
    chainId: 4,
    chain: 'ETH',
    network: 'rinkeby',
    networkId: 4,
  },
  5: {
    chainId: 5,
    chain: 'ETH',
    network: 'goerli',
    networkId: 5,
  },
  6: {
    chainId: 6,
    chain: 'ETC',
    network: 'kotti',
    networkId: 6,
  },
  8: {
    chainId: 8,
    chain: 'UBQ',
    network: 'ubiq',
    networkId: 88,
  },
  9: {
    chainId: 9,
    chain: 'UBQ',
    network: 'ubiq-testnet',
    networkId: 2,
  },
  10: {
    chainId: 10,
    chain: 'ETH',
    network: 'optimism',
    networkId: 10,
  },
  11: {
    chainId: 11,
    chain: 'META',
    network: 'metadium',
    networkId: 11,
  },
  12: {
    chainId: 12,
    chain: 'META',
    network: 'metadium-testnet',
    networkId: 12,
  },
  18: {
    chainId: 18,
    chain: 'TST',
    network: 'thundercore-testnet',
    networkId: 18,
  },
  30: {
    chainId: 30,
    chain: 'RSK',
    network: 'rsk',
    networkId: 30,
  },
  31: {
    chainId: 31,
    chain: 'RSK',
    network: 'rsk-testnet',
    networkId: 31,
  },
  42: {
    chainId: 42,
    chain: 'ETH',
    network: 'kovan',
    networkId: 42,
  },
  56: {
    chainId: 56,
    chain: 'BSC',
    network: 'binance',
    networkId: 56,
  },
  60: {
    chainId: 60,
    chain: 'GO',
    network: 'gochain',
    networkId: 60,
  },
  61: {
    chainId: 61,
    chain: 'ETC',
    network: 'etc',
    networkId: 1,
  },
  62: {
    chainId: 62,
    chain: 'ETC',
    network: 'etc-morden',
    networkId: 2,
  },
  63: {
    chainId: 63,
    chain: 'ETC',
    network: 'etc-testnet',
    networkId: 7,
  },
  64: {
    chainId: 64,
    chain: 'ELLA',
    network: 'ellaism',
    networkId: 64,
  },
  69: {
    chainId: 69,
    chain: 'ETH',
    network: 'optimism-kovan',
    networkId: 69,
  },
  76: {
    chainId: 76,
    chain: 'MIX',
    network: 'mix',
    networkId: 76,
  },
  77: {
    chainId: 77,
    chain: 'POA',
    network: 'poa-sokol',
    networkId: 77,
  },
  88: {
    chainId: 88,
    chain: 'TOMO',
    network: 'tomochain',
    networkId: 88,
  },
  99: {
    chainId: 99,
    chain: 'POA',
    network: 'poa-core',
    networkId: 99,
  },
  100: {
    chainId: 100,
    chain: 'XDAI',
    network: 'xdai',
    networkId: 100,
  },
  101: {
    chainId: 101,
    chain: 'ETI',
    network: 'etherinc',
    networkId: 1,
  },
  108: {
    chainId: 108,
    chain: 'TT',
    network: 'thundercore',
    networkId: 108,
  },
  162: {
    chainId: 162,
    chain: 'PHT',
    network: 'sirius',
    networkId: 162,
  },
  163: {
    chainId: 163,
    chain: 'PHT',
    network: 'lightstreams',
    networkId: 163,
  },
  211: {
    chainId: 211,
    chain: 'FTN',
    network: 'freight',
    networkId: 0,
  },
  269: {
    chainId: 269,
    chain: 'HPB',
    network: 'hpb',
    networkId: 100,
  },
  385: {
    chainId: 385,
    chain: 'CRO',
    network: 'lisinski',
    networkId: 385,
  },
  820: {
    chainId: 820,
    chain: 'CLO',
    network: 'callisto',
    networkId: 1,
  },
  821: {
    chainId: 821,
    chain: 'CLO',
    network: 'callisto-testnet',
    networkId: 2,
  },
  137: {
    chainId: 137,
    chain: 'MATIC',
    network: 'matic',
    networkId: 137,
  },
  42161: {
    chainId: 42161,
    chain: 'ETH',
    network: 'arbitrum',
    networkId: 42161,
  },
  80001: {
    chainId: 80001,
    chain: 'MUMBAI',
    network: 'mumbai',
    networkId: 80001,
  },
  246529: {
    chainId: 246529,
    chain: 'ARTIS sigma1',
    network: 'artis-s1',
    networkId: 246529,
  },
  246785: {
    chainId: 246785,
    chain: 'ARTIS tau1',
    network: 'artis-t1',
    networkId: 246785,
  },
  421611: {
    chainId: 421611,
    chain: 'ETH',
    network: 'arbitrum-rinkeby',
    networkId: 421611,
  },
}

const chainIdToNetwork: { [network: number]: string } = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  5: 'goerli',
}

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  BSC = 56,
  BSC_TESTNET = 97,
  TELEPORT = 7001,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.BSC,
  SupportedChainId.BSC_TESTNET,
  SupportedChainId.TELEPORT,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
]

export const L1_CHAIN_IDS = [SupportedChainId.MAINNET, SupportedChainId.ROPSTEN, SupportedChainId.RINKEBY, SupportedChainId.GOERLI, SupportedChainId.KOVAN] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

export const L2_CHAIN_IDS = [SupportedChainId.ARBITRUM_ONE, SupportedChainId.ARBITRUM_RINKEBY, SupportedChainId.OPTIMISM, SupportedChainId.OPTIMISTIC_KOVAN] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

export interface L1ChainInfo {
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly explorer: string
  readonly infoLink: string
  readonly label: string
  readonly logoUrl?: string
  readonly rpcUrls?: string[]
  readonly nativeCurrency: {
    name: string // 'Goerli ETH',
    symbol: string // 'gorETH',
    decimals: number //18,
  }
}
export interface L2ChainInfo extends L1ChainInfo {
  readonly bridge: string
  readonly logoUrl: string
  readonly statusPage?: string
  readonly defaultListUrl: string
}

export type ChainInfo = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }
/* 
id(pin):56
name(pin):"BSC"
icon(pin):"https://get.celer.app/cbridge-icons/chain-icon/BSC.png"
block_delay(pin):20
gas_token_symbol(pin):"BNB"
explore_url(pin):"https://bscscan.com/"
contract_addr(pin):"0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF"
drop_gas_amt(pin):"2000000000000000"
suggested_gas_cost(pin):"125624"
drop_gas_cost_amt(pin):"100000000000000"
drop_gas_balance_alert(pin):"0" */

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.BSC]: {
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://www.binance.org/en/bridge',
    defaultListUrl: '',
    docs: 'https://docs.binance.org/',
    explorer: 'https://bscscan.com/',
    infoLink: '',
    label: 'Binance Smart Chain',
    logoUrl: BSCLogo,
    nativeCurrency: { name: 'Binance Coin', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
  },
  /* [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  }, */
  [SupportedChainId.ARBITRUM_ONE]: {
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://bridge.arbitrum.io/',
    defaultListUrl: ARBITRUM_LIST,
    docs: 'https://offchainlabs.com/',
    explorer: 'https://arbiscan.io/',
    infoLink: 'https://info.uniswap.org/#/arbitrum/',
    label: 'Arbitrum',
    logoUrl: arbitrumLogoUrl,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  },
  [SupportedChainId.ARBITRUM_RINKEBY]: {
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://bridge.arbitrum.io/',
    defaultListUrl: ARBITRUM_LIST,
    docs: 'https://offchainlabs.com/',
    explorer: 'https://rinkeby-explorer.arbitrum.io/',
    infoLink: 'https://info.uniswap.org/#/arbitrum/',
    label: 'Arbitrum Rinkeby',
    logoUrl: arbitrumLogoUrl,
    nativeCurrency: { name: 'Rinkeby ArbETH', symbol: 'rinkArbETH', decimals: 18 },
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
  },
  [SupportedChainId.MAINNET]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.RINKEBY]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://rinkeby.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Rinkeby',
    nativeCurrency: { name: 'Rinkeby ETH', symbol: 'rinkETH', decimals: 18 },
  },
  [SupportedChainId.ROPSTEN]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://ropsten.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ropsten',
    nativeCurrency: { name: 'Ropsten ETH', symbol: 'ropETH', decimals: 18 },
  },
  [SupportedChainId.KOVAN]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://kovan.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Kovan',
    nativeCurrency: { name: 'Kovan ETH', symbol: 'kovETH', decimals: 18 },
  },
  [SupportedChainId.GOERLI]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://goerli.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Görli',
    nativeCurrency: { name: 'Görli ETH', symbol: 'görETH', decimals: 18 },
  },
  [SupportedChainId.OPTIMISM]: {
    blockWaitMsBeforeWarning: ms`15m`,
    bridge: 'https://gateway.optimism.io/',
    defaultListUrl: OPTIMISM_LIST,
    docs: 'https://optimism.io/',
    explorer: 'https://optimistic.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/optimism/',
    label: 'OΞ',
    logoUrl: optimismLogoUrl,
    nativeCurrency: { name: 'Optimistic ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
  },
  [SupportedChainId.OPTIMISTIC_KOVAN]: {
    blockWaitMsBeforeWarning: ms`15m`,
    bridge: 'https://gateway.optimism.io/',
    defaultListUrl: OPTIMISM_LIST,
    docs: 'https://optimism.io/',
    explorer: 'https://optimistic.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/optimism/',
    label: 'Optimistic Kovan',
    rpcUrls: ['https://kovan.optimism.io'],
    logoUrl: optimismLogoUrl,
    nativeCurrency: { name: 'Optimistic kovETH', symbol: 'kovOpETH', decimals: 18 },
  },
}

export const ARBITRUM_HELP_CENTER_LINK = 'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum'
export const OPTIMISM_HELP_CENTER_LINK = 'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ'

export const IS_TEST_NETWORK = process.env.REACT_APP_NETWORK_MODE === 'TEST'

export const DEFAULT_DESTINATION_CHAIN: IChainData = {
  name: 'TELEPORT TEST',
  short_name: 'tpt',
  chain: 'TELE',
  network: 'rinkeby',
  chain_id: 7001,
  network_id: 7001,
  rpc_url: 'http://10.41.20.10:8545',
  logo: defaultIcon,
  native_currency: {
    name: 'TELE',
    symbol: 'TELE',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
  supportTokens: [USDT_ON_TELEPORT_TEST, ETH_ON_TELEPORT_TEST, TELE_ON_TELEPORT_TEST],
}

export const SupportedChains: Map<number, IChainData> = new Map(
  IS_TEST_NETWORK
    ? [
        [
          4,
          {
            name: 'Ethereum Rinkeby',
            short_name: 'rin',
            chain: 'ETH',
            network: 'rinkeby',
            chain_id: 4,
            network_id: 4,
            rpc_url: 'https://rinkeby.infura.io/v3/%API_KEY%',
            logo: EthereumLogo,
            native_currency: {
              name: 'Rinkeby ETH',
              symbol: 'rinkETH',
              decimals: '18',
              contractAddress: '',
              balance: '',
            },
            supportTokens: [USDT_ON_RINKEBY, ETH_ON_RINKEBY, TELE_ON_RINKEBY],
          },
        ],
        [7001, DEFAULT_DESTINATION_CHAIN],
      ]
    : [
        [
          1,
          {
            name: 'Ethereum Mainnet',
            short_name: 'eth',
            chain: 'ETH',
            network: 'mainnet',
            chain_id: 1,
            network_id: 1,
            rpc_url: 'https://mainnet.infura.io/v3/%API_KEY%',
            logo: EthereumLogo,
            native_currency: {
              symbol: 'ETH',
              name: 'Ethereum',
              decimals: '18',
              contractAddress: '',
              balance: '',
            },
            supportTokens: [ETH_ON_MAINNET, USDT_ON_MAINNET],
          },
        ],
        /* {
  name: 'Ethereum Ropsten',
  short_name: 'rop',
  logo: RopstenLogo,
  chain: 'ETH',
  network: 'ropsten',
  chain_id: 3,
  network_id: 3,
  rpc_url: 'https://ropsten.infura.io/v3/%API_KEY%',
  native_currency: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
}, */
        /*
{
  name: 'Ethereum Görli',
  short_name: 'gor',
  chain: 'ETH',
  network: 'goerli',
  logo: '',
  chain_id: 5,
  network_id: 5,
  rpc_url: 'https://goerli.infura.io/v3/%API_KEY%',
  native_currency: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'RSK Mainnet',
  short_name: 'rsk',
  chain: 'RSK',
  logo: '',
  network: 'mainnet',
  chain_id: 30,
  network_id: 30,
  rpc_url: 'https://public-node.rsk.co',
  native_currency: {
    symbol: 'RSK',
    name: 'RSK',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'Ethereum Kovan',
  short_name: 'kov',
  chain: 'ETH',
  network: 'kovan',
  chain_id: 42,
  logo: '',
  network_id: 42,
  rpc_url: 'https://kovan.infura.io/v3/%API_KEY%',
  native_currency: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'Ethereum Classic Mainnet',
  short_name: 'etc',
  chain: 'ETC',
  network: 'mainnet',
  logo: '',
  chain_id: 61,
  network_id: 1,
  rpc_url: 'https://ethereumclassic.network',
  native_currency: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'POA Network Sokol',
  short_name: 'poa',
  chain: 'POA',
  network: 'sokol',
  chain_id: 77,
  logo: '',
  network_id: 77,
  rpc_url: 'https://sokol.poa.network',
  native_currency: {
    symbol: 'POA',
    name: 'POA',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'POA Network Core',
  short_name: 'skl',
  chain: 'POA',
  network: 'core',
  chain_id: 99,
  network_id: 99,
  logo: '',
  rpc_url: 'https://core.poa.network',
  native_currency: {
    symbol: 'POA',
    name: 'POA',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'xDAI Chain',
  short_name: 'xdai',
  chain: 'POA',
  network: 'dai',
  chain_id: 100,
  logo: '',
  network_id: 100,
  rpc_url: 'https://dai.poa.network',
  native_currency: {
    symbol: 'xDAI',
    name: 'xDAI',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
},
{
  name: 'Callisto Mainnet',
  short_name: 'clo',
  chain: 'callisto',
  network: 'mainnet',
  chain_id: 820,
  logo: '',
  network_id: 1,
  rpc_url: 'https://clo-geth.0xinfra.com/',
  native_currency: {
    symbol: 'CLO',
    name: 'CLO',
    decimals: '18',
    contractAddress: '',
    balance: '',
  },
}, */
        /*    {
      name: 'Binance Smart Chain',
      short_name: 'bsc',
      chain: 'smartchain',
      network: 'mainnet',
      chain_id: 56,
      logo: BSCLogo,
      network_id: 56,
      rpc_url: 'https://bsc-dataseed.binance.org/',
      native_currency: {
        symbol: 'BNB',
        name: 'BNB',
        decimals: '18',
        contractAddress: '',
        balance: '',
      },
      supportTokens: [
        {
          chainId: 56,
          symbol: 'ETH',
          name: 'Ethereum Token',
          decimals: 18,
          address: '',
          logoURI: EthereumLogo,
          // balance: '',
        },
        {
          chainId: 1,
          name: 'Tether USD',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
          decimals: 6,
          symbol: 'USDT',
        },
      ],
    }, */
      ]
)
