import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useTransition, config, animated, useSprings, useSpringRef, AnimatedProps } from '@react-spring/web'
import { BaseSpinner, TransitionSpinner } from 'components/Spinner'
import { PrimaryButton } from '.'
import { TRANSFER_STATUS } from 'constants/types'
import { useDispatch } from 'hooks'
import BigNumber from 'bignumber.js'
import { Flex } from 'rebass'
import styled, { css } from 'styled-components/macro'
import { darken } from 'polished'

const StyledAnimatedBtn = styled(animated.button)`
  border-radius: 0.5rem;
  width: 100%;
  font-weight: 900;
  background-color: ${({ backgroundColor }) => backgroundColor};
  &:hover {
    background-color: ${({ backgroundColor }) => darken(0.05, backgroundColor)};
  }
`

const Wrapper = styled.div`
  width: 100%;
  height: 3rem;
  position: relative;
  display: flex;
  > button {
    position: absolute;
    cursor: pointer;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    will-change: transform, opacity;
    -webkit-user-select: none;
    user-select: none;
  }
`

export const TransferConfirmationButton = function ({ accepted = true }: { accepted?: boolean }) {
  const { transferStatus, estimation } = useSelector((state: RootState) => {
    const { transferStatus, estimation } = state.application
    return { transferStatus, estimation }
  })
  const {
    application: { transferTokens },
  } = useDispatch()

  const [manuallyAccepted, setManuallyAccepted] = useState(accepted)
  const transRef = useSpringRef()
  const transitions = useTransition(manuallyAccepted, {
    // from: { opacity: 1 },
    // to: { opacity: 0 },
    ref: transRef,
    keys: null,
    config: { ...config.gentle, duration: 400 },
    from: { opacity: 0 /* backgroundColor: '#00c6a9', color: 'white'  */ /* transform: 'translate3d(0,0,100%)' */ },
    enter: { opacity: 1 /* , backgroundColor: '#2B1010', color: '#D25958', border: '1px solid #D25958', boxSizing: 'border-box' */ },
    leave: { opacity: 0 /*  transform: 'translate3d(0,0,-50%)' */ },
    delay: 200,
    // config: config.gentle,
  })
  useEffect(() => {
    transRef.start()
    return () => {
      transRef.stop()
    }
  }, [manuallyAccepted])

  const transfer = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READYTOTRANSFER) {
      const input = document.getElementById('fromValueInput')
      input && transferTokens({ amount: (input as HTMLInputElement)!.value })
    }
  }, [transferStatus])

  const disabled = useMemo(() => {
    return false //to do
  }, [estimation])

  const text = useMemo(() => {
    if (estimation.rate && manuallyAccepted) {
      return 'Confirm'
    } else if (!disabled) {
      return 'Accept'
    } else {
      return 'Confirm'
    }
  }, [estimation, disabled, manuallyAccepted])

  const clickHandler = useCallback(() => {
    if (text === 'Accept') {
      setManuallyAccepted(true)
    }
    if (text === 'Confirm') {
      transfer()
    }
  }, [text, transferStatus])

  useEffect(() => {
    setManuallyAccepted((pre) => !pre)
  }, [estimation])

  return (
    <Wrapper>
      {transitions((styles, item) => {
        return (
          <>
            {item ? (
              <StyledAnimatedBtn disabled={disabled} backgroundColor={'#00c6a9'} style={{ /* backgroundColor: '#00c6a9', */ color: 'white', ...styles }} onClick={clickHandler}>
                <animated.div>{text}</animated.div>
              </StyledAnimatedBtn>
            ) : (
              <StyledAnimatedBtn disabled={disabled} backgroundColor={'#2B1010'} style={{ border: '1px solid #D25958', /*  backgroundColor: '#2B1010', */ color: '#D25958', ...styles }} onClick={clickHandler}>
                <animated.div>{text}</animated.div>
              </StyledAnimatedBtn>
            )}
          </>
        )
      })}
      )
    </Wrapper>
  )
}
