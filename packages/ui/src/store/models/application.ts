import { parseEther } from '@ethersproject/units'
import { createModel } from '@rematch/core'
import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'
import { AVAILABLE_CHAINS_URL, DEFAULT_DESTINATION_CHAIN, COUNTERPARTY_CHAINS_URL, BRIDGE_TOKENS__URL, Chain, ExtChain, NetworkSelectModalMode, TokenInfo, TokenPairs } from 'constants/index'
import { getContract } from 'helpers'
import Store2 from 'store2'
import type { RootModel } from '.'
// import { ProviderController } from 'controllers'import type { RootModel } from './index'

const API_KEY = process.env.REACT_APP_INFURA_ID

function fillRpc(chain: Chain) {
  for (let index = 0; index < chain.rpc.length; index++) {
    if (chain.rpc[index].includes('infura.io') && chain.rpc[index].includes('%API_KEY%') && API_KEY) {
      const rpcUrl = chain.rpc[index].replace('%API_KEY%', API_KEY)
      chain.rpc[index] = rpcUrl
    }
  }
}

if (!Store2.has('connect-status')) {
  Store2.set('connect-status', false)
}

// eslint-disable-next-line @typescript-eslint/ban-types
type IAppState = {
  connectStatus: boolean
  walletModalOpen: boolean
  networkModalMode: NetworkSelectModalMode
  historyModalOpen: boolean
  currencySelectModalOpen: boolean
  selectedCurrency: TokenInfo | undefined
  destinationChains: Map<number, Chain>
  waitWallet: boolean
  availableChains: Map<number, ExtChain>
  srcChainId: number
  destChainId: number
  tokens: Map<string, TokenPairs[]>
  library: Web3Provider | undefined
  account: string | null | undefined
  wrongChain: boolean
  selectedTokenName: string
}

const initialState: IAppState = {
  connectStatus: Store2.get('connect-status'),
  networkModalMode: NetworkSelectModalMode.CLOSE,
  walletModalOpen: false,
  historyModalOpen: false,
  currencySelectModalOpen: false,
  selectedCurrency: undefined,
  destinationChains: new Map(),
  waitWallet: false,
  srcChainId: 0,
  destChainId: 0,
  availableChains: new Map(),
  tokens: new Map(),
  library: undefined,
  account: undefined,
  wrongChain: false,
  selectedTokenName: '',
}

export const application = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setConnectStatus(state, connectStatus: boolean) {
      return {
        ...state,
        connectStatus,
      }
    },
    setNetworkModalMode(state, networkModalMode: NetworkSelectModalMode) {
      return {
        ...state,
        networkModalMode,
      }
    },
    setWalletModalOpen(state, walletModalOpen: boolean) {
      return {
        ...state,
        walletModalOpen,
      }
    },
    setHistoryModalOpen(state, historyModalOpen: boolean) {
      return {
        ...state,
        historyModalOpen,
      }
    },
    setCurrencySelectModalOpen(state, currencySelectModalOpen: boolean) {
      return {
        ...state,
        currencySelectModalOpen,
      }
    },
    setSelectedCurrency(state, selectedCurrency: TokenInfo | undefined) {
      return {
        ...state,
        selectedCurrency,
      }
    },
    setWaitWallet(state, waitWallet: boolean) {
      return {
        ...state,
        waitWallet,
      }
    },
    setDestinationsChain(state, destinationChain: Map<number, Chain>) {
      return {
        ...state,
        destinationChain,
      }
    },
    setAvailableChains(state, availableChains: Map<number, ExtChain>) {
      return {
        ...state,
        availableChains,
      }
    },
    setLibrary(state, library: Web3Provider | undefined) {
      return { ...state, library }
    },
    setAccount(state, account: string | null | undefined) {
      return { ...state, account }
    },
    setTokens(state, tokens: Map<string, TokenPairs[]>) {
      return {
        ...state,
        tokens,
      }
    },
    setSrcChainId(state, srcChainId: number) {
      return {
        ...state,
        srcChainId,
      }
    },
    setDestChainId(state, destChainId: number) {
      return {
        ...state,
        destChainId,
      }
    },
    setWrongChain(state, wrongChain: boolean) {
      return {
        ...state,
        wrongChain,
      }
    },
    setSelectedTokenName(state, tokenName: string) {
      return {
        ...state,
        selectedTokenName: tokenName,
      }
    },
  },
  effects: (dispatch) => ({
    saveConnectStatus(connectStatus: boolean) {
      Store2.set('connect-status', connectStatus)
      dispatch.application.setConnectStatus(connectStatus)
    },
    async transferTokens({ tokenInfo, amount, srcChainId, destChainId }: { tokenInfo: TokenInfo; amount: string; srcChainId: number; destChainId: number }, state) {
      const { destinationChains, availableChains: sourceChains, library, account } = state.application
      const sourceChain = sourceChains.get(srcChainId)
      const destinationChain = destinationChains.get(destChainId)
      const contract = getContract(sourceChain!.contractAddress, sourceChain?.abi, library!, account!)
      if (tokenInfo.isNative) {
        await contract.sendTransferBase(
          {
            receiver: account,
            destChain: destinationChain?.name,
            relayChain: '',
          },
          { value: parseEther(amount) }
        )
      } else {
        await contract.sendTransferERC20(
          {
            tokenAddress: tokenInfo.address,
            receiver: account,
            amount: parseEther(amount),
            destChain: destinationChain?.name,
            relayChain: '',
          },
          { value: parseEther('0') }
        )
      }
    },
    async initChains() {
      const { data: chains } = await axios.get<Chain[]>(AVAILABLE_CHAINS_URL)
      const map = new Map<number, ExtChain>()
      dispatch.application.setSrcChainId(chains[0].chainId)
      await Promise.all(
        chains.map(async (chain) => {
          fillRpc(chain)
          const { data } = await axios.get<Chain[]>(COUNTERPARTY_CHAINS_URL + '/' + chain.chainId)
          for (const destChain of data) {
            fillRpc(destChain)
          }
          ;(chain as ExtChain).destChains = data
          map.set(chain.chainId, chain as ExtChain)
        })
      )
      dispatch.application.setDestChainId(map.get(chains[0].chainId)!.destChains[0].chainId)
      dispatch.application.setAvailableChains(map)
    },
  }),
})
