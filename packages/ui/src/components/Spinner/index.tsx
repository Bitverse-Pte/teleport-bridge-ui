import { PrimaryButton } from 'components/Button'
import React, { HTMLProps, ReactPropTypes } from 'react'
import { useTransition, config, animated } from '@react-spring/web'
import reactVirtualizedAutoSizer from 'react-virtualized-auto-sizer'
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
  border-left: 0.1618rem solid ${({ theme, warning }) => (warning ? theme.yellow3 : theme.white)};
  background: transparent;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
`

/* 
const transitions = useTransition(pending, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: pending,
    delay: 200,
    config: config.molasses,
    onRest: () => setPending(!pending),
  })
  return (
    <PrimaryButton width="100%" fontWeight={900} onClick={onClick}>
      {transitions(
        ({ opacity }, item) =>
          item && (
            <animated.div style={{ opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }) }}>
              <BaseSpinner warning={false} size={'1rem'}></BaseSpinner>
            </animated.div>
          )
      )}
      &nbsp;
      {connectStatus ? 'Transfer' : 'Connect'}
    </PrimaryButton>
  )
*/

export const TransitionSpinner = function ({ show, ...rest }: { show: boolean } & HTMLProps<HTMLDivElement>) {
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    // reverse: show,
    config: config.molasses,
    // onRest: () => setPending(!pending),
  })
  return (
    <>
      {transitions(
        ({ opacity }, item) =>
          item && (
            <animated.div style={{ ...rest.style, opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }) }}>
              <BaseSpinner warning={false} size={'1rem'}></BaseSpinner>
            </animated.div>
          )
      )}
    </>
  )
}

export const TransitionSpinnerMask = function ({ show, children, ...rest }: { show: boolean } & HTMLProps<HTMLDivElement>) {
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: show,
    config: config.molasses,
    // onRest: () => setPending(!pending),
  })
  return (
    <>
      {transitions(
        ({ opacity }, item) =>
          item && (
            <animated.div style={{ ...rest.style, opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }), position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BaseSpinner warning={false} size={'2rem'}></BaseSpinner>
              {children}
            </animated.div>
          )
      )}
    </>
  )
}

export default function Spinner({ warning = false, size = '2rem', children }: { warning?: boolean; size?: string | number } & { children?: React.ReactNode }) {
  return (
    <Flex
      css={css`
        position: absolute;
        background-color: rgba(0, 0, 0, 0.425);
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
        z-index: 999;
        > * {
          use-select: none;
        }
      `}
      justifyContent="center"
      flexDirection={'column'}
      alignItems="center"
    >
      <BaseSpinner warning={warning} size={`${size}`} />
      {children && children}
    </Flex>
  )
}
