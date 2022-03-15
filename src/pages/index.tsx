import React, { useEffect } from 'react'
import { NextApiResponse } from 'next'
import Store2 from 'store2'
import { isAddress } from 'web3-utils'

import requestor from 'helpers/requestor'
import BridgeUI from 'components/BridgeUI'
import ThemeProvider from 'theme'
// import { store } from 'store/store'
import { ZERO_ADDRESS } from 'constants/misc'
import { BridgePair, ExtChain, Chain, AVAILABLE_CHAINS_URL, COUNTERPARTY_CHAINS_URL, BRIDGE_TOKENS_URL, INIT_STATUS, TransactionDetail, NetworkSelectModalMode } from 'constants/index'
import { FixedSizeQueue } from 'helpers/fixedQueue'
import { useDispatch } from 'hooks'
import { RootState } from 'store/store'
import { useSelector } from 'react-redux'

export default function Home({
  toSetBridgePairs,
  toSetSrcChainId,
  toSetAvailableChains,
  toSetDestChainId,
  toSetSelectedTokenName,
  error: propsError,
}: {
  toSetBridgePairs: Array<[string, BridgePair]>
  toSetSrcChainId: number
  toSetAvailableChains: Array<[number, ExtChain]>
  toSetDestChainId: number
  toSetSelectedTokenName: string
  error: string
}) {
  const {
    application: { changeNetwork, setNetworkModalMode, setBridgesPairs, setSelectedTokenName, setSrcChainId, setDestChainId, setAvailableChains, setInitStatus, setTransactions, setConnectStatus },
  } = useDispatch()

  const { connectStatus, availableChains, srcChainId, networkModalMode } = useSelector((state: RootState) => {
    const { connectStatus, availableChains, srcChainId, networkModalMode } = state.application
    return { connectStatus, availableChains, srcChainId, networkModalMode }
  })
  const { active, chainId, account, library, error } = useSelector((state: RootState) => {
    const { active, chainId, account, library, error } = state.evmCompatibles
    return { active, chainId, account, library, error }
  })

  useEffect(() => {
    if (propsError) {
      setInitStatus(INIT_STATUS.error)
      return
    }
    if (toSetAvailableChains && toSetBridgePairs && toSetSelectedTokenName && toSetSrcChainId && toSetDestChainId) {
      setAvailableChains(new Map(toSetAvailableChains))
      setBridgesPairs(new Map(toSetBridgePairs))
      setSelectedTokenName(toSetSelectedTokenName)
      setSrcChainId(toSetSrcChainId)
      setDestChainId(toSetDestChainId)
      setInitStatus(INIT_STATUS.initialized)
      /* 
        setTransactions(state, transactions: FixedSizeQueue<TransactionDetail>) {
        return {
          ...state,
          transactions: transactions.reborn(),
        }
      },
     */
      // setTransactions(new FixedSizeQueue<TransactionDetail>(50))
      setConnectStatus(Store2.get('connect-status'))
    }
  }, [toSetBridgePairs, toSetSrcChainId, toSetAvailableChains, toSetDestChainId, toSetSelectedTokenName, propsError])
  return (
    <>
      {/* <GlobalStyle /> */}
      {/* <Provider store={store}> */}
      <ThemeProvider>
        {/* <StatefulBridgeUI />*/}
        <BridgeUI />
      </ThemeProvider>
      {/* </Provider> */}
    </>
  )
}

const isServer = typeof window === 'undefined'
let dataCache:
  | {
      props?: {
        toSetBridgePairs: Array<[string, BridgePair]>
        toSetSrcChainId: number
        toSetAvailableChains: Array<[number, ExtChain]>
        toSetDestChainId: number
        toSetSelectedTokenName: string
      }
      error?: string
    }
  | undefined = undefined

let fetchRequest: Promise<void> | undefined = undefined
if (isServer) {
  if (dataCache === undefined) {
    fetchRequest = fetchChainsDataOnServer()
  }
  setInterval(() => {
    fetchRequest = fetchChainsDataOnServer()
  }, 60 * 60 * 1000)
}

async function fetchChainsDataOnServer() {
  if (!isServer) {
    return
  }
  if (fetchRequest) {
    return fetchRequest
  }
  try {
    // Fetch data from external API
    const { data: chains } = await requestor.get<Chain[]>(AVAILABLE_CHAINS_URL)
    const map = new Map<number, ExtChain>()
    const bridgePairs = new Map<string, BridgePair>()
    // dispatch.application.setSrcChainId(chains[0].chainId)
    const subTasks: Promise<void>[] = []
    await Promise.all(
      chains.map(async (chain) => {
        return requestor.get<Chain[]>(COUNTERPARTY_CHAINS_URL + '/' + chain.chainId).then(({ data: destChains }) => {
          for (const destChain of destChains) {
            const key = `${chain.chainId}-${destChain.chainId}`
            subTasks.push(
              requestor.get<BridgePair>(BRIDGE_TOKENS_URL + `/${chain.chainId}/${destChain.chainId}`).then(({ data }) => {
                data.tokens.forEach((token) => {
                  if (!isAddress(token.srcToken.address) || ZERO_ADDRESS == token.srcToken.address) {
                    token.srcToken.isNative = true
                  }
                })
                bridgePairs.set(key, data)
              })
            )
          }
          map.set(chain.chainId, chain as ExtChain)
          ;(chain as ExtChain).destChains = destChains
        })
        // .catch((err: any) => {
        //   console.error(err)
        //   return {
        //     props: {
        //       error: `failed to get counter party chains for chainId ${chain.name}`,
        //     },
        //   }
        // })
      })
    )
    await Promise.all(subTasks)
    // dispatch.application.setAvailableChains(map)
    // dispatch.application.setDestChainId(map.get(chains[0].chainId)!.destChains[0].chainId)
    // dispatch.application.setSelectedTokenName(store.getState().application.bridgePairs.get(`${chains[0].chainId}-${map.get(chains[0].chainId)!.destChains[0].chainId}`)!.tokens[0]!.srcToken.name)

    dataCache = {
      props: {
        toSetBridgePairs: [...bridgePairs.entries()],
        toSetSrcChainId: chains[0].chainId,
        toSetAvailableChains: [...map.entries()],
        toSetDestChainId: map.get(chains[0].chainId)!.destChains[0].chainId,
        toSetSelectedTokenName: bridgePairs.get(`${chains[0].chainId}-${map.get(chains[0].chainId)!.destChains[0].chainId}`)!.tokens[0]!.srcToken.name,
      },
    }
  } catch (err) {
    dataCache = {
      error: `failed to load source info from ${AVAILABLE_CHAINS_URL},
        the detail is ${(err as any)?.message}`,
    }
  } finally {
    if (fetchRequest) {
      fetchRequest = undefined
    }
  }
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')
  if (dataCache && dataCache.props) {
    console.log(`use cache stored`)
    return { props: dataCache.props }
  } else {
    fetchRequest = fetchChainsDataOnServer()
    await fetchRequest
    if (dataCache && dataCache.props) {
      return { props: dataCache.props }
    } else if (dataCache && dataCache.error) {
      return { props: { error: dataCache.error } }
    } else {
      return { props: { error: `unexpected exception occurs, please contact developers` } }
    }
  }

  // Pass data to the page via props
}
