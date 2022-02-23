import React, { useCallback, useEffect, useState } from 'react'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { transparentize } from 'polished'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { useGesture } from 'react-use-gesture'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass'
import { delay } from 'lodash'

import { StyledText } from 'components/Text'
import { CircledCloseIcon } from 'components/Icon'
import { TRANSITION_DURATION } from 'constants/index'

// import { isMobile } from '../../utils/userAgent'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: transparent;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: ${({ theme }) => theme.modalBG};
    background: linear-gradient(to bottom left, rgba(46 48 48 / 40%), rgba(35 35 38 / 45%));
  }
  backdrop-filter: blur(10px);
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ maxWidth, minHeight, maxHeight, minWidth, mobile, isOpen, ...rest }) => <AnimatedDialogContent {...rest} />).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: auto;
  &[data-reach-dialog-content] {
    height: fit-content;
    margin: 0;
    background-color: ${({ theme }) => theme.bg0};
    border: 1px solid ${({ theme }) => theme.bg1};
    box-shadow: 0 0 1px 1px ${({ theme }) => transparentize(0.2, theme.shadow1)};
    padding: 0px;
    width: 55vw;
    overflow-y: auto;
    overflow-x: hidden;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    max-width: ${({ maxWidth }) => maxWidth ?? '420px'};
    ${({ minWidth }) => (minWidth ? `min-width: ${minWidth}` : '')};
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${typeof maxHeight === 'number' ? maxHeight + 'vh' : maxHeight};
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${typeof minHeight === 'number' ? minHeight + 'vh' : minHeight};
      `}
    display: flex;
    border-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${
        mobile &&
        css`
          width: 100vw;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      }
    `}
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false | string
  maxWidth?: number | string
  maxHeight?: number | string
  minWidth?: number | string
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  closeByKeyboard?: boolean
  setIsOpen?(openOrNot: false): any
  title: string
}

export default function UniModal({ isOpen, setIsOpen, onDismiss, minHeight = 30, maxWidth, minWidth, maxHeight = 90, initialFocusRef, children, closeByKeyboard, title }: ModalProps) {
  /*   const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: (state) => {
      set({
        y: state.down ? state.movement[1] : 0,
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    },
  }) */
  const [inClose, setInClose] = useState(false)
  const [wrappedIsOpen, setWrappedIsOpen] = useState(isOpen)

  const fadeTransition = useTransition(wrappedIsOpen, {
    config: { duration: TRANSITION_DURATION },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const closeModal = useCallback(() => {
    if (!inClose) {
      setInClose(true)
      setWrappedIsOpen(false)
      setTimeout(() => setIsOpen && setIsOpen(false), TRANSITION_DURATION)
    }
  }, [inClose, wrappedIsOpen])
  const escapeOnEscUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.which == 27 && isOpen && setIsOpen) {
        closeModal()
      }
    },
    [isOpen]
  )
  useEffect(() => {
    if (closeByKeyboard) {
      document.addEventListener('keyup', escapeOnEscUp)
    }
    if (!isOpen) {
      if (!inClose) {
        setInClose(true)
      }
      setWrappedIsOpen(false)
    }

    return () => {
      if (closeByKeyboard) {
        document.removeEventListener('keyup', escapeOnEscUp)
      }
    }
  }, [isOpen, title, inClose, wrappedIsOpen])

  return (
    <>
      {fadeTransition(
        (styles, item) =>
          item && (
            <StyledDialogOverlay /* key={key}  */ style={styles} onDismiss={onDismiss} initialFocusRef={initialFocusRef} unstable_lockFocusAcrossFrames={false}>
              <StyledDialogContent
                // {...(isMobile
                //   ? {
                //       ...bind(),
                //       style: { transform: y.interpolate((y) => `translateY(${(y as number) > 0 ? y : 0}px)`) },
                //     }
                //   : {})}
                aria-label="dialog content"
                maxWidth={maxWidth}
                minHeight={minHeight}
                maxHeight={maxHeight}
                minWidth={minWidth}
                mobile={false}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {/* {!initialFocusRef && false ? <div tabIndex={1} /> : null} */}
                <Flex flexDirection="column" width="100%" overflow="hidden">
                  <Flex height="40px" width="100%" justifyContent="flex-end">
                    <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                      <a>{title}</a>
                    </StyledText>
                    <CircledCloseIcon id={title.split(' ').join('-') + '-' + 'close-btn'} onClick={closeModal} />
                  </Flex>
                  {children}
                </Flex>
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}

export const UniModalContentWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.bg0};
  display: flex;
  padding: 1rem 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 100%;
  // min-height: 61.8vh;
  max-height: calc(100% - 40px);
`
