import { useDispatch } from 'hooks'
import { useSelector } from 'react-redux'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { wrap } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import Store2 from 'store2'

import { gnosisSafe, injected } from 'connectors'
import { RootState } from 'store/store'
import { IS_IN_IFRAME, NetworkContextName } from 'constants/misc'
import { isMobile } from 'helpers/userAgent'
import { store } from 'store/store'

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  // const {
  //   application: { saveConnectStatus },
  // } = useDispatch()

  return context.active ? context : contextNetwork
  // tempContext.deactivate = wrap(tempContext.deactivate, function (func) {
  //   func()
  //   saveConnectStatus(false)
  // })
  // /* const originalDeactivate = tempContext.deactivate
  // const wrappedDeactivate = () => {
  //   originalDeactivate()
  //   saveConnectStatus(false)
  // }
  // tempContext.deactivate = wrappedDeactivate */
  // tempContext.activate = wrap(tempContext.activate, function (func, ...args) {
  //   const [connector, onError, throwErrors] = args
  //   return func(connector as AbstractConnector, onError as ((error: Error) => void) | undefined, throwErrors as boolean | undefined).then(() => saveConnectStatus(true))
  // })
  /*   const originalActivate = tempContext.activate
  const wrappedActivate = (connector: AbstractConnector, onError?: ((error: Error) => void) | undefined, throwErrors?: boolean | undefined) => {
    return originalActivate.apply(tempContext, [connector, onError, throwErrors]).then(() => {
      saveConnectStatus(true)
    })
  }
  tempContext.activate = wrappedActivate */
}

/* export function useConnectStatus() {
  const { active } = useWeb3React<Web3Provider>()
  const {
    application: { saveConnectStatus },
  } = useDispatch()
  useEffect(() => {
    active && saveConnectStatus(active)
  }, [active])
}
 */
export function useEagerConnect() {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)

  // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
  // if we are not embedded in an iframe, it is not worth checking
  const [triedSafe, setTriedSafe] = useState(!IS_IN_IFRAME)

  // first, try connecting to a gnosis safe
  useEffect(() => {
    if (!triedSafe) {
      gnosisSafe.isSafeApp().then((loadedInSafe) => {
        if (loadedInSafe) {
          activate(gnosisSafe, undefined, true).catch(() => {
            setTriedSafe(true)
          })
        } else {
          setTriedSafe(true)
        }
      })
    }
  }, [activate, setTriedSafe, triedSafe])

  // then, if that fails, try connecting to an injected connector
  useEffect(() => {
    if (!active && triedSafe) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          if (isMobile && window.ethereum) {
            activate(injected, undefined, true).catch(() => {
              setTried(true)
            })
          } else {
            setTried(true)
          }
        }
      })
    }
  }, [activate, active, triedSafe])

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate, account, library, connector } = useWeb3React()
  const {
    application: { setDestChainId, setSrcChainId, resetWhenAccountChange },
  } = useDispatch()
  const { srcChainId, destChainId, availableChains } = useSelector((state: RootState) => {
    const { srcChainId, destChainId, availableChains } = state.application
    return { srcChainId, destChainId, availableChains }
  })
  const [cachedAccount, setCachedAccount] = useState('')
  const handleConnect = useCallback(() => {
    console.log("Handling 'connect' event")
    activate(injected)
  }, [])
  const handleChainChanged = useCallback(
    (chainId: string | number) => {
      console.log("Handling 'chainChanged' event with payload", chainId)
      /* if (parseInt(`${chainId}`) === destinationChain.chain_id) {
        setDestinationChain(fromChainList[0])
        switchToNetwork({ library, chainId: destinationChain.chain_id })
      } */

      if (chainId != srcChainId) {
        if (store.getState().application.availableChains.has(parseInt(`${chainId}`))) {
          setSrcChainId(parseInt(`${chainId}`))
        }
      }
      activate(injected)
    },
    [srcChainId, availableChains]
  )
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    console.log("Handling 'accountsChanged' event with payload", accounts)
    if (accounts.length > 0) {
      activate(injected)
    }
  }, [])
  const handleNetworkChanged = useCallback((networkId: string | number) => {
    console.log("Handling 'networkChanged' event with payload", networkId)
    activate(injected)
  }, [])

  useEffect(() => {
    if (account && account != cachedAccount) {
      resetWhenAccountChange(undefined)
    }
    account && setCachedAccount(account)
  }, [account, cachedAccount])

  useEffect(() => {
    const { ethereum } = window
    if (ethereum && ethereum.on) {
      ethereum.on('chainChanged', handleChainChanged)

      if (!active && !error && !suppress) {
        ethereum.on('connect', handleConnect)
        ethereum.on('accountsChanged', handleAccountsChanged)
        ethereum.on('networkChanged', handleNetworkChanged)
      }
    }
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('connect', handleConnect)
        ethereum.removeListener('chainChanged', handleChainChanged)
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
        ethereum.removeListener('networkChanged', handleNetworkChanged)
      }
    }
  }, [active, error, suppress, activate])
}
