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
import { TooltippedAmount } from 'components/TooltippedAmount'
import { StyledLogo } from 'components/Logo'
import { TokenPair } from 'constants/index'

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
  color: ${({ theme }) => theme.red1};
`

const GreenAmountText = styled(AmountText)`
  color: ${({ theme }) => theme.green1};
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
  const { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs, availableChains } = useSelector((state: RootState) => {
    const { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs, availableChains } = state.application
    return { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs, availableChains }
  })

  const selectedTx = useMemo(() => {
    return transactions.find((t) => {
      return t.send_tx_hash === selectedTransactionId || t.receive_tx_hash === selectedTransactionId
    })
  }, [selectedTransactionId, transactions])

  /*   const tokenInfo = useMemo(() => {
    if (selectedTx) {
      return bridgePairs.get(`${selectedTx.src_chain_id}-${selectedTx.dest_chain_id}`)?.tokens.find((e) => e.srcToken.address.toLowerCase() === selectedTx.token_address.toLowerCase())
    }
  }, [selectedTx, bridgePairs]) */
  const tokenInfo = useMemo(() => {
    if (selectedTx && selectedTx.src_chain_id && selectedTx.dest_chain_id) {
      const key = `${selectedTx.src_chain_id}-${selectedTx.dest_chain_id}`
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const tokens = bridgePairs.get(key)?.tokens
      if (!tokens) {
        return {}
      }
      const target = tokens!.find((e) => e.srcToken.address.toLowerCase() === transaction.token_address.toLowerCase()) || tokens!.find((e) => e.destToken.address.toLowerCase() === transaction.token_address.toLowerCase())
      if (target) {
        const { srcToken, destToken } = target
        return { srcToken, destToken }
      } else {
        return {}
      }
    } else if (selectedTx && selectedTx.src_chain_id) {
      let possibleTokenPair: TokenPair | undefined
      for (const [key, value] of bridgePairs.entries()) {
        if (key.startsWith(`${selectedTx.src_chain_id}-`)) {
          possibleTokenPair = value.tokens.find((token) => token.srcToken.address === selectedTx.token_address)
          break
        }
      }
      if (possibleTokenPair) {
        return { srcToken: possibleTokenPair.srcToken }
      }
    }
    return {}
  }, [selectedTx, bridgePairs])

  return (
    <UniModal
      isOpen={transactionDetailModalOpen}
      maxHeight={'500px'}
      maxWidth={'35rem'}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={closeTransactionDetailModal}
      title="Transaction Details"
    >
      {/* <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Transaction Details</a>
          </StyledText>
          <CircledCloseIcon onClick={closeTransactionDetailModal} style={{ position: 'absolute' }} />
        </Flex> */}
      <UniModalContentWrapper justifyContent="space-evenly" flexDirection="column">
        {selectedTx && tokenInfo.srcToken && (
          <>
            <Wrapper>
              <StyledStatusMark success={!!selectedTx.send_tx_hash}>
                <StyledCheck size={12} strokeWidth={6} />
              </StyledStatusMark>
              <Flex>
                <Text2>You Send</Text2>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Flex justifyContent={'flex-start'} alignItems={'center'} width="50%">
                  <StyledLogo size={'1rem'} srcs={[availableChains.get(+selectedTx.src_chain_id)!.icon!]} />
                  &nbsp;
                  <Text1 style={{ whiteSpace: 'nowrap' }} fontSize={16} fontWeight={600}>
                    {selectedTx?.src_chain}
                  </Text1>
                </Flex>
                {/* 
                    {new BigNumberJS(balance.toString()).shiftedBy(-currency.decimals).toFixed(4)}
                  */}
                <Flex justifyContent={'flex-end'} alignItems={'center'} width="50%">
                  <TooltippedAmount direction={'-'} amount={`${new BigNumberJS(selectedTx.amount).shiftedBy(-tokenInfo!.srcToken.decimals).toFixed(4)}`} AmountText={RedAmountText} />
                  &nbsp;
                  <Text1 color="#D25958">&nbsp;{tokenInfo!.srcToken.symbol.toUpperCase()}</Text1>
                </Flex>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text2 style={{ whiteSpace: 'nowrap' }}>Tx Hash</Text2>
                <Hash textAlign={'right'} flex={1} ellipsis={true} hash={selectedTx.send_tx_hash} copyable={true} />
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text2 style={{ whiteSpace: 'nowrap' }}>Sender Address</Text2>
                <Hash textAlign={'right'} flex={1} ellipsis={true} hash={selectedTx.sender} copyable={true} />
              </Flex>
            </Wrapper>
            <Wrapper>
              <StyledStatusMark success={!!selectedTx.receive_tx_hash}>
                <StyledCheck size={12} strokeWidth={6} />
              </StyledStatusMark>
              <Flex>
                <Text2>To</Text2>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Flex justifyContent={'flex-start'} alignItems={'center'} width="50%">
                  {tokenInfo!.destToken && (
                    <>
                      <StyledLogo size={'1rem'} srcs={[availableChains.get(+selectedTx.dest_chain_id)!.icon!]} />
                      &nbsp;
                      <Text1 style={{ whiteSpace: 'nowrap' }} fontSize={16} fontWeight={600}>
                        {selectedTx?.dest_chain}
                      </Text1>
                    </>
                  )}
                </Flex>
                {tokenInfo!.destToken && (
                  <Flex justifyContent={'flex-end'} alignItems={'center'} width="50%">
                    <TooltippedAmount direction={'+'} amount={`${new BigNumberJS(selectedTx.amount).shiftedBy(-tokenInfo!.destToken.decimals).toFixed(4)}`} AmountText={GreenAmountText} />
                    <Text1 color="#83F2C4">&nbsp;{tokenInfo!.destToken.symbol.toUpperCase()}</Text1>
                  </Flex>
                )}
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text2 style={{ whiteSpace: 'nowrap' }}>Tx Hash</Text2>
                <Hash textAlign={'right'} flex={1} ellipsis={true} hash={selectedTx.receive_tx_hash} copyable={true} />
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text2 style={{ whiteSpace: 'nowrap' }}>Receiver Address</Text2>
                <Hash textAlign={'right'} flex={1} ellipsis={true} hash={selectedTx.receiver} copyable={true} />
              </Flex>
            </Wrapper>
          </>
        )}
      </UniModalContentWrapper>
      {/* </Flex> */}
    </UniModal>
  )
}
