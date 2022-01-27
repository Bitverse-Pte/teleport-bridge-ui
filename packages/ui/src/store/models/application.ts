import { transitions } from './../../styles'
import { getBalance } from 'helpers/web3'

import { BigNumber as EtherBigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import { parseEther } from '@ethersproject/units'
import { createModel } from '@rematch/core'
import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'
import {
  AVAILABLE_CHAINS_URL,
  DEFAULT_DESTINATION_CHAIN,
  COUNTERPARTY_CHAINS_URL,
  BRIDGE_TOKENS_URL,
  Chain,
  ExtChain,
  NetworkSelectModalMode,
  TokenInfo,
  TokenPair,
  BridgePair,
  TRANSFER_STATUS,
  StatefulTransaction,
  TRANSACTION_STATUS,
  TRANSACTION_HISTORY_URL,
  Estimation,
  ESTIMATION_URL,
} from 'constants/index'
import { getContract } from 'helpers'
import Store2 from 'store2'
import type { RootModel } from '.'
import ERC20ABI from 'contracts/erc20.json'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { errorNoti, infoNoti, successNoti } from 'helpers/notifaction'
import { ContractTransaction } from '@ethersproject/contracts'
import { FixedSizeQueue } from 'helpers/fixedQueue'
import { setInterval } from 'timers'
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

let estimationClockId: number
// eslint-disable-next-line @typescript-eslint/ban-types
type IAppState = {
  connectStatus: boolean
  walletModalOpen: boolean
  transferConfirmationModalOpen: boolean
  networkModalMode: NetworkSelectModalMode
  historyModalOpen: boolean
  currencySelectModalOpen: boolean
  destinationChains: Map<number, Chain>
  waitWallet: boolean
  availableChains: Map<number, ExtChain>
  srcChainId: number
  destChainId: number
  bridgePairs: Map<string, BridgePair>
  library: Web3Provider | undefined
  account: string | null | undefined
  // wrongChain: boolean
  selectedTokenName: string
  pageActive: boolean
  transferStatus: TRANSFER_STATUS
  currentTokenBalance: EtherBigNumber | undefined
  transactions: FixedSizeQueue<StatefulTransaction>
  estimation: Estimation
}

const initialState: IAppState = {
  connectStatus: Store2.get('connect-status'),
  networkModalMode: NetworkSelectModalMode.CLOSE,
  walletModalOpen: false,
  historyModalOpen: false,
  transferConfirmationModalOpen: false,
  currencySelectModalOpen: false,
  destinationChains: new Map(),
  waitWallet: false,
  srcChainId: 0,
  destChainId: 0,
  availableChains: new Map(),
  bridgePairs: new Map(),
  library: undefined,
  account: undefined,
  // wrongChain: false,
  selectedTokenName: '',
  pageActive: true,
  transferStatus: Store2.get('connect-status') ? TRANSFER_STATUS.NOINPUT : TRANSFER_STATUS.UNCONNECTED,
  currentTokenBalance: undefined,
  transactions: new FixedSizeQueue(10),
  estimation: {} as Estimation,
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
    setBridgesPairs(state, bridgePairs: Map<string, BridgePair>) {
      return {
        ...state,
        bridgePairs,
      }
    },
    setSrcChainId(state, srcChainId: number) {
      if (!state.availableChains.get(srcChainId)?.destChains.find((e) => e.chainId === state.destChainId)) {
        return {
          ...state,
          srcChainId,
          destChainId: state.availableChains.get(srcChainId)?.destChains[0].chainId || state.destChainId,
        }
      }
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
    /*   setWrongChain(state, wrongChain: boolean) {
      return {
        ...state,
        wrongChain,
      }
    }, */
    setSelectedTokenName(state, tokenName: string) {
      return {
        ...state,
        selectedTokenName: tokenName,
      }
    },
    exchangeSrcAndDestChain(state) {
      return {
        ...state,
        destChainId: state.srcChainId,
        srcChainId: state.destChainId,
      }
    },
    setPageActive(state, pageActive: boolean) {
      return {
        ...state,
        pageActive,
      }
    },
    setTransferStatus(state, transferStatus: TRANSFER_STATUS) {
      return {
        ...state,
        transferStatus,
      }
    },
    setCurrentTokenBalance(state, currentTokenBalance: EtherBigNumber | undefined) {
      return {
        ...state,
        currentTokenBalance,
      }
    },
    setTransactions(state, transactions: FixedSizeQueue<StatefulTransaction>) {
      return {
        ...state,
        transactions: transactions.reborn(),
      }
    },
    setEstimation(state, estimation: Estimation) {
      return {
        ...state,
        estimation,
      }
    },
    setTransferConfirmationModalOpen(state, transferConfirmationModalOpen: boolean) {
      return {
        ...state,
        transferConfirmationModalOpen,
      }
    },
  },
  effects: (dispatch) => ({
    saveConnectStatus(connectStatus: boolean) {
      Store2.set('connect-status', connectStatus)
      dispatch.application.setConnectStatus(connectStatus)
    },
    async initTransactions() {
      try {
        const { data: transactions } = await axios.get<StatefulTransaction[]>(TRANSACTION_HISTORY_URL)
        dispatch.application.setTransactions(FixedSizeQueue.fromArray<StatefulTransaction>(transactions))
      } catch (err) {
        errorNoti(`failed to load historic transactions info from ${TRANSACTION_HISTORY_URL},
        the detail is ${(err as any)?.message}`)
      }
    },
    async approveAmount({ amount }: { amount: string }, state) {
      dispatch.application.setWaitWallet(true)
      const { availableChains: sourceChains, library, account, bridgePairs, selectedTokenName, srcChainId, destChainId } = state.application
      const sourceChain = sourceChains.get(srcChainId)
      const destinationChain = sourceChain?.destChains.find((e) => e.chainId === destChainId)
      const bridge = bridgePairs.get(`${sourceChain?.chainId}-${destinationChain?.chainId}`)
      const tokenInfo = bridge?.tokens.find((e) => e.name === selectedTokenName)?.srcToken
      try {
        if (bridge && tokenInfo) {
          const erc20Contract = getContract(tokenInfo.address, ERC20ABI, library!, account!)
          const receipt = await erc20Contract.approve(bridge.srcChain.transfer.contract, parseEther(amount))
          receipt
            .wait()
            .then(() => {
              dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOTRANSFER)
              successNoti(`succeeded to get approval ${amount} of ${selectedTokenName} from chain: ${srcChainId}!`)
            })
            .catch((err: any) => {
              console.error(err)
              errorNoti(`failed to approve this amount: ${amount} for token: ${selectedTokenName} on chain: ${srcChainId},
              the detail is ${err?.message}`)
              dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOAPPROVE)
            })
        }
        infoNoti(`sent request to get approval ${amount} of ${selectedTokenName} from chain: ${srcChainId}!`)
      } catch (err) {
        console.error(err)
        errorNoti(`failed to approve this amount: ${amount} for token: ${selectedTokenName} on chain: ${srcChainId},
        the detail is ${(err as any)?.message}`)
      } finally {
        dispatch.application.setTransferStatus(TRANSFER_STATUS.PENDINGAPPROVE)
        dispatch.application.setWaitWallet(false)
      }
    },
    async transferTokens({ amount }: { amount: string }, state) {
      dispatch.application.setWaitWallet(true)
      const { availableChains: sourceChains, library, account, bridgePairs, selectedTokenName, srcChainId, destChainId } = state.application
      const sourceChain = sourceChains.get(srcChainId)
      const destinationChain = sourceChain?.destChains.find((e) => e.chainId === destChainId)
      const bridge = bridgePairs.get(`${sourceChain?.chainId}-${destinationChain?.chainId}`)
      const tokenInfo = bridge?.tokens.find((e) => e.name === selectedTokenName)?.srcToken
      const cachedTokenName = selectedTokenName
      try {
        if (bridge && tokenInfo) {
          const composedContract = getContract(bridge.srcChain.transfer.contract, bridge.srcChain.transfer.abi, library!, account!)
          let transaction: StatefulTransaction
          if (tokenInfo?.isNative) {
            transaction = await composedContract.sendTransferBase(
              {
                receiver: account,
                destChain: bridge.destChain.name,
                relayChain: '',
              },
              { value: parseEther(amount) }
            )
          } else {
            transaction = await composedContract.sendTransferERC20(
              {
                tokenAddress: tokenInfo.address,
                receiver: account,
                amount: parseEther(amount),
                destChain: bridge.destChain.name,
                relayChain: '',
              },
              { value: parseEther('0') }
            )
          }
          transaction.status = TRANSACTION_STATUS.SENT
          transaction
            .wait()
            .then(() => {
              if (cachedTokenName === state.application.selectedTokenName) {
                dispatch.application.saveCurrentTokenBalance(undefined)
              }
              transaction.status = TRANSACTION_STATUS.SUCCEEDED
              successNoti(`succeeded to transfer ${amount} of ${selectedTokenName} from chain: ${srcChainId} to chain ${destChainId}!`)
            })
            .catch((err: any) => {
              console.error(err)
              transaction.status = TRANSACTION_STATUS.FAILED
              errorNoti(`failed to transfer this amount: ${amount} for token: ${selectedTokenName} from chain: ${srcChainId} to chain ${destChainId},
              the detail is ${err?.message}`)
            })
        }
        const fromInput = document.getElementById('fromValueInput')
        const toInput = document.getElementById('toValueInput')
        if (fromInput) {
          ;(fromInput as HTMLInputElement).value = ''
        }
        if (toInput) {
          ;(toInput as HTMLInputElement).value = ''
        }
        infoNoti(`sent request to transfer ${amount} of ${selectedTokenName} from chain: ${srcChainId} to chain ${destChainId}!`)
      } catch (err) {
        console.error(err)
        errorNoti(`failed to transfer this amount: ${amount} for token: ${selectedTokenName} from chain: ${srcChainId} to chain ${destChainId},
              the detail is ${(err as any)?.message}`)
      } finally {
        dispatch.application.setWaitWallet(false)
      }
    },
    async initChains() {
      const { data: chains } = await axios.get<Chain[]>(AVAILABLE_CHAINS_URL)
      const map = new Map<number, ExtChain>()
      dispatch.application.setSrcChainId(chains[0].chainId)
      try {
        await Promise.all(
          chains.map(async (chain) => {
            fillRpc(chain)
            const { data } = await axios.get<Chain[]>(COUNTERPARTY_CHAINS_URL + '/' + chain.chainId)
            for (const destChain of data) {
              fillRpc(destChain)
            }
            map.set(chain.chainId, chain as ExtChain)
            ;(chain as ExtChain).destChains = data
          })
        )
        dispatch.application.setDestChainId(map.get(chains[0].chainId)!.destChains[0].chainId)
        dispatch.application.setAvailableChains(map)
      } catch (err) {
        errorNoti(`failed to load source info from ${AVAILABLE_CHAINS_URL},
              the detail is ${(err as any)?.message}`)
      }
    },
    async turnOverSrcAndDestChain(rest = {}, state) {
      dispatch.application.setWaitWallet(true)
      const network = await state.application.library?.getNetwork()
      network && (await switchToNetwork({ library: state.application.library, chainId: state.application.destChainId }))
      await dispatch.application.updateBridgeInfo({ destChainId: state.application.srcChainId, srcChainId: state.application.destChainId })
      dispatch.application.exchangeSrcAndDestChain()
      dispatch.application.setWaitWallet(false)
    },
    async changeNetwork({ chainId }, state) {
      dispatch.application.setWaitWallet(true)
      try {
        await switchToNetwork({ library: state.application.library, chainId })
        dispatch.application.setSrcChainId(chainId)
      } catch (err) {
        console.error(err)
      } finally {
        dispatch.application.setWaitWallet(false)
      }
    },
    async updateBridgeInfo({ srcChainId, destChainId }: { srcChainId: number; destChainId: number }, state) {
      const key = `${srcChainId}-${destChainId}`
      if (!state.application.bridgePairs.has(key)) {
        const {
          data: { tokens, srcChain, destChain },
        } = await axios.get<BridgePair>(BRIDGE_TOKENS_URL + `/${srcChainId}/${destChainId}`)
        tokens.forEach((token, index) => {
          if (!isAddress(tokens[index].srcToken.address)) {
            tokens[index].srcToken.isNative = true
          }
        })
        state.application.bridgePairs.set(key, { tokens, srcChain, destChain } as BridgePair)
        dispatch.application.setBridgesPairs(new Map(state.application.bridgePairs))
        dispatch.application.setSelectedTokenName(tokens[0].name)
      }
    },
    async judgeAllowance({ value, tokenInfo }: { value: string; tokenInfo: TokenInfo }, state) {
      const { library, account, bridgePairs, srcChainId, destChainId } = state.application
      if (!tokenInfo.isNative) {
        const erc20Contract = getContract(tokenInfo.address, ERC20ABI, library!, account!)
        try {
          const result: EtherBigNumber = await erc20Contract.allowance(account!, bridgePairs.get(`${srcChainId}-${destChainId}`)?.srcChain.transfer.contract)
          if (result.gte(parseEther(value))) {
            dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOTRANSFER)
          } else {
            dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOAPPROVE)
          }
        } catch (err) {
          console.error(err)
          errorNoti(`failed to get allowance for token: ${tokenInfo.name} on chain: ${srcChainId},
          detail is ${(err as any)?.message}}`)
          dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOAPPROVE)
        }
      } else {
        dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOTRANSFER)
      }
    },
    async saveCurrentTokenBalance(rest = {}, state) {
      const { library, account, bridgePairs, srcChainId, destChainId, selectedTokenName } = state.application
      const pair = bridgePairs.get(`${srcChainId}-${destChainId}`)
      if (pair) {
        const { tokens } = pair
        const selectedTokenPair = tokens.find((e) => e.name === selectedTokenName) || tokens[0]
        if (selectedTokenPair) {
          try {
            const result = await getBalance(selectedTokenPair.srcToken, library!, account!)
            dispatch.application.setCurrentTokenBalance(result)
          } catch (err) {
            console.error(err)
            errorNoti(`failed to get balance for token: ${selectedTokenPair.srcToken.name} on chain: ${srcChainId},
            detail is ${(err as any)?.message}}`)
            dispatch.application.setCurrentTokenBalance(undefined)
          }
        }
      }
    },
    startUpdateEstimation(amount: string, state) {
      const { bridgePairs, srcChainId, destChainId, selectedTokenName } = state.application
      const pair = bridgePairs.get(`${srcChainId}-${destChainId}`)
      if (pair) {
        const { tokens } = pair
        const selectedTokenPair = tokens.find((e) => e.name === selectedTokenName) || tokens[0]
        if (selectedTokenPair) {
          estimationClockId = window.setInterval(() => dispatch.application.updateEstimation({ amount, srcChainId, destChainId, selectedTokenName, selectedTokenPair }), 30 * 1000)
        }
      }
    },
    stopUpdateEstimation() {
      clearInterval(estimationClockId)
      dispatch.application.setEstimation({
        rate: NaN,
        fee: NaN,
        minReceived: NaN,
        slippage: NaN,
      })
    },
    async updateEstimation({
      amount,
      srcChainId,
      destChainId,
      selectedTokenName,
      selectedTokenPair,
    }: {
      amount: string
      srcChainId: number
      destChainId: number
      selectedTokenName: string
      selectedTokenPair: TokenPair
    }) {
      try {
        const { data: estimation } = await axios.get<Estimation>(`${ESTIMATION_URL}/${srcChainId}/${destChainId}/${selectedTokenName}/${parseEther(amount)}`)
        dispatch.application.setEstimation(estimation)
      } catch (err) {
        console.error(err)
        errorNoti(`failed to update estimation for token: ${selectedTokenPair.srcToken.name} from ${srcChainId} to ${destChainId},
            detail is ${(err as any)?.message}}`)
        dispatch.application.stopUpdateEstimation()
      }
    },
  }),
})
