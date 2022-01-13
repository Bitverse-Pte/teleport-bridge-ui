import React from 'react'
import styled from 'styled-components'
import CssValueParser from 'parse-unit'

import Logo from 'components/Logo'
import { MEDIA_WIDTHS, DefaultButtonRadius } from 'theme'

const SimpleLogo = styled.img`
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
export const SelectorLogo = styled(SimpleLogo)<{ left?: string; interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  position: absolute;
  left: ${({ left }) => left ?? reservedSpace};
  /*  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    margin-right: 8px;
  } */
`

export const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: radial-gradient(white 50%, #ffffff00 calc(75% + 1px), #ffffff00 100%);
  border-radius: 50%;
  -mox-box-shadow: 0 0 1px black;
  -webkit-box-shadow: 0 0 1px black;
  box-shadow: 0 0 1px black;
  border: 0px solid rgba(255, 255, 255, 0);
`
