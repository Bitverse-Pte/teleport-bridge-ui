import React, { useCallback, useEffect } from 'react'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { transparentize } from 'polished'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { useGesture } from 'react-use-gesture'
import styled, { css } from 'styled-components/macro'

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
    background-color: ${({ theme }) => theme.modalBG};
  }
  backdrop-filter: blur(10px);
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ maxWidth, minHeight, maxHeight, mobile, isOpen, ...rest }) => <AnimatedDialogContent {...rest} />).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: auto;
  &[data-reach-dialog-content] {
    height: fit-content;
    margin: 0;
    background-color: ${({ theme }) => theme.bg0};
    border: 1px solid ${({ theme }) => theme.bg1};
    box-shadow: 0 5px 10px 0 ${({ theme }) => transparentize(0.2, theme.shadow1)};
    padding: 0px;
    width: 55vw;
    overflow-y: auto;
    overflow-x: hidden;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    max-width: ${({ maxWidth }) => maxWidth ?? '420px'};
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
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
  minHeight?: number | false
  maxWidth?: number | string
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  closeByKeyboard?: boolean
  setIsOpen?(openOrNot: boolean): void
}

export default function UniModal({ isOpen, setIsOpen, onDismiss, minHeight = 30, maxWidth, maxHeight = 90, initialFocusRef, children, closeByKeyboard }: ModalProps) {
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
  useEffect(() => {
    if (closeByKeyboard) {
      document.addEventListener('keyup', escapeOnEscUp)
    }
    return () => {
      if (closeByKeyboard) {
        document.removeEventListener('keyup', escapeOnEscUp)
      }
    }
  }, [isOpen])

  const fadeTransition = useTransition(isOpen, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  const escapeOnEscUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.which == 27 && isOpen && setIsOpen) {
        setIsOpen(false)
      }
    },
    [isOpen]
  )

  return fadeTransition(
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
            mobile={false}
          >
            {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
            {/* {!initialFocusRef && false ? <div tabIndex={1} /> : null} */}
            {children}
          </StyledDialogContent>
        </StyledDialogOverlay>
      )
  )
}

export const UniModalContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  display: flex;
  padding: 1rem 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 100%;
  // min-height: 61.8vh;
  max-height: calc(100% - 20px);
`
