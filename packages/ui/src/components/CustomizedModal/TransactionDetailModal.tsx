import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Flex, Box } from 'rebass'
import { useSelector } from 'react-redux'
import BigNumberJS from 'bignumber.js'
import { Check } from 'react-feather'
import { css } from 'styled-components/macro'

import { CircledCloseIcon, Icon } from 'components/Icon'
import { StyledText, Text1, Text2, Text4 } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import styled, { StyledComponent } from 'styled-components'
import { useDispatch } from 'hooks'
import { RootState } from 'store/store'
import { Hash } from 'components/Hash'
import Tooltip, { MouseoverTooltip, TooltipProps } from 'components/Tooltip'
import { TooltippedAmount } from 'components/TooltippedAmount'

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const Wrapper = styled(Flex)`
  color: white;
  padding: 1rem;
  margin: 0.5rem 0 !important;
  width: 100%;
  height: fit-content !important;
  background: rgba(0, 0, 0, 0.3);
  border: solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  backdrop-filter: blur(0.125rem);
  border-radius: 0.5rem;
  justify-content: center;
  flex-direction: column;
  & > div {
    margin: 0.5rem 0;
  }
`

const AmountText = styled(Text1)`
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const RedAmountText = styled(AmountText)`
  color: red;
`

const GreenAmountText = styled(AmountText)`
  color: green;
`

const StyledCheck = styled(Check)`
  transform: rotate(90deg) translateX(-22px);
`

const StyledStatusMark = styled(Box)<{ success: boolean }>`
  transform: rotate(270deg);
  height: 0;
  width: 25px;
  border-top: 25px solid ${({ success }) => (success ? '#00c6a9' : '#4f4f4f')};
  border-left: 8px solid transparent;
  border-bottom: 15px solid transparent;
  position: absolute;
  top: -1rem;
  right: 25px;
`

export default function TransactionDetailModal() {
  const {
    application: { closeTransactionDetailModal },
  } = useDispatch()
  const { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs } = useSelector((state: RootState) => {
    const { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs } = state.application
    return { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs }
  })

  const selectedTx = useMemo(() => {
    return transactions.find((t) => {
      return t.send_tx_hash === selectedTransactionId || t.receive_tx_hash === selectedTransactionId
    })
  }, [selectedTransactionId, transactions])

  const tokenInfo = useMemo(() => {
    if (selectedTx) {
      return bridgePairs.get(`${selectedTx.src_chain_id}-${selectedTx.dest_chain_id}`)?.tokens.find((e) => e.destToken.address.toLowerCase() === selectedTx.token_address.toLowerCase() || e.srcToken.address.toLowerCase() === selectedTx.token_address.toLowerCase())
    }
  }, [selectedTx, bridgePairs])

  return (
    <UniModal
      isOpen={transactionDetailModalOpen}
      maxHeight={61.8}
      maxWidth={'35rem'}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={closeTransactionDetailModal}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Transaction Details</a>
          </StyledText>
          <CircledCloseIcon onClick={closeTransactionDetailModal} style={{ position: 'absolute' }} />
        </Flex>
        <UniModalContentWrapper justifyContent="space-evenly" flexDirection="column">
          {selectedTx && tokenInfo && (
            <>
              <Wrapper>
                <StyledStatusMark success={true}>
                  <StyledCheck size={12} strokeWidth={6} />
                </StyledStatusMark>
                <Flex>
                  <Text2>You Send</Text2>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'baseline'}>
                  <Icon></Icon>
                  <Text1 style={{ whiteSpace: 'nowrap' }} fontSize={32} fontWeight={900}>
                    {selectedTx?.src_chain}
                  </Text1>
                  {/* 
                    {new BigNumberJS(balance.toString()).shiftedBy(-currency.decimals).toFixed(4)}
                  */}
                  <TooltippedAmount direction={'-'} amount={`${new BigNumberJS(selectedTx.amount).shiftedBy(-tokenInfo!.srcToken.decimals).toFixed(4)}`} AmountText={RedAmountText} />
                  <Text1 color="red">&nbsp;{tokenInfo!.srcToken.name.toUpperCase()}</Text1>
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text2 style={{ whiteSpace: 'nowrap' }}>Tx Hash</Text2>
                  <Hash ellipsis={true} hash={selectedTx.send_tx_hash} copyable={true} />
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text2 style={{ whiteSpace: 'nowrap' }}>Sender Address</Text2>
                  <Hash ellipsis={true} hash={selectedTx.sender} copyable={true} />
                </Flex>
              </Wrapper>
              <Wrapper>
                <StyledStatusMark success={true}>
                  <StyledCheck size={12} strokeWidth={6} />
                </StyledStatusMark>
                <Flex>
                  <Text2>To</Text2>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'baseline'}>
                  <Icon></Icon>
                  <Text1 style={{ whiteSpace: 'nowrap' }} fontSize={32} fontWeight={900}>
                    {selectedTx?.dest_chain}
                  </Text1>
                  <TooltippedAmount direction={'+'} amount={`${new BigNumberJS(selectedTx.amount).shiftedBy(-tokenInfo!.destToken.decimals).toFixed(4)}`} AmountText={GreenAmountText} />
                  <Text1 color="green">&nbsp;{tokenInfo!.destToken.name.toUpperCase()}</Text1>
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text2 style={{ whiteSpace: 'nowrap' }}>Tx Hash</Text2>
                  <Hash ellipsis={true} hash={selectedTx.receive_tx_hash} copyable={true} />
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text2 style={{ whiteSpace: 'nowrap' }}>Receiver Address</Text2>
                  <Hash ellipsis={true} hash={selectedTx.receiver} copyable={true} />
                </Flex>
              </Wrapper>
            </>
          )}
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
