import { createModel } from '@rematch/core'
import { DEFAULT_DESTINATION_CHAIN } from 'constants/index'
import { IChainData, TokenInfo } from 'helpers'
import Store2 from 'store2'
// import { ProviderController } from 'controllers'
import type { RootModel } from './index'

if (!Store2.has('connect-status')) {
  Store2.set('connect-status', false)
}
// eslint-disable-next-line @typescript-eslint/ban-types
type IAppState = {
  connectStatus: boolean
  networkModalOpen: boolean
  walletModalOpen: boolean
  historyModalOpen: boolean
  currencySelectModalOpen: boolean
  selectedCurrency: TokenInfo | undefined
  destinationChain: IChainData
}

const initialState: IAppState = {
  connectStatus: Store2.get('connect-status'),
  networkModalOpen: false,
  walletModalOpen: false,
  historyModalOpen: false,
  currencySelectModalOpen: false,
  selectedCurrency: undefined,
  destinationChain: DEFAULT_DESTINATION_CHAIN,
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
    setNetworkModalOpen(state, networkModalOpen: boolean) {
      return {
        ...state,
        networkModalOpen,
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
    setSelectedCurrency(state, selectedCurrency: TokenInfo) {
      return {
        ...state,
        selectedCurrency,
      }
    },
    setDestinationChain(state, destinationChain: IChainData) {
      return {
        ...state,
        destinationChain,
      }
    },
  },
  effects: (dispatch) => ({
    saveConnectStatus(connectStatus: boolean) {
      Store2.set('connect-status', connectStatus)
      dispatch.application.setConnectStatus(connectStatus)
    },
  }),
})
