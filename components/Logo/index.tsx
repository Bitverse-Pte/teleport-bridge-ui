import React, { useState } from 'react'
import { Slash } from 'react-feather'
import CssValueParser from 'parse-unit'
import { Box, ImageProps } from 'rebass'
import styled from 'styled-components'
import { remToPx } from 'polished'

import { MEDIA_WIDTHS, DefaultButtonRadius } from 'theme'
import { useTheme } from 'hooks/useTheme'
import Image from 'next/image'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, size, style, ...rest }: { size: string } & LogoProps) {
  const [, refresh] = useState<number>(0)

  const theme = useTheme()

  const src: string | undefined = srcs.find((src) => !BAD_SRCS[src])

  if (src) {
    return (
      <Box style={style} height={size} width={size}>
        <Image
          {...rest}
          alt={alt}
          height={size.endsWith('rem') ? remToPx(size) : size}
          width={size.endsWith('rem') ? remToPx(size) : size}
          src={src}
          onError={() => {
            if (src) BAD_SRCS[src] = true
            refresh((i) => i + 1)
          }}
        />
      </Box>
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

export const StyledLogo = styled(({ size, isSelected, ...rest }) => <Logo size={size} {...rest} />)<{ size: string; isSelected?: boolean }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: radial-gradient(white 50%, #ffffff00 calc(75% + 1px), #ffffff00 100%);
  border-radius: 50%;
  -mox-box-shadow: 0 0 1px black;
  -webkit-box-shadow: 0 0 1px black;
  box-shadow: 0 0 1px black;
  border: 0px solid rgba(255, 255, 255, 0);
  ${({ isSelected, theme, size }) =>
    isSelected &&
    `
    -mox-box-shadow: 0 0 ${size} ${theme.green1};
    -webkit-box-shadow: 0 0 ${size} ${theme.green1};
    box-shadow: 0 0 ${size} ${theme.green1};
  `}
`
