import type { HttpProvider, IpcProvider, WebsocketProvider, AbstractProvider } from 'web3-core/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ContractInterface, ContractTransaction } from '@ethersproject/contracts'

export interface ICurrency {
  symbol: string
  name: string
  decimals: string
  contractAddress: string
  balance?: string
}

export interface TokenInfo {
  readonly chainId: number
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  isNative: boolean
  readonly logoURI: string
  readonly tags?: string[]
  readonly abi?: ContractInterface
  readonly extensions?: {
    readonly [key: string]: string | number | boolean | null
  }
}

export interface IChainData {
  name: string
  short_name: string
  chain: string
  network: string
  chain_id: number
  network_id: number
  rpc_url: string
  native_currency: ICurrency
  logo: string
  supportTokens: TokenInfo[]
}

export interface ITxData {
  from: string
  to: string
  nonce: string
  gasPrice: string
  gasLimit: string
  value: string
  data: string
}

export interface IBlockScoutTx {
  value: string
  txreceipt_status: string
  transactionIndex: string
  to: string
  timeStamp: string
  nonce: string
  isError: string
  input: string
  hash: string
  gasUsed: string
  gasPrice: string
  gas: string
  from: string
  cumulativeGasUsed: string
  contractAddress: string
  confirmations: string
  blockNumber: string
  blockHash: string
}

export interface IBlockScoutTokenTx {
  value: string
  transactionIndex: string
  tokenSymbol: string
  tokenName: string
  tokenDecimal: string
  to: string
  timeStamp: string
  nonce: string
  input: string
  hash: string
  gasUsed: string
  gasPrice: string
  gas: string
  from: string
  cumulativeGasUsed: string
  contractAddress: string
  confirmations: string
  blockNumber: string
  blockHash: string
}

export interface IParsedTx {
  timestamp: string
  hash: string
  from: string
  to: string
  nonce: string
  gasPrice: string
  gasUsed: string
  fee: string
  value: string
  input: string
  error: boolean
  asset: ICurrency
  operations: ITxOperation[]
}

export interface ITxOperation {
  asset: ICurrency
  value: string
  from: string
  to: string
  functionName: string
}

export interface IGasPricesResponse {
  fastWait: number
  avgWait: number
  blockNum: number
  fast: number
  fastest: number
  fastestWait: number
  safeLow: number
  safeLowWait: number
  speed: number
  block_time: number
  average: number
}

export interface IGasPrice {
  time: number
  price: number
}

export interface IGasPrices {
  timestamp: number
  slow: IGasPrice
  average: IGasPrice
  fast: IGasPrice
}

export interface IMethodArgument {
  type: string
}

export interface IMethod {
  signature: string
  name: string
  args: IMethodArgument[]
}

export interface IBoxImage {
  '@type': string
  contentUrl: {
    [label: string]: string
  }
}

export interface IBoxProfile {
  memberSince: string
  coverPhoto: IBoxImage[]
  location: string
  emoji: string
  job: string
  employer: string
  website: string
  description: string
  ethereum_proof: {
    consent_msg: string
    consent_signature: string
    linked_did: string
  }
  proof_did: string
  github: string
  image: IBoxImage[]
  name: string
}

export interface ICoreOptions extends IProviderControllerOptions {
  lightboxOpacity: number
  theme: string | ThemeColors
}

export interface IProviderControllerOptions {
  disableInjectedProvider: boolean
  cacheProvider: boolean
  providerOptions: IProviderOptions
  network: string
}

export interface IAbstractConnectorOptions {
  network: string
  chainId: number
}

export interface IInjectedProvidersMap {
  injectedAvailable: boolean
  [isProviderName: string]: boolean
}

export interface IProviderDisplay {
  name: string
  logo: string
  description?: string
}

export interface IProviderInfo extends IProviderDisplay {
  id: string
  type: string
  check: string
  package?: IProviderPackageOptions
}
export interface FullProviderInfo {
  id: string
  name: string
  logo: string
  description?: string
  connector?(opt?: any): Promise<Web3Provider>
  type: string
  check: string
  package?: IProviderPackageOptions
  connection?: Web3Provider
}

export type RequiredOption = string | string[]

export interface IProviderPackageOptions {
  required?: RequiredOption[]
}

export interface IProviderOptions {
  [id: string]: {
    package: any
    options?: any
    connector?: FullProviderInfo['connector']
    display?: Partial<IProviderDisplay>
  }
}

export interface IProviderDisplayWithConnector extends IProviderDisplay {
  id: string
  connector(): Promise<AbstractConnector>
  package?: IProviderPackageOptions
}

export interface IProviderUserOptions {
  id: string
  name: string
  logo: string
  description: string
  onClick: () => Promise<void>
}

export type SimpleFunction = (input?: any) => void

export interface IEventCallback {
  event: string
  callback: (result: any) => void
}

export type ChainData = {
  chainId: number
  chain: string
  network: string
  networkId: number
}

export type ChainDataList = {
  [chainId: number]: ChainData
}

export type ThemeColors = {
  background: string
  main: string
  secondary: string
  border: string
  hover: string
}

export interface IThemeConfig {
  name: string
  colors: ThemeColors
}

export type ThemesList = {
  [name: string]: IThemeConfig
}

export type Connector = (provider?: any, opts?: any) => Promise<any>

export interface IConnectorsMap {
  [id: string]: Connector
}

export type Web3Provider = HttpProvider | IpcProvider | WebsocketProvider | AbstractProvider

export type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U

export interface Explorer {
  name: string
  url: string
  standard: string
}

export interface Chain {
  chain_id: number
  name: string
  chain: string
  icon: string
  rpc: string[]
  is_tele: boolean
  transfer?: {
    address: string
    abi: ContractInterface
  }
  multicall?: {
    address: string
    abi: ContractInterface
  }
  agent?: {
    address: string
    abi: ContractInterface
  }
  proxy?: {
    address: string
    abi: ContractInterface
  }
  faucets: string[]
  nativeCurrency: TokenInfo
  infoURL: string
  shortName: string
  chainId: number
  networkId: number
  slip44: number
  ens: {
    registry: string
  }
  explorers: Explorer[]
}

export interface ExtChain extends Chain {
  destChains: Chain[]
  walletType: WALLET_TYPE
}

export interface BridgePair {
  destChain: Chain
  srcChain: Chain
  tokens: TokenPair[]
  agent_address?: string
}

export interface TokenPair {
  destToken: TokenInfo
  srcToken: TokenInfo
  name: string
  relayToken?: string
}

export enum NetworkSelectModalMode {
  SRC = 'SRC',
  DEST = 'DEST',
  // CLOSE = 'CLOSE',
}

export enum TRANSFER_STATUS {
  UNCONNECTED = 'UNCONNECTED',
  NO_INPUT = 'NO_INPUT',
  PENDING_ALLOWANCE = 'PENDING_ALLOWANCE',
  READY_TO_APPROVE = 'READY_TO_APPROVE',
  PENDING_APPROVE = 'PENDING_APPROVE',
  READY_TO_TRANSFER = 'READY_TO_TRANSFER',
}

export enum TRANSACTION_STATUS {
  PENDING = 1,
  SUCCEEDED = 2,
  FAILED = 3,
}
export interface TransactionDetail {
  src_chain: string
  dest_chain: string
  src_chain_id: number
  dest_chain_id: number
  sender: string
  send_tx_hash: string
  receiver: string
  receive_tx_hash: string
  amount: string
  token: string
  token_address: string
  status: TRANSACTION_STATUS
}

export interface TransactionDetailWithCreateTime extends TransactionDetail {
  createTime: number
}

export interface Estimation {
  id?: number
  rate: number
  fee: number
  minReceived: number
  slippage: number
}

export enum CURRENCY_INPUT_ERROR {
  INVALID = 'INVALID',
  INSUFFICIENT = 'INSUFFICIENT',
  OK = 'OK',
}

export enum INIT_STATUS {
  starting = 'starting',
  initialized = 'initialized',
  error = 'error',
}

export enum WALLET_TYPE {
  EVM = 'EVM',
  COSMOS = 'COSMOS',
  UNSET = 'UNSET',
}
