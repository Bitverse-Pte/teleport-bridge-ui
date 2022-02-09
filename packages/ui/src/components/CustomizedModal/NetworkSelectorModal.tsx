import React, { useCallback } from 'react'
import { Box, Flex } from 'rebass'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Option from 'components/Option'
import { CircledCloseIcon } from 'components/Icon'
import { PrimaryText, StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { useActiveWeb3React } from 'hooks/web3'
import { RootState } from 'store/store'
import { useDispatch } from 'hooks'
import { pick } from 'lodash'
import { NetworkSelectModalMode } from 'constants/index'

const OptionGrid = styled(Box)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

export default function NetworkSelectModal() {
  const { active, account, activate, chainId, error, library, connector, setError } = useActiveWeb3React()
  const { waitWallet, networkModalMode, availableChains, srcChainId, destChainId, connectStatus } = useSelector((state: RootState) => {
    const { waitWallet, networkModalMode, availableChains, srcChainId, destChainId, connectStatus } = state.application
    return { waitWallet, networkModalMode, availableChains, srcChainId, destChainId, connectStatus }
  })
  const {
    application: { setWaitWallet, setNetworkModalMode, saveDestChainId, setSrcChainId, changeNetwork },
  } = useDispatch()
  // const fromChainList = useFromChainList()

  const getNetworkOptions = useCallback(() => {
    switch (networkModalMode) {
      case NetworkSelectModalMode.SRC:
        return [...availableChains.values()].map((chain) => {
          return (
            <Option
              id={`connect-${chain.name}`}
              onClick={() => {
                changeNetwork({ chainId: chain.chainId })
              }}
              key={chain.chainId}
              active={!!(connectStatus && account && chainId == chain.chainId)}
              color={'blue'}
              header={chain.name}
              subheader={null} //use option.descriptio to bring back multi-line
              icon={chain.icon}
            />
          )
        })
      case NetworkSelectModalMode.DEST:
        return availableChains.get(srcChainId)!.destChains.map((chain) => {
          return (
            <Option
              id={`connect-${chain.name}`}
              onClick={() => {
                saveDestChainId(chain.chainId)
              }}
              key={chain.chainId}
              active={destChainId == chain.chainId}
              color={'blue'}
              header={chain.name}
              subheader={null} //use option.descriptio to bring back multi-line
              icon={chain.icon}
            />
          )
        })
      default:
        break
    }
  }, [library, chainId, availableChains, networkModalMode, srcChainId, destChainId])

  return (
    <UniModal
      maxWidth="40rem"
      maxHeight={61.8}
      isOpen={networkModalMode !== NetworkSelectModalMode.CLOSE}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={() => setNetworkModalMode(NetworkSelectModalMode.CLOSE)}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Select a Chain</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setNetworkModalMode(NetworkSelectModalMode.CLOSE)} />
        </Flex>
        <UniModalContentWrapper>
          <OptionGrid>{getNetworkOptions()}</OptionGrid>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
