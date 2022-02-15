import { BigNumber as EtherBigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import { parseEther } from '@ethersproject/units'
import { AbiItem } from 'web3-utils'
import { createModel } from '@rematch/core'
import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'

import { ZERO_ADDRESS } from 'constants/misc'

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
  TransactionDetail,
  TRANSACTION_STATUS,
  TRANSACTION_HISTORY_URL,
  Estimation,
  ESTIMATION_URL,
} from 'constants/index'
import { getBalance } from 'helpers/web3'
import { getContract } from 'helpers'
import Store2 from 'store2'
import type { RootModel } from '.'
import ERC20ABI from 'contracts/erc20.json'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { errorNoti, infoNoti, successNoti, warnNoti } from 'helpers/notifaction'
import { ContractTransaction } from '@ethersproject/contracts'
import { FixedSizeQueue } from 'helpers/fixedQueue'
import { setInterval } from 'timers'
import { ReactText } from 'react'
import { store } from 'store/store'
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

const sendFunctionFragment: AbiItem = {
  name: 'send',
  type: 'function',
  inputs: [
    {
      components: [
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'receiver',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'string',
          name: 'destChain',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'relayChain',
          type: 'string',
        },
      ],
      internalType: 'struct TransferDataTypes.ERC20TransferData',
      name: 'transferData',
      type: 'tuple',
    },
  ],
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
  transferStatus: TRANSFER_STATUS
  currentTokenBalance: EtherBigNumber | undefined
  transactions: FixedSizeQueue<TransactionDetail>
  estimation: Estimation
  estimationUpdating: boolean
  selectedTransactionId: string
  transactionDetailModalOpen: boolean
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
  transferStatus: Store2.get('connect-status') ? TRANSFER_STATUS.NO_INPUT : TRANSFER_STATUS.UNCONNECTED,
  currentTokenBalance: undefined,
  transactions: new FixedSizeQueue(10),
  estimation: {} as Estimation,
  estimationUpdating: false,
  selectedTransactionId: '',
  transactionDetailModalOpen: false,
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
    setTransactions(state, transactions: FixedSizeQueue<TransactionDetail>) {
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
    setEstimationUpdating(state, estimationUpdating: boolean) {
      return {
        ...state,
        estimationUpdating,
      }
    },
    setSelectedTransactionId(state, selectedTransactionId: string) {
      return {
        ...state,
        selectedTransactionId,
      }
    },
    setTransactionDetailModalOpen(state, transactionDetailModalOpen: boolean) {
      return {
        ...state,
        transactionDetailModalOpen,
      }
    },
    openTransactionDetailModal(state, selectedTransactionId: string) {
      return {
        ...state,
        selectedTransactionId,
        transactionDetailModalOpen: true,
      }
    },
    closeTransactionDetailModal(state) {
      return {
        ...state,
        selectedTransactionId: '',
        transactionDetailModalOpen: false,
      }
    },
  },
  effects: (dispatch) => ({
    changeTransferStatus(transferStatus: TRANSFER_STATUS) {
      switch (transferStatus) {
        case TRANSFER_STATUS.UNCONNECTED:
        case TRANSFER_STATUS.NO_INPUT:
          dispatch.application.setTransferStatus(transferStatus)
          break
        case TRANSFER_STATUS.PENDING_ALLOWANCE:
        case TRANSFER_STATUS.PENDING_APPROVE:
        case TRANSFER_STATUS.READY_TO_APPROVE:
        case TRANSFER_STATUS.READY_TO_TRANSFER:
          // eslint-disable-next-line no-case-declarations
          const fromInput = document.getElementById('fromValueInput')
          if (!(fromInput as HTMLInputElement).value) {
            dispatch.application.setTransferStatus(TRANSFER_STATUS.NO_INPUT)
            break
          }
          dispatch.application.setTransferStatus(transferStatus)
          break
      }
    },
    saveDestChainId(chainId: number) {
      dispatch.application.setDestChainId(chainId)
      dispatch.application.setNetworkModalMode(NetworkSelectModalMode.CLOSE)
    },
    changeToken(selectedTokenName: string) {
      dispatch.application.setSelectedTokenName(selectedTokenName)
      dispatch.application.setCurrencySelectModalOpen(false)
    },
    loggedIn() {
      Store2.set('connect-status', true)
      dispatch.application.setConnectStatus(true)
    },
    manuallyLogout() {
      Store2.set('connect-status', false)
      dispatch.application.setConnectStatus(false)
      dispatch.application.changeTransferStatus(TRANSFER_STATUS.UNCONNECTED)
    },
    async initTransactions(account: string) {
      try {
        const {
          data: { data: transactions },
        } = await axios.post<{ data: TransactionDetail[] }>(TRANSACTION_HISTORY_URL, { sender: account })
        dispatch.application.saveTransactions(FixedSizeQueue.fromArray<TransactionDetail>(transactions.reverse(), 10))
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
      const tokenInfo = bridge?.tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName)!.srcToken
      try {
        if (bridge && tokenInfo) {
          const targetAddress = bridge.srcChain.is_tele || bridge.destChain.is_tele ? bridge.srcChain.transfer!.address : bridge.srcChain.proxy!.address
          const erc20Contract = getContract(tokenInfo.address, ERC20ABI, library!, account!)
          const receipt = await erc20Contract.approve(targetAddress, parseEther(amount))
          receipt
            .wait()
            .then(() => {
              dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_TRANSFER)
              successNoti(`succeeded to get approval ${amount} of ${selectedTokenName} from chain: ${bridge.srcChain.name}!`)
            })
            .catch((err: any) => {
              console.error(err)
              errorNoti(`failed to approve this amount: ${amount} for token: ${selectedTokenName} on chain: ${bridge.srcChain.name},
              the detail is ${err?.message}`)
              dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_APPROVE)
            })
        }
        infoNoti(`sent request to get approval ${amount} of ${selectedTokenName} from chain: ${bridge!.srcChain.name}!`)
        dispatch.application.changeTransferStatus(TRANSFER_STATUS.PENDING_APPROVE)
      } catch (err) {
        console.error(err)
        errorNoti(`failed to approve this amount: ${amount} for token: ${selectedTokenName} on chain: ${bridge!.srcChain.name},
        the detail is ${(err as any)?.message}`)
        dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_APPROVE)
      } finally {
        dispatch.application.setWaitWallet(false)
      }
    },
    async transferTokens({ amount }: { amount: string }, state) {
      dispatch.application.setWaitWallet(true)
      const { availableChains: sourceChains, library, account, bridgePairs, selectedTokenName, srcChainId, destChainId, transactions } = state.application
      const sourceChain = sourceChains.get(srcChainId)
      const destinationChain = sourceChains.get(destChainId)
      const bridge = bridgePairs.get(`${sourceChain?.chainId}-${destinationChain?.chainId}`)
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const selectedTokenPair = bridge?.tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName)!
      const { srcToken, destToken } = selectedTokenPair
      const cachedTokenName = selectedTokenName
      let transaction: { hash: string | number | undefined; wait: () => Promise<any> }
      try {
        if (bridge && srcToken) {
          const parsedAmount = parseEther(amount)
          if (bridge.srcChain.is_tele || bridge.destChain.is_tele) {
            //mono jump
            const composedContract = getContract(bridge.srcChain.transfer!.address, bridge.srcChain.transfer!.abi, library!, account!)
            if (srcToken?.isNative) {
              transaction = await composedContract.sendTransferBase(
                {
                  receiver: account,
                  // destChain: 'tss-eth',
                  destChain: bridge.destChain.name,
                  relayChain: '',
                },
                { value: parsedAmount }
              )
            } else {
              transaction = await composedContract.sendTransferERC20(
                {
                  tokenAddress: srcToken.address,
                  receiver: account,
                  amount: parsedAmount,
                  destChain: bridge.destChain.name,
                  relayChain: '',
                },
                { value: parseEther('0') }
              )
            }
          } else {
            // dual jump
            // if (srcToken.address !== ZERO_ADDRESS || !srcToken.isNative) {
            //non-native token
            const ERC20TransferData = {
              tokenAddress: srcToken.address === ZERO_ADDRESS || srcToken.isNative ? ZERO_ADDRESS : srcToken.address,
              receiver: bridge.agent_address, // agent address
              amount: parsedAmount,
            }
            const rccTransfer = {
              tokenAddress: selectedTokenPair.relayToken, // erc20 in teleport
              receiver: account!,
              amount: parsedAmount,
              destChain: bridge.destChain.name, // double jump destChain
              relayChain: '',
            }
            const proxyContract = getContract(bridge.srcChain.proxy!.address!, bridge.srcChain.proxy!.abi!, library!, account!)
            transaction = await proxyContract.send('teleport', ERC20TransferData, ERC20TransferData.receiver, rccTransfer, { value: parsedAmount.toNumber() /* parsedAmount */ }) // destChainName : teleport
            // } else {
            //   // native token
            // }
          }

          const transactionDetail = {
            src_chain: `${sourceChain?.name}`,
            dest_chain: `${destinationChain?.name}`,
            src_chain_id: sourceChain?.chainId,
            dest_chain_id: destinationChain?.chainId,
            sender: account,
            send_tx_hash: transaction!.hash,
            receiver: account,
            receive_tx_hash: '',
            amount: parsedAmount.toHexString(),
            token: selectedTokenName,
            token_address: srcToken?.isNative ? ZERO_ADDRESS : srcToken.address,
            status: TRANSACTION_STATUS.PENDING,
          } as TransactionDetail
          transactions.push(transactionDetail)
          dispatch.application.setTransactions(transactions)
          transaction!
            .wait()
            .then(() => {
              if (cachedTokenName === state.application.selectedTokenName) {
                dispatch.application.saveCurrentTokenBalance(undefined)
              }
              // transactionDetail.status = TRANSACTION_STATUS.SUCCEEDED
              // successNoti(`succeeded to transfer ${amount} of ${selectedTokenName} from chain: ${srcChainId} to chain ${destChainId}!`, toastId)
            })
            .catch((err: any) => {
              console.error(err)
              transactionDetail.status = TRANSACTION_STATUS.FAILED
              errorNoti(
                `failed to transfer this amount: ${amount} for token: ${selectedTokenName} from chain: ${bridge.srcChain.name} to chain ${bridge.destChain.name},
              the detail is ${err?.message}`,
                transaction.hash
              )
            })
            .finally(() => {
              dispatch.application.setTransactions(transactions)
            })
          setTimeout(() => {
            dispatch.application.openTransactionDetailModal(transactionDetail.send_tx_hash)
            dispatch.application.setTransactionDetailModalOpen(true)
          }, 0)
          infoNoti(`sent request to transfer ${amount} of ${selectedTokenName} from chain: ${bridge.srcChain.name} to chain ${bridge.destChain.name}!`, transaction!.hash) as number
          const fromInput = document.getElementById('fromValueInput')
          const toInput = document.getElementById('toValueInput')
          if (fromInput) {
            ;(fromInput as HTMLInputElement).value = ''
            fromInput.dispatchEvent(new Event('keyup'))
          }
          if (toInput) {
            ;(toInput as HTMLInputElement).value = ''
          }
        }
      } catch (err) {
        console.error(err)
        errorNoti(
          `failed to transfer this amount: ${amount} for token: ${selectedTokenName} from chain: ${srcChainId} to chain ${destChainId},
              the detail is ${(err as any)?.message}`,
          transaction! ? transaction.hash : ''
        )
      } finally {
        dispatch.application.setWaitWallet(false)
        dispatch.application.setTransferConfirmationModalOpen(false)
        dispatch.application.stopUpdateEstimation()
      }
    },
    async initChains() {
      const { data: chains } = await axios.get<Chain[]>(AVAILABLE_CHAINS_URL)
      const map = new Map<number, ExtChain>()
      dispatch.application.setSrcChainId(chains[0].chainId)
      try {
        const subTasks: Promise<void>[] = []
        await Promise.all(
          chains.map(async (chain) => {
            fillRpc(chain)
            return axios
              .get<Chain[]>(COUNTERPARTY_CHAINS_URL + '/' + chain.chainId)
              .then(({ data: destChains }) => {
                for (const destChain of destChains) {
                  fillRpc(destChain)
                  subTasks.push(dispatch.application.updateBridgeInfo({ srcChainId: chain.chainId, destChainId: destChain.chainId, extendedUpdate: false }))
                }
                map.set(chain.chainId, chain as ExtChain)
                ;(chain as ExtChain).destChains = destChains
              })
              .catch((err: any) => {
                console.error(err)
                errorNoti(`failed to get couter party chains for chainId ${chain.name}`)
              })
          })
        )
        await Promise.all(subTasks)
        axios.defaults.timeout = 10000
        dispatch.application.setAvailableChains(map)
        dispatch.application.setDestChainId(map.get(chains[0].chainId)!.destChains[0].chainId)
        dispatch.application.setSelectedTokenName(store.getState().application.bridgePairs.get(`${chains[0].chainId}-${map.get(chains[0].chainId)!.destChains[0].chainId}`)!.tokens[0]!.srcToken.name)
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
        dispatch.application.setNetworkModalMode(NetworkSelectModalMode.CLOSE)
      }
    },
    async updateBridgeInfo({ srcChainId, destChainId, extendedUpdate = true }: { srcChainId: number; destChainId: number; extendedUpdate?: boolean }) {
      const state = store.getState()
      const key = `${srcChainId}-${destChainId}`
      if (!state.application.bridgePairs.has(key)) {
        const {
          data: { tokens, srcChain, destChain, agent_address },
        } = await axios.get<BridgePair>(BRIDGE_TOKENS_URL + `/${srcChainId}/${destChainId}`)
        tokens.forEach((token, index) => {
          if (!isAddress(tokens[index].srcToken.address) || ZERO_ADDRESS == tokens[index].srcToken.address) {
            tokens[index].srcToken.isNative = true
          }
        })
        state.application.bridgePairs.set(key, { tokens, srcChain, destChain, agent_address } as BridgePair)
        if (extendedUpdate) {
          dispatch.application.setBridgesPairs(new Map(state.application.bridgePairs))
          dispatch.application.setSelectedTokenName(tokens[0].name)
        }
      }
    },
    async judgeAllowance({ value, tokenInfo }: { value: string; tokenInfo: TokenInfo }, state) {
      const { library, account, bridgePairs, srcChainId, destChainId } = store.getState().application
      const bridge = bridgePairs.get(`${srcChainId}-${destChainId}`)

      if (!tokenInfo.isNative && bridge) {
        const targetAddress = bridge.srcChain.is_tele || bridge.destChain.is_tele ? bridge.srcChain.transfer!.address : bridge.srcChain.proxy!.address
        const erc20Contract = getContract(tokenInfo.address, ERC20ABI, library!, account!)
        try {
          let timeoutResolver: (value: any) => void = () => {
            return void 0
          }
          new Promise((resolve, reject) => {
            timeoutResolver = resolve
            setTimeout(() => {
              reject()
            }, 15 * 1000)
          }).catch((err) => {
            warnNoti(`to long time cost by fetching allowance for token: ${tokenInfo.name} on chain: ${bridgePairs.get(`${srcChainId}-${destChainId}`)?.srcChain.name},
            you'd better reset your amount or refresh the page`)
          })
          const result: EtherBigNumber = await erc20Contract.allowance(account!, targetAddress)
          timeoutResolver && timeoutResolver(undefined)
          if (result.gte(parseEther(value))) {
            dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_TRANSFER)
          } else {
            dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_APPROVE)
          }
        } catch (err) {
          console.error(err)
          warnNoti(`failed to get allowance for token: ${tokenInfo.name} on chain: ${bridgePairs.get(`${srcChainId}-${destChainId}`)?.srcChain.name},
          detail is ${(err as any)?.message}}`)
          dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_APPROVE)
        }
      } else {
        dispatch.application.changeTransferStatus(TRANSFER_STATUS.READY_TO_TRANSFER)
      }
    },
    async saveCurrentTokenBalance(rest = {}, state) {
      const { library, account, bridgePairs, srcChainId, destChainId, selectedTokenName } = state.application
      const pair = bridgePairs.get(`${srcChainId}-${destChainId}`)
      if (pair) {
        const { tokens } = pair
        const selectedTokenPair = tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName) || tokens[0]
        if (selectedTokenPair) {
          try {
            const result = await getBalance(selectedTokenPair.srcToken, library!, account!)
            dispatch.application.setCurrentTokenBalance(result)
          } catch (err) {
            console.error(err)
            dispatch.application.setCurrentTokenBalance(undefined)
            // warnNoti(`failed to get balance for token: ${selectedTokenPair.srcToken.name} on chain: ${pair.srcChain.name}, will retry.`, 'get-current-token-failed')
            await new Promise((res) => {
              setTimeout(() => {
                res(undefined)
              }, 2000)
            })
            dispatch.application.saveCurrentTokenBalance(undefined)
          }
        }
      }
    },
    startUpdateEstimation(amount: string, state) {
      const { bridgePairs, srcChainId, destChainId, selectedTokenName } = state.application
      const pair = bridgePairs.get(`${srcChainId}-${destChainId}`)
      if (pair) {
        const { tokens } = pair
        const selectedTokenPair = tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName) || tokens[0]
        if (selectedTokenPair) {
          dispatch.application.updateEstimation({ amount, srcChainName: pair.srcChain.name, destChainName: pair.destChain.name, selectedTokenName, selectedTokenPair })
          estimationClockId = window.setInterval(() => dispatch.application.updateEstimation({ amount, srcChainName: pair.srcChain.name, destChainName: pair.destChain.name, selectedTokenName, selectedTokenPair }), 30 * 1000)
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
    async updateEstimation({ amount, srcChainName, destChainName, selectedTokenName, selectedTokenPair }: { amount: string; srcChainName: string; destChainName: string; selectedTokenName: string; selectedTokenPair: TokenPair }) {
      dispatch.application.setEstimationUpdating(true)
      try {
        // const { data: estimation } = await axios.get<Estimation>(`${ESTIMATION_URL}/${srcChainId}/${destChainId}/${selectedTokenName}/${parseEther(amount)}`)
        await new Promise((res) => {
          setTimeout(() => res(undefined), 1000)
        })
        dispatch.application.setEstimation({
          id: Date.now(),
          rate: 1,
          fee: 0,
          minReceived: NaN,
          slippage: 0,
        })
      } catch (err) {
        console.error(err)
        errorNoti(`failed to update estimation for token: ${selectedTokenPair.srcToken.name} from ${srcChainName} to ${destChainName},
            detail is ${(err as any)?.message}}`)
        dispatch.application.stopUpdateEstimation()
      } finally {
        dispatch.application.setEstimationUpdating(false)
      }
    },
    async saveTransactions(transactions: FixedSizeQueue<TransactionDetail>, state) {
      for (const tx of transactions) {
        if (tx.status === TRANSACTION_STATUS.PENDING && !transactionsHistoryUpdateList.some((item) => item.transactionHash === tx.send_tx_hash)) {
          const record = {
            transactionHash: tx.send_tx_hash,
            timerId: window.setInterval(async () => {
              const {
                data: { data: newTxes },
              } = await axios.post<{ data: TransactionDetail[] }>(TRANSACTION_HISTORY_URL, { sender: tx.sender, send_tx_hash: tx.send_tx_hash })
              const toUseNewTx = newTxes.find((e) => e.sender === tx.sender && e.send_tx_hash === tx.send_tx_hash)
              const toUpdatedOne = store.getState().application.transactions.find((e) => e.sender === tx.sender && e.send_tx_hash === tx.send_tx_hash)
              if (toUpdatedOne) {
                Object.assign(toUpdatedOne, toUseNewTx)
                dispatch.application.setTransactions(store.getState().application.transactions)
                if (toUpdatedOne.status !== TRANSACTION_STATUS.PENDING) {
                  clearInterval(record.timerId)
                  const index = transactionsHistoryUpdateList.findIndex((e) => e.transactionHash === record.transactionHash && e.timerId === record.timerId)
                  transactionsHistoryUpdateList.splice(index, 1)
                }
                if (toUpdatedOne.status === TRANSACTION_STATUS.SUCCEEDED) {
                  successNoti(`succeeded to transfer ${toUpdatedOne.amount} of ${toUpdatedOne.token} from chain: ${toUpdatedOne.src_chain} to chain ${toUpdatedOne.dest_chain}!`, toUpdatedOne.send_tx_hash)
                }
                if (toUpdatedOne.status === TRANSACTION_STATUS.FAILED) {
                  errorNoti(`failed to transfer this amount: ${toUpdatedOne.amount} for token: ${toUpdatedOne.token} from chain: ${toUpdatedOne.src_chain} to chain ${toUpdatedOne.dest_chain}`, toUpdatedOne.send_tx_hash)
                }
              }
            }, 10 * 1000),
          }
          transactionsHistoryUpdateList.push(record)
        }
      }
      dispatch.application.setTransactions(transactions)
    },
    resetWhenAccountChange(rest = {}, state) {
      dispatch.application.setCurrentTokenBalance(undefined)
      dispatch.application.saveCurrentTokenBalance(undefined)
      const fromInput = document.getElementById('fromValueInput')
      const toInput = document.getElementById('toValueInput')
      if (fromInput) {
        ;(fromInput as HTMLInputElement).value = ''
      }
      if (toInput) {
        ;(toInput as HTMLInputElement).value = ''
      }
    },
    resetApp(rest = {}, state) {
      const { setWalletModalOpen, setTransferConfirmationModalOpen, setNetworkModalMode, setHistoryModalOpen, setCurrencySelectModalOpen, setTransactionDetailModalOpen } = dispatch.application
      setWalletModalOpen(false)
      setTransferConfirmationModalOpen(false)
      setNetworkModalMode(NetworkSelectModalMode.CLOSE)
      setHistoryModalOpen(false)
      setCurrencySelectModalOpen(false)
      setTransactionDetailModalOpen(false)
    },
  }),
})

const transactionsHistoryUpdateList: Array<{ transactionHash: string; timerId: number }> = []
