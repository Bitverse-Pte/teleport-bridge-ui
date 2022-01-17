import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Text, Box, Flex } from 'rebass'
import { GreyCard, DarkGreyCard } from 'components/Card'
import { IChainData, ICurrency, Overwrite } from 'helpers'
import BigNumber from 'bignumber.js'
import { SelectorLogo } from 'components/Logo'
import { ButtonLight } from 'components/Button'
import { SupportedChains } from 'constants/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { SelectorLabel } from 'components/Label'

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

export default function HistoryRecord() {
  const { chainId } = useActiveWeb3React()
  const chainData = SupportedChains.get(chainId!)
  return (
    <>
      <HistoryGreyCard>
        <Box style={{ display: 'flex', justifyContent: 'end', paddingRight: '0.5rem', alignItems: 'center' }}>
          <Text width="fit-content">From</Text>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ButtonLight maxWidth="15rem" height="2rem">
            <SelectorLogo interactive={true} src={chainData!.logo} />
            <SelectorLabel>{chainData?.name}</SelectorLabel>
          </ButtonLight>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'end', paddingRight: '0.5rem', alignItems: 'center' }}>
          <Text>To</Text>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ButtonLight maxWidth="15rem" height="2rem">
            <SelectorLogo interactive={true} src={chainData!.logo} />
            <SelectorLabel>{chainData?.name}</SelectorLabel>
          </ButtonLight>
        </Box>
        <Flex justifyContent="center" alignItems="center">
          <CircleWrapper>
            <GreenCircle>
              <div />
            </GreenCircle>
          </CircleWrapper>
          <DarkenedText height="fit-content">Success</DarkenedText>
        </Flex>
        <Box></Box>
        <Flex justifyContent="center" alignItems="center">
          <Text height="fit-content" fontWeight={600}>
            15 USDT
          </Text>
        </Flex>
        <Box></Box>
        <Flex justifyContent="center" alignItems="center">
          <Text height="fit-content" fontWeight={600}>
            14.99998 USDT
          </Text>
        </Flex>
        <Box></Box>
      </HistoryGreyCard>
      {/*  <DarkGreyCard /> */}
    </>
  )
}
