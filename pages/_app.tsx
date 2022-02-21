import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { AppProps } from 'next/app'

import { store } from 'store/store'
import { RootState, Dispatch } from 'store/store'

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
