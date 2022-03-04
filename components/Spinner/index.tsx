import React, { HTMLProps, useCallback, useEffect, useState } from 'react'
import { useTransition, config, animated, useSpringRef } from '@react-spring/web'
import CircularProgress from '@mui/material/CircularProgress'
import { transparentize } from 'polished'
import LinearProgress from '@mui/material/LinearProgress'
import { Flex } from 'rebass'
import Modal from '@mui/material/Modal'
import Fade, { FadeProps } from '@mui/material/Fade'
import styled, { keyframes, css } from 'styled-components'

import { CloseIcon } from 'components/Icon'
import { StyledModalOverlay } from 'components/Modal'

const rotate360 = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`

export const BaseSpinner = styled.div<{ color?: string; warning?: boolean; size: string }>`
  animation: ${rotate360} 1.618s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);
  border-top: 0.1618rem solid transparent;
  border-right: 0.1618rem solid transparent;
  border-bottom: 0.1618rem solid transparent;
  border-left: 0.1618rem solid ${({ theme, color, warning }) => (warning ? theme.yellow3 : color ? color : theme.white)};
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

export const TransitionSpinner = function ({ show, size = '1rem', type = 'circular', color = 'white', ...rest }: { show: boolean; type?: 'linear' | 'circular'; size?: string | number } & Omit<FadeProps, 'children'>) {
  return (
    <Fade in={show} {...rest}>
      <Flex width="100%" color={transparentize(0.2, color)}>
        {type === 'circular' && <CircularProgress thickness={6} size={size} color="inherit" disableShrink />}
        {type === 'linear' && <LinearProgress color={'inherit'} style={{ width: '100%' }} />}
      </Flex>
    </Fade>
  )
}

export const TransitionSpinnerMask = function ({ show, children, ...rest }: { show: boolean } & HTMLProps<HTMLDivElement>) {
  return (
    <Fade in={show}>
      <Flex color="white" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size="2rem" color="inherit" disableShrink />
        {children}
      </Flex>
    </Fade>
  )
}

export default function Spinner({ showSpinner, setShowSpinner, closable = false, warning = false, size = '2rem', children }: { showSpinner: boolean; setShowSpinner?: (showSpinner: boolean) => void; closable?: boolean; warning?: boolean; size?: string | number } & { children?: React.ReactNode }) {
  const [showClose, setShowClose] = useState(false)
  const [timerId, setTimerId] = useState<number>()

  const timerHandler = useCallback(() => {
    !!(timerId === 0 || timerId) && setShowClose(true)
    !!(timerId === 0 || timerId) && setTimerId(0)
  }, [timerId])

  useEffect(() => {
    if (!showSpinner) {
      window.clearTimeout(timerId)
      setShowClose(false)
      setTimerId(0)
    }
    if (showSpinner && !timerId) {
      const timer = window.setTimeout(timerHandler, 10 * 1000)
      setTimerId(timer)
    }
    return () => {
      window.clearTimeout(timerId)
    }
  }, [showSpinner, timerId, timerHandler])

  return (
    <Modal
      open={showSpinner}
      // onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={showSpinner}>
        <StyledModalOverlay>
          <Flex flexDirection={'column'} justifyContent="center" alignItems={'center'} color="white">
            {/* <BaseSpinner warning={warning} size={`${size}`} /> */}
            <CircularProgress size="2rem" color="inherit" disableShrink />
            <Flex width={'100%'} height={'1rem'}></Flex>
            {children && children}
            {closable && (
              <Fade in={showClose} style={{ marginTop: '1rem' }}>
                <CloseIcon
                  onClick={() => {
                    setShowClose(false)
                    setShowSpinner && setShowSpinner(false)
                  }}
                />
              </Fade>
            )}
          </Flex>
        </StyledModalOverlay>
        {/*  
          <BaseSpinner warning={warning} size={`${size}`} />
          <Flex width={'100%'} height={'1rem'}></Flex>
          {children && children}
          {closable &&
            closeTransitions(
              ({ opacity: innerOpacity }, innerItem) =>
                innerItem && (
                  <animated.div style={{ opacity: innerOpacity.to({ range: [0.0, 1.0], output: [0, 1] }) }}>
                    <CloseIcon
                      onClick={() => {
                        setShow(false)
                        setShowSpinner && setShowSpinner(false)
                      }}
                    />
                  </animated.div>
                )
            )}
        </> */}
      </Fade>
    </Modal>
  )
}
