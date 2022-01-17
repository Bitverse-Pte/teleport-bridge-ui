import React, { useState } from 'react'
import { Slash } from 'react-feather'
import CssValueParser from 'parse-unit'
import { ImageProps } from 'rebass'
import styled from 'styled-components'

import { MEDIA_WIDTHS, DefaultButtonRadius } from 'theme'
import { useTheme } from 'hooks/useTheme'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, style, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  const theme = useTheme()

  const src: string | undefined = srcs.find((src) => !BAD_SRCS[src])

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        style={style}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <Slash {...rest} style={{ ...style, color: theme.bg4 }} />
}

const SimpleLogo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
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
