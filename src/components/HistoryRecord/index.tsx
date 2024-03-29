import React, { useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { ChevronRight } from 'react-feather'
import { Textfit } from 'react-textfit'

import { Text, Box, Flex } from 'rebass'
import BigNumber from 'bignumber.js'
import { GreyCard, DarkGreyCard } from 'components/Card'
import { BridgePair, IChainData, ICurrency, Overwrite, TokenPair, TransactionDetail, TRANSACTION_STATUS } from 'constants/index'
import { StyledLogo } from 'components/Logo'
import { ButtonLight } from 'components/Button'
import { SelectorLabel } from 'components/Label'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import { HistoryGrayDetailText, HistoryGrayText } from 'components/Text'
import { WrappedLink } from 'components/Link'
import { TooltippedAmount } from 'components/TooltippedAmount'
import { sensorsTrack } from 'helpers/sensors'

interface LoosedIChainData {
  short_name?: string
  chain?: string
  network?: string
  rpc_url?: string
  logo?: string
}

export interface HistoryRecordProps {
  toChain: Overwrite<LoosedIChainData, IChainData>
  fromChain: Overwrite<LoosedIChainData, IChainData>
  inCurrency: { amount: BigNumber } & ICurrency
  outCurrency: { amount: BigNumber } & ICurrency
}

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const YellowCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.yellow1};
    border-radius: 50%;
  }
`
const RedCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.red1};
    border-radius: 50%;
  }
`

const HistoryGreyCard = styled(GreyCard)`
  height: 6rem;
  padding: 0.618rem;
  margin: 0.618rem;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 3fr 1fr 3fr 2fr;
  color: ${({ theme }) => theme.text2};
`
const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

const DarkenedText = styled(Text)<{ color: string }>`
  color: ${({ theme, color }) => darken(0.3, color || theme.text2)};
`

const AmountText = styled(Text)`
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: fit-content !important;
  font-weight: 300 !important;
  font-family: PingFang SC !important;
  font-style: normal !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: rgba(255, 255, 255, 0.45) !important;
`

const UnitText = styled(Text)`
  height: fit-content !important;
  font-weight: 300 !important;
  font-family: PingFang SC !important;
  font-style: normal !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: rgba(255, 255, 255, 0.45) !important;
`

/* 
export interface TransactionDetail {
  src_chain: string
  dest_chain: string
  sender: string
  send_tx_hash: string
  receiver: string
  receive_tx_hash: string
  amount: string
  token: string
  token_address: string
  status: TRANSACTION_STATUS
}
*/

export const HistoryChainButton = styled(ButtonLight)`
  padding: 0 0.5rem;
  box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.bg3};
  background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.bg2)};
`

export default function HistoryRecord({ transaction }: { transaction: TransactionDetail }) {
  const { availableChains, bridgePairs } = useSelector((state: RootState) => {
    const { availableChains, bridgePairs } = state.application
    return { availableChains, bridgePairs }
  })

  const {
    application: { openTransactionDetailModal, updateBridgeInfo },
  } = useDispatch()

  const [srcChain, destChain] = useMemo(() => {
    let sc, dc
    for (const chain of availableChains.values()) {
      if (chain.chainId == transaction.src_chain_id) {
        sc = chain
      }
      if (chain.chainId == transaction.dest_chain_id) {
        dc = chain
      }
    }
    return [sc, dc]
  }, [availableChains, transaction])

  const { srcToken, destToken } = useMemo(() => {
    if (transaction.src_chain_id && transaction.dest_chain_id) {
      const key = `${transaction.src_chain_id}-${transaction.dest_chain_id}`
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
    } else if (transaction.src_chain_id) {
      let possibleTokenPair: TokenPair | undefined
      for (const [key, value] of bridgePairs.entries()) {
        if (key.startsWith(`${transaction.src_chain_id}-`)) {
          possibleTokenPair = value.tokens.find((token) => token.srcToken.address === transaction.token_address)
          break
        }
      }
      if (possibleTokenPair) {
        return { srcToken: possibleTokenPair.srcToken }
      }
    }
    return {}
  }, [transaction.src_chain_id, transaction.dest_chain_id, transaction.token, bridgePairs])

  const jumpToSrcChainBrowserUrl = useMemo(() => {
    if (srcChain?.explorers[0] && transaction.send_tx_hash && srcChain && window) {
      const url = `${srcChain!.explorers[0]!.url}/tx/${transaction!.send_tx_hash}`
      return url
    }
  }, [srcChain, transaction])
  const jumpToDestChainBrowserUrl = useMemo(() => {
    if (destChain && destChain?.explorers[0] && transaction.receive_tx_hash && window) {
      const url = `${destChain!.explorers[0]!.url}/tx/${transaction!.receive_tx_hash}`
      return url
    }
  }, [destChain, transaction])

  const openDetail = useCallback((txHash: string) => {
    sensorsTrack('detail_click')
    openTransactionDetailModal(txHash)
  }, [])

  return (
    <>
      {srcToken && (
        <HistoryGreyCard>
          <Box style={{ display: 'flex', justifyContent: 'end', paddingRight: '0.5rem', alignItems: 'center' }}>
            <Text width="fit-content">From</Text>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <HistoryChainButton maxWidth="15rem" height="2rem" padding="0.25rem" style={{ cursor: 'default', justifyContent: 'space-around' }}>
              <StyledLogo style={{ position: 'relative', maxWidth: '15%' /* , marginRight: '0.5rem' */ }} size={'1rem'} srcs={[srcChain!.icon]} />
              <Textfit mode="single" min={2} max={20} style={{ width: 'calc(100% - 2rem)' }}>
                {srcChain!.name}
              </Textfit>
              <WrappedLink
                size={16}
                /* style={{ marginLeft: '0.5rem' }} */ to={jumpToSrcChainBrowserUrl}
                onClick={() => {
                  sensorsTrack('src_explorer_click')
                }}
              />
            </HistoryChainButton>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'end', paddingRight: '0.5rem', alignItems: 'center' }}>
            <Text>To</Text>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <HistoryChainButton maxWidth="15rem" height="2rem" padding="0.25rem" style={{ cursor: 'default', justifyContent: 'space-around' }}>
              {destChain && (
                <>
                  <StyledLogo style={{ position: 'relative', maxWidth: '15%' /* , marginRight: '0.5rem' */ }} size={'1rem'} srcs={[destChain!.icon]} />
                  <Textfit mode="single" min={2} max={20} style={{ width: 'calc(100% - 2rem)' }}>
                    {destChain!.name}
                  </Textfit>
                  <WrappedLink
                    size={16}
                    /* style={{ marginLeft: '0.5rem' }} */ to={jumpToDestChainBrowserUrl}
                    onClick={() => {
                      sensorsTrack('dest_explorer_click')
                    }}
                  />
                </>
              )}
            </HistoryChainButton>
          </Box>
          {(() => {
            switch (transaction.status) {
              case TRANSACTION_STATUS.PENDING:
                return (
                  <Flex justifyContent="center" alignItems="center">
                    <CircleWrapper>
                      <YellowCircle>
                        <div />
                      </YellowCircle>
                    </CircleWrapper>
                    <DarkenedText color="#F2BF6B" height="fit-content">
                      Pending
                    </DarkenedText>
                  </Flex>
                )
              case TRANSACTION_STATUS.SUCCEEDED:
                return (
                  <Flex justifyContent="center" alignItems="center">
                    <CircleWrapper>
                      <GreenCircle>
                        <div />
                      </GreenCircle>
                    </CircleWrapper>
                    <DarkenedText color="#83F2C4" height="fit-content">
                      Success
                    </DarkenedText>
                  </Flex>
                )
              case TRANSACTION_STATUS.FAILED:
                return (
                  <Flex justifyContent="center" alignItems="center">
                    <CircleWrapper>
                      <RedCircle>
                        <div />
                      </RedCircle>
                    </CircleWrapper>
                    <DarkenedText color="#D25958" height="fit-content">
                      Failed
                    </DarkenedText>
                  </Flex>
                )
            }
          })()}
          <Box></Box>
          <Flex justifyContent="center" alignItems="center">
            <TooltippedAmount amount={new BigNumber(transaction.amount).shiftedBy(-srcToken.decimals).toFixed(4)} AmountText={AmountText} />
            <UnitText>&nbsp;{srcToken!.symbol}</UnitText>
          </Flex>
          <Box></Box>
          <Flex justifyContent="center" alignItems="center">
            {destToken && (
              <>
                <TooltippedAmount amount={new BigNumber(transaction.amount).shiftedBy(-destToken.decimals).toFixed(4)} AmountText={AmountText} />
                <UnitText>&nbsp;{destToken!.symbol}</UnitText>
              </>
            )}
          </Flex>
          <Flex justifyContent={'center'} alignItems={'center'}>
            <HistoryGrayDetailText
              onClick={() => {
                openDetail(transaction.send_tx_hash)
              }}
            >
              <Flex justifyContent={'center'} alignItems={'center'}>
                detail
                <ChevronRight size={14} />
              </Flex>
            </HistoryGrayDetailText>
          </Flex>
        </HistoryGreyCard>
      )}
    </>
  )
}
