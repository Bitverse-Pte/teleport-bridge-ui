import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactLoading from 'react-loading'
import { Flex, Box, Text } from 'rebass'
import { useSelector } from 'react-redux'
import BigNumberJS from 'bignumber.js'
import { Check, X, Frown } from 'react-feather'
import styled, { css, StyledComponent } from 'styled-components'
import { useTimer } from 'react-timer-hook'

import { StyledText, Text1, Text2, Text4 } from 'components/Text'
import Modal from 'components/Modal'
import { useDispatch } from 'hooks'
import { RootState } from 'store/store'
import { Hash } from 'components/Hash'
import { TooltippedAmount } from 'components/TooltippedAmount'
import { StyledLogo } from 'components/Logo'
import { TokenPair, TransactionDetail, TransactionDetailWithCreateTime, TRANSACTION_STATUS } from 'constants/index'
import { darken } from 'polished'

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

const StyledCheck = styled(Check)``

const StyleX = styled(X)``

enum STATUS_MARK_TYPE {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INPROGRESS = 'INPROGRESS',
  UNKNOWN = 'UNKNOWN',
}

/*   ${({ type }) => {
  switch (type) {
    case STATUS_MARK_TYPE.SUCCESS:
      return '#00c6a9'
    case STATUS_MARK_TYPE.INPROGRESS:
      return '#fdaf14'
    case STATUS_MARK_TYPE.FAILED:
      return '#4f4f4f'
    default:
      return 'gray'
  }
}}; */
const StyledStatusMark = ({ type }: { type: STATUS_MARK_TYPE }) => {
  const backgroundColor = useMemo(() => {
    switch (type) {
      case STATUS_MARK_TYPE.SUCCESS:
        return '#00c6a9'
      case STATUS_MARK_TYPE.INPROGRESS:
        return '#fdaf14'
      case STATUS_MARK_TYPE.FAILED:
        return darken(0.1, 'red')
      default:
        return 'gray'
    }
  }, [type])

  const showIcon = useCallback(() => {
    switch (type) {
      case STATUS_MARK_TYPE.SUCCESS:
        return <StyledCheck size={'1rem'} strokeWidth={6} />
      case STATUS_MARK_TYPE.INPROGRESS:
        return <ReactLoading type={'spinningBubbles'} color="#fff" height="1rem" width={'1rem'} />
      case STATUS_MARK_TYPE.FAILED:
        return <Frown size={'1rem'} color={'rgba(255,255,255,0.6)'} strokeWidth={2} />
      default:
        return <StyleX size={'1rem'} strokeWidth={6} />
    }
  }, [type])
  return (
    <Flex width="2rem" height={'2rem'} flexDirection="column" margin="0!important" padding={'0'} style={{ position: 'absolute', top: '-1.5px', right: '1rem' }}>
      <Flex width="2rem" height={'2rem'} backgroundColor={backgroundColor} margin="0!important" padding={'0'} justifyContent="center" alignItems={'center'}>
        {showIcon()}
      </Flex>
      <Flex
        width="0"
        height={'0'}
        margin="0!important"
        padding={'0'}
        css={css`
          border-right: 2rem solid transparent;
          border-top: 0.5rem solid ${backgroundColor};
        `}
      ></Flex>
    </Flex>
  )
}

export default function TransactionDetailModal() {
  const {
    application: { closeTransactionDetailModal },
  } = useDispatch()
  const { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs, availableChains } = useSelector((state: RootState) => {
    const { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs, availableChains } = state.application
    return { transactionDetailModalOpen, selectedTransactionId, transactions, bridgePairs, availableChains }
  })

  const selectedTx = useMemo<TransactionDetailWithCreateTime>(() => {
    return transactions.find((t) => {
      return t.send_tx_hash === selectedTransactionId || t.receive_tx_hash === selectedTransactionId
    })! as TransactionDetailWithCreateTime
  }, [transactions, selectedTransactionId])

  /*   const tokenInfo = useMemo(() => {
    if (selectedTx) {
      return bridgePairs.get(`${selectedTx.src_chain_id}-${selectedTx.dest_chain_id}`)?.tokens.find((e) => e.srcToken.address.toLowerCase() === selectedTx.token_address.toLowerCase())
    }
  }, [selectedTx, bridgePairs]) */
  const tokenInfo = useMemo(() => {
    if (selectedTx && selectedTx.src_chain_id && selectedTx.dest_chain_id) {
      const key = `${selectedTx.src_chain_id}-${selectedTx.dest_chain_id}`
      const tokens = bridgePairs.get(key)?.tokens
      if (!tokens) {
        return {}
      }
      const target = tokens!.find((e) => e.srcToken.address.toLowerCase() === selectedTx.token_address.toLowerCase()) || tokens!.find((e) => e.destToken.address.toLowerCase() === selectedTx.token_address.toLowerCase())
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

  const sendTxStatusMarkType = useMemo(() => {
    if (selectedTx?.send_tx_hash && selectedTx?.receive_tx_hash) {
      return STATUS_MARK_TYPE.SUCCESS
    } else if (selectedTx?.send_tx_hash && !selectedTx?.receive_tx_hash && selectedTx.status === TRANSACTION_STATUS.PENDING) {
      return STATUS_MARK_TYPE.INPROGRESS
    } else if (selectedTx?.send_tx_hash && selectedTx.status === TRANSACTION_STATUS.FAILED) {
      return STATUS_MARK_TYPE.FAILED
    } else {
      return STATUS_MARK_TYPE.UNKNOWN
    }
  }, [selectedTx?.send_tx_hash, selectedTx?.receive_tx_hash, selectedTx?.status])

  const receiveTxStatusMarkType = useMemo(() => {
    if (selectedTx?.send_tx_hash && selectedTx?.receive_tx_hash && selectedTx.status === TRANSACTION_STATUS.SUCCEEDED) {
      return STATUS_MARK_TYPE.SUCCESS
    } else if (selectedTx?.send_tx_hash && selectedTx?.receive_tx_hash && selectedTx.status === TRANSACTION_STATUS.PENDING) {
      return STATUS_MARK_TYPE.INPROGRESS
    } else if (selectedTx?.send_tx_hash && selectedTx?.receive_tx_hash && selectedTx.status === TRANSACTION_STATUS.FAILED) {
      return STATUS_MARK_TYPE.FAILED
    } else if (selectedTx?.send_tx_hash && !selectedTx?.receive_tx_hash) {
      return STATUS_MARK_TYPE.UNKNOWN
    } else {
      return STATUS_MARK_TYPE.UNKNOWN
    }
  }, [selectedTx?.send_tx_hash, selectedTx?.receive_tx_hash, selectedTx?.status])

  const [passedTime, setPassedTime] = useState<string>()

  const startTime = useMemo(() => (selectedTx ? selectedTx!.createTime! : 0), [selectedTx])
  const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({ expiryTimestamp: new Date(/* (selectedTx ? selectedTx!.createTime! : 0) */ startTime + 1000 * 60 * 5), onExpire: () => console.warn('onExpire called') })

  useEffect(() => {
    if (selectedTx) {
      if (Date.now() < startTime + 1000 * 60 * 5 && !isRunning && selectedTx.status === TRANSACTION_STATUS.PENDING) {
        start()
        // resume()
      } else if (Date.now() >= startTime + 1000 * 60 * 5 && isRunning) {
        pause()
      }
      if (selectedTx.status === TRANSACTION_STATUS.FAILED || selectedTx.status === TRANSACTION_STATUS.SUCCEEDED) {
        pause()
      }
    }
  }, [selectedTx, isRunning, sendTxStatusMarkType, receiveTxStatusMarkType, start, pause])

  useEffect(() => {
    selectedTx && isRunning && setPassedTime(millisToSeconds(Number(new Date()) - startTime /* selectedTx.createTime */))
  }, [seconds, isRunning, selectedTx, startTime])

  return (
    <Modal isOpen={transactionDetailModalOpen} maxHeight={'600px'} maxWidth={'35rem'} closeByKeyboard={true} setIsOpen={closeTransactionDetailModal} title="Transaction Details">
      {/* <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Transaction Details</a>
          </StyledText>
          <CircledCloseIcon onClick={closeTransactionDetailModal} style={{ position: 'absolute' }} />
        </Flex> */}
      {/* <ModalContentWrapper justifyContent="space-evenly" flexDirection="column"> */}
      {selectedTx && tokenInfo.srcToken && (
        <Flex justifyContent={'space-between'} flexDirection="column" width="100%">
          <Wrapper>
            <StyledStatusMark type={sendTxStatusMarkType} />
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
            <StyledStatusMark type={receiveTxStatusMarkType} />
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

          {isRunning && (
            <Flex color={'rgba(255,255,255,0.6)'} padding="0 1rem" justifyContent={'space-between'} alignItems="center">
              <Text>Time Used</Text>
              <Text>{passedTime}/5m</Text>
            </Flex>
          )}
        </Flex>
      )}
      {/* </ModalContentWrapper> */}
      {/* </Flex> */}
    </Modal>
  )
}

function millisToSeconds(millis: number) {
  var seconds = (millis / 1000).toFixed(1)
  //ES6 interpolated literals/template literals
  //If seconds is less than 10 put a zero in front.
  return `${seconds}s`
}
