import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import BigNumberJS from 'bignumber.js'
import styled from 'styled-components'
import { Text } from 'rebass'
// import { ThemedText } from 'theme'
import { TokenInfo } from 'constants/index'
import { WhiteText } from 'components/Text'

export function Balance({ currency, balance }: { currency: TokenInfo; balance: BigNumber }) {
  return <WhiteText /* title={balance.toExact()} */>{new BigNumberJS(balance.toString()).shiftedBy(-currency.decimals).toFixed(4)}</WhiteText>
}

export * from './CurrencyList'
