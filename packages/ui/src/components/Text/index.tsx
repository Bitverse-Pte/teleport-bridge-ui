import React from 'react'
import styled from 'styled-components/macro'
import { Text } from 'rebass'
import { ThemedText } from 'theme'

export const Text1 = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-size: 1.25rem;
  line-height: 1.625rem;
  text-transform: capitalize;
  color: #ffffff;
`

export const Text2 = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.4375rem;
  text-transform: capitalize;
  color: rgba(255, 255, 255, 0.45);
`

export const Text3 = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-size: 1.25rem;
  line-height: 1.625rem;
  text-transform: capitalize;
  color: #e9e9e9;
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

export const PrimaryText = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: ${({ fontWeight }) => String(fontWeight) ?? 500};
  font-size: ${({ fontSize }) => String(fontSize) ?? '26px'};
  line-height: ${({ lineHeight }) => String(lineHeight) ?? '34px'};
  text-align: center;
  text-transform: capitalize;
`

export const WhiteText = styled(ThemedText.White)`
  white-space: nowrap;
  color: #018d79;
  overflow: hidden;
  max-width: 5rem;
  // text-overflow: ellipsis;
`
export const DarkGreenText = styled(Text)`
  white-space: nowrap;
  color: #018d79;
  overflow: hidden;
  max-width: 5rem;
  // text-overflow: ellipsis;
`
