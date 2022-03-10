import { useDispatch } from 'hooks'
import { useSelector } from 'react-redux'
import type { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'

import { injected } from 'connectors'
import { RootState } from 'store/store'
import { useIsInFrame, NetworkContextName } from 'constants/misc'
import { isMobile } from 'helpers/userAgent'
import { store } from 'store/store'

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)
  const [gnosisSafe, setGnosisSafe] = useState<SafeAppConnector>()
  // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
  // if we are not embedded in an iframe, it is not worth checking
  const isInFrame = useIsInFrame()
  const [triedSafe, setTriedSafe] = useState(!isInFrame)

  useEffect(() => {
    ;(async () => {
      const { SafeAppConnector } = await import('@gnosis.pm/safe-apps-web3-react')
      setGnosisSafe(new SafeAppConnector())
    })()
  }, [])

  // first, try connecting to a gnosis safe
  useEffect(() => {
    if (!triedSafe && gnosisSafe) {
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
  }, [activate, triedSafe, gnosisSafe])

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
  const { setDestChainId, setSrcChainId, resetWhenAccountChange } = store.dispatch.application
  const { srcChainId, destChainId, availableChains } = store.getState().application
  const [cachedAccount, setCachedAccount] = useState('')
  const handleConnect = useCallback(() => {
    console.log("Handling 'connect' event")
    activate(injected)
  }, [activate])
  const handleChainChanged = useCallback(
    (chainId: string | number) => {
      console.log("Handling 'chainChanged' event with payload", chainId)
      /* if (parseInt(`${chainId}`) === destinationChain.chain_id) {
        setDestinationChain(fromChainList[0])
        switchToNetwork({ library, chainId: destinationChain.chain_id })
      } */

      if (chainId != srcChainId) {
        if (store.getState().application.availableChains.has(parseInt(`${chainId}`))) {
          setSrcChainId(+chainId)
        }
      }
      activate(injected)
    },
    [srcChainId, availableChains, activate]
  )
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    console.log("Handling 'accountsChanged' event with payload", accounts)
    if (accounts.length > 0) {
      activate(injected)
    }
  }, [])
  const handleNetworkChanged = useCallback(
    (networkId: string | number) => {
      console.log("Handling 'networkChanged' event with payload", networkId)
      if (networkId != srcChainId) {
        if (store.getState().application.availableChains.has(parseInt(`${networkId}`))) {
          setSrcChainId(+networkId)
        }
      }
      activate(injected)
    },
    [activate]
  )

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
