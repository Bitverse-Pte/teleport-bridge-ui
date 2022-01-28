import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Text, Box, Flex } from 'rebass'
import { GreyCard, DarkGreyCard } from 'components/Card'
import { IChainData, ICurrency, Overwrite, TransactionDetail, TRANSACTION_STATUS } from 'constants/index'
import BigNumber from 'bignumber.js'
import { SelectorLogo } from 'components/Logo'
import { ButtonLight } from 'components/Button'
import { SupportedChains } from 'constants/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { SelectorLabel } from 'components/Label'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

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

const DarkenedText = styled(Text)`
  color: ${({ theme }) => darken(0.3, theme.text2)};
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
  const { availableChains } = useSelector((state: RootState) => {
    const { availableChains } = state.application
    return { availableChains }
  })
  const srcChain = useMemo(() => {
    return availableChains.get(+transaction.src_chain)
  }, [availableChains, transaction.src_chain])
  const destChain = useMemo(() => {
    return availableChains.get(+transaction.dest_chain)
  }, [availableChains, transaction.dest_chain])
  return (
    <>
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
                  <DarkenedText height="fit-content">Pending</DarkenedText>
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
                  <DarkenedText height="fit-content">Success</DarkenedText>
                </Flex>
              )
              break
            case TRANSACTION_STATUS.FAILED:
              return (
                <Flex justifyContent="center" alignItems="center">
                  <CircleWrapper>
                    <RedCircle>
                      <div />
                    </RedCircle>
                  </CircleWrapper>
                  <DarkenedText height="fit-content">Failed</DarkenedText>
                </Flex>
              )
              break
          }
        })()}
        <Box></Box>
        <Flex justifyContent="center" alignItems="center">
          <Text height="fit-content" fontWeight={600}>
            {transaction.amount}&nbsp;{transaction.token}
          </Text>
        </Flex>
        <Box></Box>
        <Flex justifyContent="center" alignItems="center">
          <Text height="fit-content" fontWeight={600}>
            {transaction.amount}&nbsp;{transaction.token}
          </Text>
        </Flex>
        <Box></Box>
      </HistoryGreyCard>
      {/*  <DarkGreyCard /> */}
    </>
  )
}
