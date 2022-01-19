import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import BigNumberJS from 'bignumber.js'
import styled from 'styled-components'
import { ThemedText } from 'theme'
import { TokenInfo } from 'constants/index'

export const StyledBalanceText = styled(ThemedText.White)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

export function Balance({ currency, balance }: { currency: TokenInfo; balance: BigNumber }) {
  return <StyledBalanceText /* title={balance.toExact()} */>{new BigNumberJS(balance.toString()).shiftedBy(-currency.decimals).toFixed(6)}</StyledBalanceText>
}

export * from './CurrencyList'
