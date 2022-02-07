import { transitions } from './../../styles'
import { getBalance } from 'helpers/web3'

import { BigNumber as EtherBigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import { parseEther } from '@ethersproject/units'
import ethers from 'ethers'
import { createModel } from '@rematch/core'
import { Web3Provider } from '@ethersproject/providers'
import { toast } from 'react-toastify'
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
  TransactionDetail,
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
  pageActive: true,
  transferStatus: Store2.get('connect-status') ? TRANSFER_STATUS.NOINPUT : TRANSFER_STATUS.UNCONNECTED,
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
  },
  effects: (dispatch) => ({
    saveConnectStatus(connectStatus: boolean) {
      Store2.set('connect-status', connectStatus)
      dispatch.application.setConnectStatus(connectStatus)
    },
    async initTransactions(account: string) {
      try {
        const {
          data: { data: transactions },
        } = await axios.post<{ data: TransactionDetail[] }>(TRANSACTION_HISTORY_URL, { sender: account })
        dispatch.application.saveTransactions(FixedSizeQueue.fromArray<TransactionDetail>(transactions, 10))
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
          const receipt = await erc20Contract.approve(bridge.srcChain.transfer.address, parseEther(amount))
          receipt
            .wait()
            .then(() => {
              dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOTRANSFER)
              successNoti(`succeeded to get approval ${amount} of ${selectedTokenName} from chain: ${bridge.srcChain.name}!`)
            })
            .catch((err: any) => {
              console.error(err)
              errorNoti(`failed to approve this amount: ${amount} for token: ${selectedTokenName} on chain: ${bridge.srcChain.name},
              the detail is ${err?.message}`)
              dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOAPPROVE)
            })
        }
        infoNoti(`sent request to get approval ${amount} of ${selectedTokenName} from chain: ${bridge!.srcChain.name}!`)
      } catch (err) {
        console.error(err)
        errorNoti(`failed to approve this amount: ${amount} for token: ${selectedTokenName} on chain: ${bridge!.srcChain.name},
        the detail is ${(err as any)?.message}`)
      } finally {
        dispatch.application.setTransferStatus(TRANSFER_STATUS.PENDINGAPPROVE)
        dispatch.application.setWaitWallet(false)
      }
    },
    async transferTokens({ amount }: { amount: string }, state) {
      dispatch.application.setWaitWallet(true)
      const { availableChains: sourceChains, library, account, bridgePairs, selectedTokenName, srcChainId, destChainId, transactions } = state.application
      const sourceChain = sourceChains.get(srcChainId)
      const destinationChain = sourceChains.get(destChainId)
      const bridge = bridgePairs.get(`${sourceChain?.chainId}-${destinationChain?.chainId}`)
      const tokenInfo = bridge?.tokens.find((e) => e.name === selectedTokenName)?.srcToken
      const cachedTokenName = selectedTokenName
      let toastId: number
      let transaction: { hash: string | number | undefined; wait: () => Promise<any> }
      try {
        if (bridge && tokenInfo) {
          // if (bridge.srcChain.isTele || bridge.destChain.isTele) {
          const composedContract = getContract(bridge.srcChain.transfer.address, bridge.srcChain.transfer.abi, library!, account!)
          if (tokenInfo?.isNative) {
            transaction = await composedContract.sendTransferBase(
              {
                receiver: account,
                // destChain: 'tss-eth',
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
          // } else {
          /*  const multiCallFactory = await ethers.getContractFactory('MultiCall')
            const multiCall = await multiCallFactory.attach('0xb628aa11d7ba62af1386be90cde6c0eb9d731625')

            // eth.0xe127bd251ab5a499e57034644ef41726c931b45b => teleport.0xd9a41dbe13386c6674d871021106266ea7b27f5c
            const ERC20TransferData = {
              tokenAddress: '0xe127bd251ab5a499e57034644ef41726c931b45b',
              receiver: '0x0000000000000000000000000000000010000007',
              amount: 100000000000000,
            }
            const ERC20TransferDataAbi = ethers.utils.defaultAbiCoder.encode(['tuple(address,string,uint256)'], [[ERC20TransferData.tokenAddress, ERC20TransferData.receiver, ERC20TransferData.amount]])

            // teleport.0xd9a41dbe13386c6674d871021106266ea7b27f5c => bsc.0xe9a6bd7ca0fcbe36c2d003872284bbcd47fda8b0
            const dataByte = Buffer.from(
              'efb509250000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d9a41dbe13386c6674d871021106266ea7b27f5c00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000005af3107a400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002a307865396136626437636130666362653336633264303033383732323834626263643437666461386230000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008746573742d6273630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
              'hex'
            )
            const RCCData = {
              contractAddress: '0x0000000000000000000000000000000010000007',
              data: dataByte,
            }
            const RCCDataAbi = utils.defaultAbiCoder.encode(['tuple(string,bytes)'], [[RCCData.contractAddress, RCCData.data]])

            const MultiCallData = {
              destChain: 'teleport',
              relayChain: '',
              functions: [BigNumber.from(0), BigNumber.from(2)],
              data: [ERC20TransferDataAbi, RCCDataAbi],
            }
            const res = await multiCall.multiCall(MultiCallData) */
          // }

          const transactionDetail = {
            src_chain: `${sourceChain?.name}`,
            dest_chain: `${destinationChain?.name}`,
            src_chain_id: sourceChain?.chainId,
            dest_chain_id: destinationChain?.chainId,
            sender: account,
            send_tx_hash: transaction!.hash,
            receiver: account,
            receive_tx_hash: '',
            amount: parseEther(amount).toHexString(),
            token: selectedTokenName,
            token_address: tokenInfo?.isNative ? '' : tokenInfo.address,
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
          infoNoti(`sent request to transfer ${amount} of ${selectedTokenName} from chain: ${bridge.srcChain.name} to chain ${bridge.destChain.name}!`, transaction!.hash) as number
          const fromInput = document.getElementById('fromValueInput')
          const toInput = document.getElementById('toValueInput')
          if (fromInput) {
            ;(fromInput as HTMLInputElement).value = ''
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
        await Promise.all(
          chains.map(async (chain) => {
            fillRpc(chain)
            return axios
              .get<Chain[]>(COUNTERPARTY_CHAINS_URL + '/' + chain.chainId)
              .then(({ data: destChains }) => {
                for (const destChain of destChains) {
                  fillRpc(destChain)
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
          const result: EtherBigNumber = await erc20Contract.allowance(account!, bridgePairs.get(`${srcChainId}-${destChainId}`)?.srcChain.transfer.address)
          if (result.gte(parseEther(value))) {
            dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOTRANSFER)
          } else {
            dispatch.application.setTransferStatus(TRANSFER_STATUS.READYTOAPPROVE)
          }
        } catch (err) {
          console.error(err)
          errorNoti(`failed to get allowance for token: ${tokenInfo.name} on chain: ${bridgePairs.get(`${srcChainId}-${destChainId}`)?.srcChain.name},
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
            dispatch.application.setCurrentTokenBalance(undefined)
            errorNoti(
              `failed to get balance for token: ${selectedTokenPair.srcToken.name} on chain: ${pair.srcChain.name},
              detail is ${(err as any)?.message}},
              will retry.`,
              'get-current-token-failed'
            )
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
        const selectedTokenPair = tokens.find((e) => e.name === selectedTokenName) || tokens[0]
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
          setTimeout(() => res(undefined), 2000)
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
    /*   findTxInHistory({ sender, send_tx_hash, getter }: { sender: string; send_tx_hash: string; getter: { emit: (...args: any) => void } }, state) {
      getter.emit(state.application.transactions.find((e) => e.sender === sender && e.send_tx_hash === send_tx_hash))
    }, */
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
  }),
})

const transactionsHistoryUpdateList: Array<{ transactionHash: string; timerId: number }> = []
