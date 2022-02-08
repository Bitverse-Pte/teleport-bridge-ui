// import { Trans } from '@lingui/macro'
import React, { useCallback, useLayoutEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Text } from 'rebass'
import { useEffect } from 'react'
import styled from 'styled-components/macro'

import { network } from '../../connectors'
import { useDispatch } from 'hooks/index'
import { NetworkContextName } from '../../constants/misc'
import { useActiveWeb3React, useEagerConnect, useInactiveListener } from '../../hooks/web3'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { pick } from 'lodash'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { NetworkSelectModalMode } from 'constants/types'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3Manager({ children }: { children: JSX.Element }) {
  const {
    application: { /* setDestinationChain, */ setLibrary, setAccount, setPageActive, changeNetwork, setNetworkModalMode, setSrcChainId },
  } = useDispatch()

  const { connectStatus, availableChains, pageActive, srcChainId } = useSelector((state: RootState) => {
    const { connectStatus, availableChains, pageActive, srcChainId } = state.application
    return { connectStatus, availableChains, pageActive, srcChainId }
  })
  const { active, chainId, account, library, active: networkActive, error: networkError, activate: activateNetwork, chainId: networkChainId } = useActiveWeb3React()
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      setPageActive(true)
    } else {
      setPageActive(false)
    }
    /* if (active && chainId) {
      if (availableChains.has(chainId)) {
        setSrcChainId(chainId)
      } else {
        changeNetwork({ chainId: availableChains.values().next().value.chainId })
      }
    } */
  }, [])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (pageActive && active && chainId && availableChains.size) {
      if (availableChains.has(chainId)) {
        chainId && chainId !== srcChainId && changeNetwork({ chainId: chainId })
      } else {
        // changeNetwork({ chainId: availableChains.values().next().value.chainId })
        connectStatus && setNetworkModalMode(NetworkSelectModalMode.SRC)
      }
    }
  }, [pageActive, active, chainId, availableChains, connectStatus])

  useEffect(() => {
    setLibrary(library)
    setAccount(account)
  }, [library, account])

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

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
