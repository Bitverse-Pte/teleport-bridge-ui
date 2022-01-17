import React from 'react'
import { Flex } from 'rebass'
import styled, { keyframes, css } from 'styled-components'

const rotate360 = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`

export const BaseSpinner = styled.div<{ warning: boolean; size: string }>`
  animation: ${rotate360} 1.618s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 0.1618rem solid transparent;
  border-right: 0.1618rem solid transparent;
  border-bottom: 0.1618rem solid transparent;
  border-left: 0.1618rem solid ${({ theme, warning }) => (warning ? theme.yellow3 : theme.green1)};
  background: transparent;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
`

export default function Spinner({ warning, size = '2rem' }: { warning: boolean; size?: string | number }) {
  return (
    <Flex
      css={css`
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        width: 100%;
        height: 100%;
        z-index: 999;
      `}
      justifyContent="center"
      alignItems="center"
    >
      <BaseSpinner warning={warning} size={`${size}`} />
    </Flex>
  )
}
