import { useDispatch } from 'hooks'
import { useSelector } from 'react-redux'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import Store2 from 'store2'

import { gnosisSafe, injected } from 'connectors'
import { RootState } from 'store/store'
import { IS_IN_IFRAME, NetworkContextName } from 'constants/misc'
import { isMobile } from 'helpers/userAgent'

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  const {
    application: { saveConnectStatus },
  } = useDispatch()
  const connectStatus = useSelector((state: RootState) => state.application.connectStatus)

  const tempContext = context.active ? context : contextNetwork

  const originalDeactivate = tempContext.deactivate
  const wrappedDeactivate = () => {
    originalDeactivate()
    saveConnectStatus(false)
  }
  tempContext.deactivate = wrappedDeactivate

  const originalActivate = tempContext.activate
  const wrappedActivate = (connector: AbstractConnector, onError?: ((error: Error) => void) | undefined, throwErrors?: boolean | undefined) => {
    return originalActivate.apply(tempContext, [connector, onError, throwErrors]).then(() => {
      saveConnectStatus(true)
    })
  }
  tempContext.activate = wrappedActivate
  if (!connectStatus) {
    return { ...tempContext, active: false, account: null }
  }
  return tempContext
}

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
  const { active, error, activate, library, connector } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const { ethereum } = window as any
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        // eslint-disable-next-line no-debugger
        debugger
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
