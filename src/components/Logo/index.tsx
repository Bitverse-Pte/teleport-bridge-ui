import React, { useState } from 'react'
import { Slash } from 'react-feather'
import CssValueParser from 'parse-unit'
import { Flex, FlexProps, ImageProps } from 'rebass'
import styled, { css } from 'styled-components'
import { remToPx } from 'polished'

import { MEDIA_WIDTHS, DefaultButtonRadius } from 'theme'
import { useTheme } from 'hooks/useTheme'
import Image from 'components/Image'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: Array<string | StaticImageData>
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export function StyledLogo({ srcs, alt, size, style, isSelected, ...rest }: { isSelected?: boolean; size: string } & LogoProps) {
  const [, refresh] = useState<number>(0)

  const theme = useTheme()

  const src: string | StaticImageData | undefined = srcs.find((src) => {
    if (typeof src === 'string') {
      return !BAD_SRCS[src]
    } else {
      return !BAD_SRCS[src.src]
    }
  })

  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      css={css`
        height: ${size};
        width: ${size};
        min-height: ${size}!important;
        min-width: ${size}!important;
        background: radial-gradient(white 50%, #ffffff00 calc(75% + 1px), #ffffff00 100%);
        border-radius: 50%;
        -mox-box-shadow: 0 0 1px black;
        -webkit-box-shadow: 0 0 1px black;
        box-shadow: 0 0 1px black;
        border: 0px solid rgba(255, 255, 255, 0);
        ${isSelected &&
        `
            -mox-box-shadow: 0 0 ${size} ${theme.green1};
            -webkit-box-shadow: 0 0 ${size} ${theme.green1};
            box-shadow: 0 0 ${size} ${theme.green1};
        `}
        span {
          border-radius: 50% !important;
        }
      `}
    >
      {src && (
        <Image
          {...rest}
          alt={alt}
          height={size.endsWith('rem') ? remToPx(size) : size}
          width={size.endsWith('rem') ? remToPx(size) : size}
          src={src}
          onError={() => {
            if (src) BAD_SRCS[typeof src === 'string' ? src : src.src] = true
            refresh((i) => i + 1)
          }}
        />
      )}
      {!src && <Slash {...rest} style={{ ...style, color: theme.bg4 }} />}
    </Flex>
  )
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

// export const StyledLogo = styled(
//   Logo /* ({ size, isSelected, style, ...rest }) => (
//   <Box>
//     <Logo size={size} {...rest} />
//   </Box>
// ) */
// )<{ size: string; isSelected?: boolean }>`
//   div {
//     height: ${({ size }) => size};
//     width: ${({ size }) => size};
//     background: radial-gradient(white 50%, #ffffff00 calc(75% + 1px), #ffffff00 100%);
//     border-radius: 50%;
//     -mox-box-shadow: 0 0 1px black;
//     -webkit-box-shadow: 0 0 1px black;
//     box-shadow: 0 0 1px black;
//     border: 0px solid rgba(255, 255, 255, 0);
//     ${({ isSelected, theme, size }) =>
//       isSelected &&
//       `
//         -mox-box-shadow: 0 0 ${size} ${theme.green1};
//         -webkit-box-shadow: 0 0 ${size} ${theme.green1};
//         box-shadow: 0 0 ${size} ${theme.green1};
//     `}
//     span {
//       border-radius: 50% !important;
//     }
//   }
// `
