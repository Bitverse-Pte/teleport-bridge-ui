// import { Trans } from '@lingui/macro'
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Text } from 'rebass'
import { useEffect } from 'react'
import styled from 'styled-components/macro'

import { network } from '../../connectors'
import { useDispatch } from 'hooks/index'
import { NetworkContextName } from '../../constants/misc'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { pick } from 'lodash'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { useFromChainList } from 'hooks/useChainList'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const {
    application: { setDestinationChain },
  } = useDispatch()
  const { connectStatus, destinationChain } = useSelector((state: RootState) => pick(state.application, 'connectStatus', 'destinationChain'))
  const { active, chainId, library } = useWeb3React()
  const { library: networkLibrary, active: networkActive, error: networkError, activate: activateNetwork, chainId: networkChainId } = useWeb3React(NetworkContextName)
  const fromChainList = useFromChainList()
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  useEffect(() => {
    if (connectStatus && (active || networkActive) && (library || networkLibrary)) {
      if (destinationChain.chain_id === chainId || destinationChain.chain_id === networkChainId) {
        setDestinationChain(fromChainList[0])
        switchToNetwork({ library: library || networkLibrary, chainId: destinationChain.chain_id })
      }
    }
  }, [connectStatus, active, networkActive, library, networkLibrary])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  // useInactiveListener(!triedEager)
  useInactiveListener(false)

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (triedEager && !active && networkError) {
    return (
      <MessageWrapper>
        <Message>
          <Text>Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.</Text>
        </Message>
      </MessageWrapper>
    )
  }

  return children
}
