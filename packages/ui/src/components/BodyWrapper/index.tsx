import React from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'
import { MEDIA_WIDTHS, Z_INDEX } from 'theme'

export const MarginTopForBodyContent = function () {
  return <Flex height={'7.5rem'}></Flex>
}

export const BodyWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  display: flex;
  width: 50vw;
  margin-top: ${({ margin }) => margin ?? '0px'};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 50vw;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 67vw;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 89vw;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90vw;
  `}
  @media (min-width: ${MEDIA_WIDTHS.upToLarge}px) {
    max-width: 640px;
  }
  background: linear-gradient(59.39deg, rgba(36, 36, 36, 0.4) 2.83%, rgba(25, 24, 27, 0.45) 98.01%);
  backdrop-filter: blur(2px);
  border-radius: 1rem;
  padding: 1.5rem;
  min-height: 20rem;
  max-height: calc(100% - 100px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  z-index: ${Z_INDEX.deprecated_zero};
`
