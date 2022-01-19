// import { Trans } from '@lingui/macro'
import React, { CSSProperties, MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'
import { isEqualWith } from 'lodash'

import { TokenPairs, TokenInfo } from 'constants/types'
import { useActiveWeb3React } from 'hooks/web3'
import { ThemedText } from 'theme'
import Column from 'components/Column'
import Loader from 'components/Loader'
import { RowBetween, RowFixed } from 'components/Row'
import { useTokenBalance } from 'hooks/wallet'
import { useDispatch } from 'hooks'
import { Balance } from 'components/Currency'
import { StyledLogo } from 'components/Logo'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

function currencyKey(token: TokenInfo): string {
  return token.address || 'ETHER'
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

function CurrencyRow({ token, onSelect, isSelected, style, showCurrencyAmount }: { token: TokenInfo; onSelect: () => void; isSelected: boolean; style: CSSProperties; showCurrencyAmount?: boolean }) {
  const { account } = useActiveWeb3React()
  const key = currencyKey(token)
  const balance = useTokenBalance(token)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem style={style} className={`token-item-${key}`} onClick={() => (isSelected ? null : onSelect())} disabled={isSelected} selected={isSelected}>
      <StyledLogo size={'1.5rem'} srcs={[token.logoURI!]} alt={`${token?.symbol ?? 'token'} logo`} />
      <Column>
        <ThemedText.Main>{token.symbol}</ThemedText.Main>
        <ThemedText.DarkGray ml="0px" fontSize={'12px'} fontWeight={300}>
          {token.name}
        </ThemedText.DarkGray>
      </Column>
      {<RowFixed style={{ justifySelf: 'flex-end' }}>{balance ? <Balance balance={balance} currency={token} /> : account ? <Loader /> : null}</RowFixed>}
    </MenuItem>
  )
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

export default function CurrencyList({ height, tokenPairs, fixedListRef }: { height: number; tokenPairs: TokenPairs[]; fixedListRef?: MutableRefObject<FixedSizeList | undefined> }) {
  const {
    application: { setSelectedTokenName },
  } = useDispatch()
  const selectedTokenName = useSelector((state: RootState) => state.application.selectedTokenName)
  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const { srcToken, name }: TokenPairs = data[index]

      const isSelected = Boolean(srcToken && selectedTokenName && name === selectedTokenName)
      const handleSelect = () => srcToken && setSelectedTokenName(name)

      if (srcToken) {
        return <CurrencyRow style={style} token={srcToken} isSelected={isSelected} onSelect={handleSelect} showCurrencyAmount={true} />
      } else {
        return null
      }
    },
    [tokenPairs.length, selectedTokenName]
  )

  const itemKey = useCallback((index: number, data: TokenPairs[]) => {
    const currency = data[index].srcToken
    if (isBreakLine(currency)) return BREAK_LINE
    return currencyKey(currency)
  }, [])

  return (
    <FixedSizeList height={height} ref={fixedListRef as any} width="100%" itemData={tokenPairs} itemCount={tokenPairs.length} itemSize={56} itemKey={itemKey}>
      {Row}
    </FixedSizeList>
  )
}
