import React, { useEffect } from 'react'
import { Provider, connect, useDispatch } from 'react-redux'
import ReactDOM from 'react-dom'
import '@reach/dialog/styles.css'
// import 'inter-ui'

import BridgeUI from 'components/BridgeUI'
import ThemeProvider from 'theme'
// import { globalStyle } from './styles'
// import { store } from 'store/store'
import getLibrary from 'helpers/getLibrary'
import Web3Manager from 'components/Web3Manager'
import { NetworkContextName, ZERO_ADDRESS } from 'constants/misc'
import axios from 'axios'
import { BridgePair, ExtChain, Chain, AVAILABLE_CHAINS_URL, COUNTERPARTY_CHAINS_URL, BRIDGE_TOKENS_URL, INIT_STATUS } from 'constants/index'
import { fillRpc } from 'helpers'
import { isAddress } from 'web3-utils'
// const GlobalStyle = createGlobalStyle`
//   ${globalStyle}
// `

// const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

// function Base() {
//   const {
//     application: { saveLibrary },
//   } = useDispatch()
//   const storeContext = useWeb3Context()
//   // const context = useWeb3React<Web3Provider>()
//   // const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
//   const context = useWeb3React()
//   const contextNetwork = useWeb3React(NetworkContextName)

//   // try to eagerly connect to an injected provider, if it exists and has granted access already
//   const triedEager = useEagerConnect()

//   // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
//   useEffect(() => {
//     if (triedEager && !contextNetwork.active && !contextNetwork.error && !context.active) {
//       contextNetwork.activate(network, (error) => {
//         console.error(error)
//       })
//     } else if (context.active && Object.getOwnPropertyNames(storeContext).length < 1) {
//       saveLibrary(context.active ? context : contextNetwork)
//     }
//   }, [triedEager, contextNetwork.active, contextNetwork.error, context.active, storeContext])

//   // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
//   useInactiveListener(!triedEager)
//   return (
//     <Flex
//       flexDirection="column"
//       css={`
//         & {
//           width: 100%;
//           .App {
//             width: 100%;
//           }
//         }
//       `}
//     >
//       <Header></Header>
//       <Flex>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="*" element={<App />} />
//         </Routes>
//       </Flex>
//     </Flex>
//   )
// }

/* const mapState = ({ application }: RootState) => ({
  application,
})

const mapDispatch = ({ application }: Dispatch) => ({
  application,
})

const StatefulBridgeUI = connect(mapState, mapDispatch)(BridgeUI) */

// ReactDOM.render(
export default function Home({
  toSetBridgePairs,
  toSetSrcChainId,
  toSetAvailableChains,
  toSetDestChainId,
  toSetSelectedTokenName,
  error,
}: {
  toSetBridgePairs: Array<[string, BridgePair]>
  toSetSrcChainId: number
  toSetAvailableChains: Array<[number, ExtChain]>
  toSetDestChainId: number
  toSetSelectedTokenName: string
  error: string
}) {
  const {
    application: { setBridgesPairs, setSelectedTokenName, setSrcChainId, setDestChainId, setAvailableChains, setInitStatus },
  } = useDispatch()
  useEffect(() => {
    if (error) {
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
    }
  }, [toSetBridgePairs, toSetSrcChainId, toSetAvailableChains, toSetDestChainId, toSetSelectedTokenName, error])
  return (
    <>
      {/* <GlobalStyle /> */}
      {/* <Provider store={store}> */}
      <Web3Manager>
        <ThemeProvider>
          {/* <StatefulBridgeUI />*/}
          <BridgeUI />
        </ThemeProvider>
      </Web3Manager>
      {/* </Provider> */}
    </>
  )
}
/* 
export async function getStaticProps() {
  const store = initializeStore(undefined)
  await store.dispatch.application.initChains()

  return {
    props: {
      // usersList,
    },
  }
} */

// document.getElementById('root'),
// )
export async function getServerSideProps() {
  // Fetch data from external API
  const { data: chains } = await axios.get<Chain[]>(AVAILABLE_CHAINS_URL)
  const map = new Map<number, ExtChain>()
  const bridgePairs = new Map<string, BridgePair>()

  // dispatch.application.setSrcChainId(chains[0].chainId)
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
              const key = `${chain.chainId}-${destChain.chainId}`
              subTasks.push(
                axios.get<BridgePair>(BRIDGE_TOKENS_URL + `/${chain.chainId}/${destChain.chainId}`).then(({ data }) => {
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
          .catch((err: any) => {
            console.error(err)
            return {
              props: {
                error: `failed to get couter party chains for chainId ${chain.name}`,
              },
            }
          })
      })
    )
    await Promise.all(subTasks)
    axios.defaults.timeout = 10000
    // dispatch.application.setAvailableChains(map)
    // dispatch.application.setDestChainId(map.get(chains[0].chainId)!.destChains[0].chainId)
    // dispatch.application.setSelectedTokenName(store.getState().application.bridgePairs.get(`${chains[0].chainId}-${map.get(chains[0].chainId)!.destChains[0].chainId}`)!.tokens[0]!.srcToken.name)
  } catch (err) {
    return {
      props: {
        error: `failed to load source info from ${AVAILABLE_CHAINS_URL},
        the detail is ${(err as any)?.message}`,
      },
    }
  }

  // Pass data to the page via props
  return {
    props: {
      toSetBridgePairs: [...bridgePairs.entries()],
      toSetSrcChainId: chains[0].chainId,
      toSetAvailableChains: [...map.entries()],
      toSetDestChainId: map.get(chains[0].chainId)!.destChains[0].chainId,
      toSetSelectedTokenName: bridgePairs.get(`${chains[0].chainId}-${map.get(chains[0].chainId)!.destChains[0].chainId}`)!.tokens[0]!.srcToken.name,
    },
  }
}
