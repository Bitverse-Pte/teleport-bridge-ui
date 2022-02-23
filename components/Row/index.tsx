import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Row = styled(Box)<{
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export const SpaceBetweenRow = styled(Row)`
  justify-content: space-between;
`

export const HorizontalCenterRow = styled(Row)`
  justify-content: center;
`
export const HorizontalSpaceAroundRow = styled(Row)`
  justify-content: space-around;
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`
