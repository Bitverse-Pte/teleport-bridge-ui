import React, { useCallback, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'

import { CircledCloseIcon } from 'components/Icon'
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

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

export default function CurrencySelectModal() {
  const {
    application: { setCurrencySelectModalOpen },
  } = useDispatch()
  const { currencySelectModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId } = useSelector((state: RootState) => {
    const { currencySelectModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId } = state.application
    return { currencySelectModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId }
  })
  const { active, account, connector, activate, chainId, error, deactivate } = useActiveWeb3React()
  const selectedTokenPairs = useMemo(() => {
    return bridgePairs.get(`${srcChainId}-${destChainId}`)?.tokens || []
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  return (
    <UniModal
      isOpen={currencySelectModalOpen}
      maxHeight={61.8}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setCurrencySelectModalOpen}
      maxWidth={'40rem'}
      title="Select A Token"
    >
      {/* <Flex flexDirection="column" width="100%" overflow="hidden"> */}
      {/*  <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Select a Token</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setCurrencySelectModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex> */}
      <UniModalContentWrapper style={{ flex: 1 }}>
        <Flex flex={1}>
          <AutoSizer style={{ width: '100%', height: '100%' }}>
            {({ height }) => {
              return <CurrencyList height={height} tokenPairs={selectedTokenPairs} />
            }}
          </AutoSizer>
        </Flex>
      </UniModalContentWrapper>
      {/* </Flex> */}
    </UniModal>
  )
}
