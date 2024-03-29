// import { Trans } from '@lingui'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useDispatch } from 'hooks/index'
import { useActiveWeb3React, useEagerConnect, useInactiveListener } from 'hooks/web3'
import { RootState } from 'store'
import { NetworkSelectModalMode } from 'constants/types'
// import { network } from 'connectors'

/* const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
` */

export function CosmosManager({ children }: { children: JSX.Element }) {
  const {
    application: { /* setDestinationChain, */ setLibrary, setAccount, changeNetwork, setNetworkModalMode, setSrcChainId },
  } = useDispatch()

  const { connectStatus, availableChains, srcChainId, networkModalMode } = useSelector((state: RootState) => {
    const { connectStatus, availableChains, srcChainId, networkModalMode } = state.application
    return { connectStatus, availableChains, srcChainId, networkModalMode }
  })
  const { active, chainId, account, library, error, activate } = useActiveWeb3React()
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  /*  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      setPageActive(true)
    } else {
      setPageActive(false)
    }
  }, []) */

  /* useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) */
  useEffect(() => {
    setLibrary(library)
    setAccount(account)
  }, [library, account])

  useEffect(() => {
    if (active && chainId && availableChains.size) {
      if (chainId && chainId !== srcChainId && networkModalMode !== NetworkSelectModalMode.SRC) {
        if (!(window.web3 || window.ethereum)) {
          return
        }
        if (availableChains.has(chainId)) {
          library && changeNetwork({ chainId: chainId })
          return
        }
        account && connectStatus && active && setNetworkModalMode(NetworkSelectModalMode.SRC)
      }
      /*    if (availableChains.has(chainId)) {
        chainId && chainId !== srcChainId && changeNetwork({ chainId: chainId })
      } else {
        // changeNetwork({ chainId: availableChains.values().next().value.chainId })
        connectStatus && active && setNetworkModalMode(NetworkSelectModalMode.SRC)
      } */
    }
  }, [active, chainId, availableChains, connectStatus, account, library])

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  /*   useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]) */

  /*   useEffect(() => {
    if (connectStatus && (active || networkActive) && (library || networkLibrary)) {
      if (destinationChain.chain_id === chainId || destinationChain.chain_id === networkChainId) {
        setDestinationChain(fromChainList[0])
        switchToNetwork({ library: library || networkLibrary, chainId: destinationChain.chain_id })
      }
    }
  }, [connectStatus, active, networkActive, library, networkLibrary]) */

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  // useInactiveListener(!triedEager)
  useInactiveListener(false)

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  /* if (triedEager && !active && networkError) {
    return (
      <MessageWrapper>
        <Message>
          <Text>Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.</Text>
        </Message>
      </MessageWrapper>
    )
  }
 */
  return children
}
