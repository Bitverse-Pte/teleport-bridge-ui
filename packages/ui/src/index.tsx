import React from 'react'
import { Provider, connect } from 'react-redux'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import ReactDOM from 'react-dom'
import '@reach/dialog/styles.css'
// import 'inter-ui'

import App from './App'
import ThemeProvider from 'theme'
// import { globalStyle } from './styles'
import { store } from './store'
import { RootState, Dispatch } from 'store/store'
import getLibrary from 'helpers/getLibrary'
import Web3Manager from 'components/Web3Manager'
import { NetworkContextName } from 'constants/misc'
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

const mapState = ({ application }: RootState) => ({
  application,
})

const mapDispatch = ({ application }: Dispatch) => ({
  application,
})

const WrappedApp = connect(mapState, mapDispatch)(App)
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

ReactDOM.render(
  <>
    {/* <GlobalStyle /> */}
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3Manager>
            <ThemeProvider>
              <WrappedApp />
            </ThemeProvider>
          </Web3Manager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </Provider>
  </>,
  document.getElementById('root')
)
