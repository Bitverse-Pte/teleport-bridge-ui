import React from 'react'
import { AlertCircle } from 'react-feather'
import styled from 'styled-components'

export const AlertIcon = styled(AlertCircle)`
  color: ${({ theme }) => theme.primary1};
  path {
    stroke: ${({ theme }) => theme.primary1};
  }
`
