import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import BigNumberJS from 'bignumber.js'
import styled from 'styled-components'
import { Text } from 'rebass'
// import { ThemedText } from 'theme'
import { TokenInfo } from 'constants/index'
import { WhiteText } from 'components/Text'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import { TextWrapper } from 'theme'

export function Balance({ currency, balance, matchCurrentToken = false }: { currency: TokenInfo; balance: BigNumber; matchCurrentToken?: boolean }) {
  const { selectedTokenName } = useSelector((state: RootState) => {
    const { selectedTokenName } = state.application
    return { selectedTokenName }
  })
  return <TextWrapper color={selectedTokenName === currency.name && matchCurrentToken ? 'green1' : 'white'} /* title={balance.toExact()} */>{new BigNumberJS(balance.toString()).shiftedBy(-currency.decimals).toFixed(4)}</TextWrapper>
}

export * from './CurrencyList'
