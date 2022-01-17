// import { Trans } from '@lingui/macro'
import React, { CSSProperties, MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'
import { isEqualWith } from 'lodash'

import { TokenInfo as Currency } from 'helpers/types'
import { useActiveWeb3React } from 'hooks/web3'
import { ThemedText } from 'theme'
import Column from 'components/Column'
import Loader from 'components/Loader'
import { RowBetween, RowFixed } from 'components/Row'
import { useTokenBalance } from 'hooks/wallet'
import { useDispatch } from 'hooks'
import { Balance } from 'components/Currency'
import { StyledLogo } from 'components/Logo'

function currencyKey(currency: Currency): string {
  return currency.address || 'ETHER'
}

const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg2};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  style,
  showCurrencyAmount,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
  showCurrencyAmount?: boolean
}) {
  const { account } = useActiveWeb3React()
  const key = currencyKey(currency)
  const balance = useTokenBalance(currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem style={style} className={`token-item-${key}`} onClick={() => (isSelected ? null : onSelect())} disabled={isSelected} selected={isSelected}>
      <StyledLogo size={'1.5rem'} srcs={[currency.logoURI!]} alt={`${currency?.symbol ?? 'token'} logo`} />
      <Column>
        <ThemedText.Main>{currency.symbol}</ThemedText.Main>
        <ThemedText.DarkGray ml="0px" fontSize={'12px'} fontWeight={300}>
          {currency.name}
        </ThemedText.DarkGray>
      </Column>
      {<RowFixed style={{ justifySelf: 'flex-end' }}>{balance ? <Balance balance={balance} currency={currency} /> : account ? <Loader /> : null}</RowFixed>}
    </MenuItem>
  )
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

export default function CurrencyList({
  height,
  currencies,

  selectedCurrency,
  fixedListRef,
}: {
  height: number
  currencies: Currency[]

  selectedCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}) {
  const {
    application: { setSelectedCurrency },
  } = useDispatch()
  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const token: Currency = data[index]

      const isSelected = Boolean(
        token &&
          selectedCurrency &&
          isEqualWith(selectedCurrency, token, (a, b) => {
            return a.chainId === b.chainId && a.address === b.address
          })
      )
      const handleSelect = () => token && setSelectedCurrency(token)

      if (token) {
        return <CurrencyRow style={style} currency={token} isSelected={isSelected} onSelect={handleSelect} showCurrencyAmount={true} />
      } else {
        return null
      }
    },
    [currencies.length, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: typeof currencies) => {
    const currency = data[index]
    if (isBreakLine(currency)) return BREAK_LINE
    return currencyKey(currency)
  }, [])

  return (
    <FixedSizeList height={height} ref={fixedListRef as any} width="100%" itemData={currencies} itemCount={currencies.length} itemSize={56} itemKey={itemKey}>
      {Row}
    </FixedSizeList>
  )
}
