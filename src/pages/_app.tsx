import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import getLibrary from 'helpers/getLibrary'
import { Web3ReactProvider } from '@web3-react/core'

// import { useStore } from 'store/store'
import withRematch from 'store/withRematch'
// import { store } from 'store/store'

import { EvmManager } from 'components/Web3Manager'
import 'theme/rootStyle.css'
import { Store } from 'store/store'

const Web3ReactProviderDefault = dynamic(() => import('../components/DefaultProvider'), { ssr: false })
interface Props extends AppProps {
  reduxStore: Store
}

// import { RootState, Dispatch } from 'store/store'
function MyApp({ Component, pageProps, reduxStore }: Props): ReactElement {
  // const store = useStore(pageProps.initialReduxState)
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Teleport Cross Chains Bridge" />
        <meta name="keywords" content="block chain teleport bridge" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/ico" />
        <link rel="apple-touch-icon" href="/logo64.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Teleport Bridge</title>
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactProviderDefault getLibrary={getLibrary}>
          <EvmManager />
        </Web3ReactProviderDefault>
      </Web3ReactProvider>
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default withRematch(MyApp)
/* 
export async function getServerSideProps() {
  await store.dispatch.application.initChains()
  console.log('abcd')
  return { props: {} }
}
 */
