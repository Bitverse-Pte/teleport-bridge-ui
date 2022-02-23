import EthereumLogo from 'public/images/ethereum-logo.png'
import DefaultIcon from 'public/defaultIcon.svg'
import USDTLogo from 'public/usdt.svg'
import ERC20ABI from 'contracts/erc20.json'
import { TokenInfo } from 'constants/types'

/*   readonly chainId: number
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  readonly logoURI?: string
  readonly tags?: string[]
  readonly extensions?: {
    readonly [key: string]: string | number | boolean | null
  } */
export const USDT_ON_MAINNET: TokenInfo = {
  chainId: 1,
  name: 'Tether USD',
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  logoURI: USDTLogo,
  decimals: 6,
  isNative: false,
  symbol: 'USDT',
  abi: ERC20ABI,
}

export const USDT_ON_RINKEBY: TokenInfo = {
  chainId: 4,
  name: 'Tether USD',
  address: '0xd92e713d051c37ebb2561803a3b5fbabc4962431',
  logoURI: USDTLogo,
  decimals: 6,
  isNative: false,
  symbol: 'USDT',
  abi: ERC20ABI,
}

export const USDT_ON_TELEPORT_TEST: TokenInfo = {
  chainId: 7001,
  name: 'Tether USD',
  address: '0x88af15e1f4027b390C76F7168320bA5c90dBD959',
  logoURI: USDTLogo,
  decimals: 6,
  isNative: false,
  symbol: 'USDT',
  abi: ERC20ABI,
}

export const USDT_ON_TELEPORT_MAIN: TokenInfo = {
  chainId: 9001,
  name: 'Tether USD',
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  logoURI: USDTLogo,
  decimals: 6,
  isNative: false,
  symbol: 'USDT',
  abi: ERC20ABI,
}

export const ETH_ON_MAINNET: TokenInfo = {
  chainId: 1,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '',
  logoURI: EthereumLogo,
  isNative: true,
  abi: ERC20ABI,
}

export const ETH_ON_RINKEBY: TokenInfo = {
  chainId: 4,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '',
  logoURI: EthereumLogo,
  isNative: true,
  abi: ERC20ABI,
}

export const ETH_ON_TELEPORT_TEST: TokenInfo = {
  chainId: 7001,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '0xCb30524C79f96aAbA7a0D71Df29310dfA10fbF9C',
  logoURI: EthereumLogo,
  isNative: false,
  abi: ERC20ABI,
}

export const ETH_ON_TELEPORT_MAIN: TokenInfo = {
  chainId: 9001,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '',
  logoURI: EthereumLogo,
  isNative: true,
  abi: ERC20ABI,
}

export const TELE_ON_MAINNET: TokenInfo = {
  abi: ERC20ABI,

  chainId: 1,
  symbol: 'TELE',
  name: 'TELE',
  decimals: 18,
  address: '',
  logoURI: DefaultIcon,
  isNative: true,
}

export const TELE_ON_RINKEBY: TokenInfo = {
  chainId: 4,
  symbol: 'TELE',
  name: 'TELE',
  decimals: 18,
  address: '0x145b67cFD57b5B4286c8DD1E69Be124Bc350F056',
  logoURI: DefaultIcon,
  isNative: false,
  abi: ERC20ABI,
}

export const TELE_ON_TELEPORT_TEST: TokenInfo = {
  abi: ERC20ABI,
  chainId: 7001,
  symbol: 'TELE',
  name: 'TELE',
  decimals: 18,
  address: '',
  logoURI: DefaultIcon,
  isNative: true,
}
export const TELE_ON_TELEPORT_MAIN: TokenInfo = {
  abi: ERC20ABI,
  chainId: 9001,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '',
  logoURI: DefaultIcon,
  isNative: true,
}
