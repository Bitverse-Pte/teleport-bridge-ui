import React, { useCallback, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'

import { CircledCloseIcon } from 'components/Icon'
import { StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import Option from 'components/Option'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { injected, portis } from 'connectors'
import { isMobile } from 'helpers/userAgent'
import styled from 'styled-components'
import { useDispatch } from 'hooks'
import { RootState } from 'store'
import { useActiveWeb3React } from 'hooks/web3'
import CurrencyList from '../Currency/CurrencyList'
import { getChainData } from 'helpers/chains'
import { EstimationBlock } from 'components/EstimationBlock'
import { TransferConfirmationButton } from 'components/Button/TransferConfirmationButton'

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

export default function TransferConfirmationModal() {
  const {
    application: { setTransferConfirmationModalOpen },
  } = useDispatch()
  const { transferConfirmationModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId } = useSelector((state: RootState) => {
    const { transferConfirmationModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId } = state.application
    return { transferConfirmationModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId }
  })
  const { active, account, connector, activate, chainId, error, deactivate } = useActiveWeb3React()
  const selectedTokenPairs = useMemo(() => {
    return bridgePairs.get(`${srcChainId}-${destChainId}`)?.tokens || []
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  return (
    <UniModal
      isOpen={transferConfirmationModalOpen}
      maxHeight={61.8}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setTransferConfirmationModalOpen}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden" height={'fit-content'}>
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Transfer</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setTransferConfirmationModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex>
        <UniModalContentWrapper>
          <Flex flex={1} flexDirection={'column'}>
            <Flex justifyContent={'space-between'}>
              <Flex>
                <Flex>icon</Flex>
                <Flex>sourcechain</Flex>
              </Flex>
              <Flex flexDirection={'column'}>
                <Flex>tokenname</Flex>
                <Flex>amounts</Flex>
              </Flex>
            </Flex>
            <Flex justifyContent={'space-between'}>
              <Flex>
                <Flex>icon</Flex>
                <Flex>destchain</Flex>
              </Flex>
              <Flex flexDirection={'column'}>
                <Flex>tokenname</Flex>
                <Flex>amounts</Flex>
              </Flex>
            </Flex>
            <EstimationBlock />
            <TransferConfirmationButton />
          </Flex>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
