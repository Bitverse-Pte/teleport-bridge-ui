import React, { useCallback, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'

import Modal from 'components/Modal'
import styled from 'styled-components'
import { useDispatch } from 'hooks'
import { RootState } from 'store'
import CurrencyList from '../Currency/CurrencyList'

export default function CurrencySelectModal() {
  const {
    application: { setCurrencySelectModalOpen },
  } = useDispatch()
  const { currencySelectModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId } = useSelector((state: RootState) => {
    const { currencySelectModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId } = state.application
    return { currencySelectModalOpen, selectedTokenName, bridgePairs, srcChainId, destChainId }
  })

  const selectedTokenPairs = useMemo(() => {
    return bridgePairs.get(`${srcChainId}-${destChainId}`)?.tokens || []
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  return (
    <Modal
      isOpen={currencySelectModalOpen}
      maxHeight={61.8}
      /* onDismiss={() => {
        console.log('dismiss')
      }} */
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
      {/* <ModalContentWrapper style={{ flex: 1 }}> */}
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ height }) => {
          return <CurrencyList height={height} tokenPairs={selectedTokenPairs} />
        }}
      </AutoSizer>
      {/* </ModalContentWrapper> */}
      {/* </Flex> */}
    </Modal>
  )
}
