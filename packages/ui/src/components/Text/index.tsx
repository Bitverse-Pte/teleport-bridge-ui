import React from 'react'
import styled from 'styled-components/macro'
import { Text } from 'rebass'

export const Text1 = styled(Text)`
  color: ${({ theme }) => theme.text1};
`

export const StyledText = styled.p`
  flex: 1 1 auto;
  color: ${({ theme }) => theme.text1};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 600;
`

export const TextPrimary1 = styled(Text)`
  color: ${({ theme }) => theme.primary1};
`
