import React from 'react'
import styled from 'styled-components'
import { XCircle } from 'react-feather'

export const CircledCloseIcon = styled(XCircle)`
  position: absolute;
  transform: translate(-10px, 10px);
  color: ${({ theme }) => theme.primary1};
  path {
    stroke: ${({ theme }) => theme.primary1};
  }
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
