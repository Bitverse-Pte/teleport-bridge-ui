import React from 'react'
import styled from 'styled-components'
import { MEDIA_WIDTHS } from 'theme'

export const NetworkLabel = styled.div`
  font-size: 1rem;
  flex: 1 1 auto;
`
export const SelectorLabel = styled(NetworkLabel)`
  display: none;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    // margin-right: 8px;
  }
`
