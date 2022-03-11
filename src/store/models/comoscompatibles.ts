import { createModel } from '@rematch/core'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
/* import { Bech32Address } from '@keplr-wallet/cosmos' */

import type { RootModel } from '.'
import { store } from 'store/store'
import { connectKeplr } from 'helpers/keplr'
import { WALLET_TYPE } from 'constants/types'
import type { ChainInfo } from '@keplr-wallet/types'
/* import { ChainStore, QueriesStore, QueriesWithCosmos, AccountStore, AccountWithCosmos } from '@keplr-wallet/stores'
import { ChainInfo } from '@keplr-wallet/types'
import { IndexedDBKVStore } from '@keplr-wallet/common' */
// import { getWCKeplr } from 'helpers/get-wc-keplr'

const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

/* export const EmbedChainInfos = [
  {
    rpc: 'https://rpc-cosmoshub.keplr.app',
    rest: 'https://lcd-cosmoshub.keplr.app',
    chainId: 'cosmoshub-4',
    chainName: 'Cosmos',
    stakeCurrency: {
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
      coinGeckoId: 'cosmos',
    },
    walletUrl: process.env.NODE_ENV === 'production' ? 'https://wallet.keplr.app/#/cosmoshub/stake' : 'http://localhost:8081/#/cosmoshub/stake',
    walletUrlForStaking: process.env.NODE_ENV === 'production' ? 'https://wallet.keplr.app/#/cosmoshub/stake' : 'http://localhost:8081/#/cosmoshub/stake',
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('cosmos'),
    currencies: [
      {
        coinDenom: 'ATOM',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'ATOM',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer'],
  },
  {
    rpc: 'https://rpc-osmosis.keplr.app',
    rest: 'https://lcd-osmosis.keplr.app',
    chainId: 'osmosis-1',
    chainName: 'Osmosis',
    stakeCurrency: {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
    },
    walletUrl: process.env.NODE_ENV === 'production' ? 'https://app.osmosis.zone' : 'https://app.osmosis.zone',
    walletUrlForStaking: process.env.NODE_ENV === 'production' ? 'https://wallet.keplr.app/#/osmosis/stake' : 'http://localhost:8081/#/osmosis/stake',
    bip44: { coinType: 118 },
    bech32Config: Bech32Address.defaultBech32Config('osmo'),
    currencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
      },
      {
        coinDenom: 'ION',
        coinMinimalDenom: 'uion',
        coinDecimals: 6,
        coinGeckoId: 'ion',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
      },
    ],
    gasPriceStep: {
      low: 0,
      average: 0.025,
      high: 0.035,
    },
    features: ['stargate', 'ibc-transfer'],
  },
]
 */
export type IAppState = {
  walletAddress: string
  signingClient: SigningCosmWasmClient | null
  error: any
  /*   chainStore: ChainStore | null
  queriesStore: QueriesStore<QueriesWithCosmos> | null
  accountStore: AccountStore<AccountWithCosmos> | null
  */
  availableChains: ChainInfo[]
}

export const initialState: IAppState = {
  walletAddress: '',
  signingClient: null,
  error: null,
  /*   chainStore: null,
  queriesStore: null,
  accountStore: null,
  */
  availableChains: [],
}

export const comoscompatibles = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setAvailableChains(state, availableChains: ChainInfo[]) {
      return {
        ...state,
        availableChains,
      }
    },
    /*  
    setChainStore(state, chainStore: ChainStore) {
      return { ...state, chainStore }
    },
    setQueriesStore(state, queriesStore: QueriesStore<QueriesWithCosmos>) {
      return { ...state, queriesStore }
    },
    setAccountStore(state, accountStore: AccountStore<AccountWithCosmos>) {
      return { ...state, accountStore }
    }, */
    setWalletAddresss(state, walletAddresss: string) {
      return { ...state, walletAddresss }
    },
    setSigningClient(state, signingClient: SigningCosmWasmClient | null) {
      return { ...state, signingClient }
    },
    setError(state, error: any) {
      return { ...state, error }
    },
  },
  effects: (dispatch) => ({
    initKeplr() {
      const availableChains = [...store.getState().application.availableChains.values()].filter((e) => e.walletType === WALLET_TYPE.COSMOS) as unknown as ChainInfo[]
      // const availableChains = EmbedChainInfos
      dispatch.comoscompatibles.setAvailableChains(availableChains)
      // const chainStore = new ChainStore<ChainInfo>(availableChains)
      // dispatch.comoscompatibles.setChainStore(chainStore)
      // const queriesStore = new QueriesStore(new IndexedDBKVStore('store_queries'), chainStore, getWCKeplr, QueriesWithCosmos)
      // dispatch.comoscompatibles.setQueriesStore(queriesStore)
      // const accountStore = new AccountStore(window, AccountWithCosmos, chainStore, queriesStore, {
      //   defaultOpts: {
      //     prefetching: false,
      //     suggestChain: false,
      //     autoInit: true,
      //     getKeplr: getWCKeplr,
      //   },
      // })
      // dispatch.comoscompatibles.setAccountStore(accountStore)
    },

    async connectWallet() {
      dispatch.application.setWaitWallet(true)
      const currentState = store.getState()
      const srcChainId = currentState.application.srcChainId
      const chainInfo = currentState.comoscompatibles.availableChains.find((e) => e.chainId === srcChainId)
      if (!chainInfo) {
        throw `no valid chain info for target chain id: ${srcChainId}`
      }
      try {
        await connectKeplr(chainInfo)

        // enable website to access kepler
        await (window as any).keplr.enable(srcChainId)

        // get offline signer for signing txs
        const offlineSigner = await (window as any).getOfflineSigner(srcChainId)

        // make client
        const client = await SigningCosmWasmClient.connectWithSigner(chainInfo.rpc, offlineSigner)
        dispatch.comoscompatibles.setSigningClient(client)

        // get user address
        const [{ address }] = await offlineSigner.getAccounts()
        dispatch.comoscompatibles.setWalletAddresss(address)

        dispatch.application.setWaitWallet(false)
      } catch (error) {
        dispatch.comoscompatibles.setError(error)
      }
    },

    disconnect() {
      const signingClient = store.getState().comoscompatibles.signingClient
      if (signingClient) {
        signingClient.disconnect()
      }
      dispatch.comoscompatibles.setWalletAddresss('')
      dispatch.comoscompatibles.setSigningClient(null)
      dispatch.application.setWaitWallet(false)
    },
  }),
})
