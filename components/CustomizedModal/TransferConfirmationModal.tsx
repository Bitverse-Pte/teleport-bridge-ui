import React, { useCallback, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'

import { CircledCloseIcon, Icon } from 'components/Icon'
import { StyledText, Text1, Text4 } from 'components/Text'
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
import { StyledLogo } from 'components/Logo'

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
  const { transferConfirmationModalOpen, selectedTokenName, bridgePairs, availableChains, srcChainId, destChainId } = useSelector((state: RootState) => {
    const { transferConfirmationModalOpen, selectedTokenName, bridgePairs, availableChains, srcChainId, destChainId } = state.application
    return { transferConfirmationModalOpen, selectedTokenName, bridgePairs, availableChains, srcChainId, destChainId }
  })

  const sourceChain = useMemo(() => {
    return availableChains.get(srcChainId)
  }, [srcChainId, availableChains])

  const destChain = useMemo(() => {
    return availableChains.get(destChainId)
  }, [destChainId, availableChains])

  const selectedTokenPairs = useMemo(() => {
    return bridgePairs.get(`${srcChainId}-${destChainId}`)?.tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName)
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  const amount = useMemo(() => {
    const input = document.getElementById('fromValueInput')
    if (input) {
      return (input as HTMLInputElement).value
    } else {
      return '0'
    }
  }, [transferConfirmationModalOpen])

  return (
    <UniModal
      isOpen={transferConfirmationModalOpen}
      maxHeight={61.8}
      minHeight={'fit-content'}
      minWidth={'fit-content'}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setTransferConfirmationModalOpen}
      title="Transfer"
    >
      {/*   <Flex flexDirection="column" width="100%" overflow="hidden" height={'fit-content'}>
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Transfer</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setTransferConfirmationModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex> */}
      <UniModalContentWrapper minWidth={'fit-content'}>
        <Flex flex={1} minWidth={'fit-content'} flexDirection={'column'} justifyContent="center">
          <Flex minWidth={'fit-content'} justifyContent={'space-between'} color={'white'} width="100%">
            <Flex minWidth={'fit-content'} marginRight="1rem">
              <Flex justifyContent={'center'} alignItems={'center'} padding="0.5rem">
                {sourceChain?.icon && <StyledLogo size={'1.5rem'} srcs={[sourceChain.icon!]} />}
              </Flex>
              <Flex flexDirection={'column'} minWidth={'fit-content'} alignItems={'start'}>
                <Text1 style={{ whiteSpace: 'nowrap' }} minWidth={'fit-content'} fontWeight={600}>
                  {sourceChain?.name}
                </Text1>
                <Text4 minWidth={'fit-content'} style={{ whiteSpace: 'nowrap' }} fontSize={'0.5rem'}>
                  Source Chain
                </Text4>
              </Flex>
            </Flex>
            <Flex flexDirection={'column'} minWidth={'fit-content'}>
              <Text1 fontWeight={600} color="#D25958" minWidth={'fit-content'}>
                -{amount}
              </Text1>
              <Text4 fontSize={'0.5rem'}>{selectedTokenPairs?.srcToken.symbol}</Text4>
            </Flex>
          </Flex>
          <Flex minWidth={'fit-content'} justifyContent={'space-between'} color={'white'} width="100%">
            <Flex minWidth={'fit-content'} marginRight="1rem">
              <Flex justifyContent={'center'} alignItems={'center'} padding="0.5rem">
                {destChain?.icon && <StyledLogo size={'1.5rem'} srcs={[destChain.icon!]} />}
              </Flex>
              <Flex flexDirection={'column'} minWidth={'fit-content'} alignItems={'start'}>
                <Text1 style={{ whiteSpace: 'nowrap' }} minWidth={'fit-content'} fontWeight={600}>
                  {destChain?.name}
                </Text1>
                <Text4 minWidth={'fit-content'} style={{ whiteSpace: 'nowrap' }} fontSize={'0.5rem'}>
                  Source Chain
                </Text4>
              </Flex>
            </Flex>
            <Flex flexDirection={'column'} minWidth={'fit-content'}>
              <Text1 fontWeight={600} color="#83F2C4">
                +{amount}
              </Text1>
              <Text4 fontSize={'0.5rem'}>{selectedTokenPairs?.srcToken.symbol}</Text4>
            </Flex>
          </Flex>
          <EstimationBlock width="100%" margin={'1rem 0'} />
          <TransferConfirmationButton />
        </Flex>
      </UniModalContentWrapper>
      {/*   </Flex> */}
    </UniModal>
  )
}
