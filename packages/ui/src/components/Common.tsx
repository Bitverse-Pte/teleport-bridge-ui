import React from 'react'
import styled from 'styled-components'
import CssValueParser from 'parse-unit'

import { MEDIA_WIDTHS, DefaultButtonRadius } from 'theme'

export const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`
export const NetworkLabel = styled.div`
  flex: 1 1 auto;
`
export const SelectorLabel = styled(NetworkLabel)`
  display: none;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    // margin-right: 8px;
  }
`

const [digit, unit] = CssValueParser(DefaultButtonRadius)
const reservedSpace = `${digit / 2}${unit ?? 'px'}`
export const SelectorLogo = styled(Logo)<{ left?: string; interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  position: absolute;
  left: ${({ left }) => left ?? reservedSpace};
  /*  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    margin-right: 8px;
  } */
`
