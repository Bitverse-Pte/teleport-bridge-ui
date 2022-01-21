// import { Trans } from '@lingui/macro'
import React, { CSSProperties, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { BigNumber } from '@ethersproject/bignumber'
import styled from 'styled-components/macro'
import { isEqualWith } from 'lodash'

import { TokenPair, TokenInfo } from 'constants/types'
import { useActiveWeb3React } from 'hooks/web3'
import { ThemedText } from 'theme'
import Column from 'components/Column'
import Loader from 'components/Loader'
import { SpaceBetweenRow, RowFixed } from 'components/Row'
import { getBalance } from 'helpers/web3'
import { useDispatch } from 'hooks'
import { Balance } from 'components/Currency'
import { StyledLogo } from 'components/Logo'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

function currencyKey(token: TokenInfo): string {
  return token.address || 'ETHER'
}

const MenuItem = styled(SpaceBetweenRow)`
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

function CurrencyRow({ data, index, style }: { data: TokenPair[]; index: number; style: CSSProperties }) {
  const { account, library } = useActiveWeb3React()
  const {
    application: { setSelectedTokenName },
  } = useDispatch()
  const selectedTokenName = useSelector((state: RootState) => state.application.selectedTokenName)
  const token = data[index].srcToken
  const isSelected = useMemo(() => token.name === selectedTokenName, [token.name, selectedTokenName])
  const key = currencyKey(token)
  const [balance, setBalance] = useState<BigNumber | undefined>(undefined)
  useEffect(() => {
    library && account && getBalance(token, library, account).then((res) => setBalance(res))
  }, [token.name])
  // only show add or remove buttons if not on selected list
  return (
    <MenuItem style={style} className={`token-item-${key}`} onClick={() => (isSelected ? null : setSelectedTokenName(token.name))} disabled={isSelected} selected={isSelected}>
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

export default function CurrencyList({ height, tokenPairs, fixedListRef }: { height: number; tokenPairs: TokenPair[]; fixedListRef?: MutableRefObject<FixedSizeList | undefined> }) {
  const itemKey = useCallback((index: number, data: TokenPair[]) => {
    const currency = data[index].srcToken
    if (isBreakLine(currency)) return BREAK_LINE
    return currencyKey(currency)
  }, [])

  return (
    <FixedSizeList height={height} ref={fixedListRef as any} width="100%" itemData={tokenPairs} itemCount={tokenPairs.length} itemSize={56} itemKey={itemKey}>
      {CurrencyRow}
    </FixedSizeList>
  )
}
