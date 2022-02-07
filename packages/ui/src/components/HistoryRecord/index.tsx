import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { ChevronRight } from 'react-feather'
import { Text, Box, Flex } from 'rebass'
import BigNumber from 'bignumber.js'
import { GreyCard, DarkGreyCard } from 'components/Card'
import { IChainData, ICurrency, Overwrite, TransactionDetail, TRANSACTION_STATUS } from 'constants/index'
import { SelectorLogo } from 'components/Logo'
import { ButtonLight } from 'components/Button'
import { SupportedChains } from 'constants/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { SelectorLabel } from 'components/Label'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import { HistoryGrayDetailText, HistoryGrayText } from 'components/Text'
import { TooltippedAmount } from 'components/TooltippedAmount'

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

export default function HistoryRecord({ transaction }: { transaction: TransactionDetail }) {
  const { availableChains, bridgePairs } = useSelector((state: RootState) => {
    const { availableChains, bridgePairs } = state.application
    return { availableChains, bridgePairs }
  })

  const {
    application: { openTransactionDetailModal },
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
    if (bridgePairs.has(`${transaction.src_chain_id}-${transaction.dest_chain_id}`)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const { srcToken, destToken } = bridgePairs.get(`${transaction.src_chain_id}-${transaction.dest_chain_id}`)?.tokens.find((e) => e.srcToken.address.toLowerCase() === transaction.token_address.toLowerCase() || e.destToken.address.toLowerCase() === transaction.token_address.toLowerCase())!
      return { srcToken, destToken }
    } else {
      return {}
    }
  }, [transaction.src_chain_id, transaction.dest_chain_id, transaction.token, bridgePairs])
  return (
    <>
      {srcToken && destToken && (
        <HistoryGreyCard>
          <Box style={{ display: 'flex', justifyContent: 'end', paddingRight: '0.5rem', alignItems: 'center' }}>
            <Text width="fit-content">From</Text>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ButtonLight maxWidth="15rem" height="2rem">
              <SelectorLogo interactive={true} src={srcChain!.icon} />
              <SelectorLabel>{srcChain!.name}</SelectorLabel>
            </ButtonLight>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'end', paddingRight: '0.5rem', alignItems: 'center' }}>
            <Text>To</Text>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ButtonLight maxWidth="15rem" height="2rem">
              <SelectorLogo interactive={true} src={destChain!.icon} />
              <SelectorLabel>{destChain!.name}</SelectorLabel>
            </ButtonLight>
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
                    <DarkenedText color="yellow" height="fit-content">
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
                    <DarkenedText color="green" height="fit-content">
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
                    <DarkenedText color="red" height="fit-content">
                      Failed
                    </DarkenedText>
                  </Flex>
                )
            }
          })()}
          <Box></Box>
          <Flex justifyContent="center" alignItems="center">
            <TooltippedAmount amount={new BigNumber(transaction.amount).shiftedBy(-srcToken.decimals).toFixed(4)} AmountText={AmountText} />
            {/* <HistoryGrayText>
              {new BigNumber(transaction.amount).shiftedBy(-srcToken.decimals).toFixed(4)}&nbsp;{srcToken.name}
            </HistoryGrayText> */}
            <UnitText color="green">&nbsp;{srcToken!.name.toUpperCase()}</UnitText>
          </Flex>
          <Box></Box>
          <Flex justifyContent="center" alignItems="center">
            <TooltippedAmount amount={new BigNumber(transaction.amount).shiftedBy(-destToken.decimals).toFixed(4)} AmountText={AmountText} />
            {/* 
            <HistoryGrayText>
              {new BigNumber(transaction.amount).shiftedBy(-destToken.decimals).toFixed(4)}&nbsp;{srcToken.name}
            </HistoryGrayText> */}
            <UnitText color="green">&nbsp;{destToken!.name.toUpperCase()}</UnitText>
          </Flex>
          <Flex justifyContent={'center'} alignItems={'center'}>
            <HistoryGrayDetailText
              onClick={() => {
                openTransactionDetailModal(transaction.send_tx_hash)
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
