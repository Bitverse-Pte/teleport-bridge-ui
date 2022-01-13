import React, { useCallback } from 'react'
import { Box, Flex } from 'rebass'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Option from 'components/Option'
import { CircledCloseIcon } from 'components/Icon'
import { StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { useActiveWeb3React } from 'hooks/web3'
import { useFromChainList } from 'hooks/useChainList'
import { RootState } from 'store/store'
import { useDispatch } from 'hooks'
import { pick } from 'lodash'

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
  const { networkModalOpen, destinationChain } = useSelector((state: RootState) => pick(state.application, 'networkModalOpen', 'destinationChain'))
  const {
    application: { setNetworkModalOpen: setNetworkMenuOpen },
  } = useDispatch()
  const fromChainList = useFromChainList()

  const getNetworkOptions = useCallback(() => {
    return fromChainList.map((chain) => {
      if (chain.chain_id === destinationChain.chain_id) {
        return null
      }
      return (
        <Option
          id={`connect-${chain.name}`}
          onClick={() => {
            library && switchToNetwork({ library, chainId: chain.chain_id, connector })
          }}
          key={chain.chain_id}
          active={chainId == chain.chain_id}
          color={'blue'}
          header={chain.name}
          subheader={null} //use option.descriptio to bring back multi-line
          icon={chain.logo}
        />
      )
    })
  }, [library, chainId])

  return (
    <UniModal
      maxWidth="40rem"
      maxHeight={61.8}
      isOpen={networkModalOpen}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setNetworkMenuOpen}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="fit-content" width="100%" justifyContent="flex-end">
          <StyledText style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a style={{ fontSize: '2rem' }}>Switch Chain</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setNetworkMenuOpen(false)} />
        </Flex>
        <UniModalContentWrapper>
          <OptionGrid>{getNetworkOptions()}</OptionGrid>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
