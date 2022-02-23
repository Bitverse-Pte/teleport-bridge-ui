import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import getLibrary from 'helpers/getLibrary'
import { Web3ReactProvider } from '@web3-react/core'

import { useStore } from 'store/store'

import 'theme/rootStyle.css'

const Web3ReactProviderDefault = dynamic(() => import('../components/DefaultProvider'), { ssr: false })

// import { RootState, Dispatch } from 'store/store'
export default function App({ Component, pageProps }: AppProps): ReactElement {
  const store = useStore(pageProps.initialReduxState)
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site created using create-react-app" />
        <link rel="apple-touch-icon" href="/logo64.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Teleport Bridge</title>
      </Head>
      <Provider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderDefault getLibrary={getLibrary}>
            <Component {...pageProps} />
          </Web3ReactProviderDefault>
        </Web3ReactProvider>
      </Provider>
    </>
  )
}
/* 
export async function getServerSideProps() {
  await store.dispatch.application.initChains()
  console.log('abcd')
  return { props: {} }
}
 */