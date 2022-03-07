import React from 'react'
import { initializeStore } from './store'
import type { Store } from './store'
import { RootModel } from './models'
import { initialState } from './models/application'
import { AppContext } from 'next/app'

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'
const checkServer = () => {
  return typeof window === 'undefined'
}

function getOrCreateStore(initState?: RootModel): Store {
  if (checkServer()) {
    return initializeStore(initState)
  }

  // Create store if unavailable on the client and set it on the window object
  // @ts-ignore
  if (!window[__NEXT_REDUX_STORE__]) {
    // @ts-ignore
    window[__NEXT_REDUX_STORE__] = initializeStore(initState)
  }
  // @ts-ignore
  return window[__NEXT_REDUX_STORE__]
}

type Props = {
  reduxStore: Store
}

declare module 'next' {
  export interface NextPageContext {
    reduxStore: {}
  }
}

const withRematch = (A: (props: any) => JSX.Element) => {
  return class AppWithRematch extends React.Component<Props> {
    reduxStore: any
    static async getInitialProps(appContext: AppContext) {
      const reduxStore = getOrCreateStore()
      appContext.ctx.reduxStore = reduxStore

      let appProps = {}
      if ((A as any).getInitialProps) {
        appProps = await (A as any).getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      }
    }

    constructor(props: any) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      return <A {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
export default withRematch
