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
import { css } from 'styled-components/macro'

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
    from: { opacity: 0 /* transform: 'translate3d(0,0,100%)' */ },
    enter: { background: ' #2B1010', border: '1px solid #D25958', boxSizing: 'border-box', color: '#D25958' },
    leave: { opacity: 0 /*  transform: 'translate3d(0,0,-50%)' */ },
    // delay: 200,
    // config: config.gentle,
  })
  useEffect(() => {
    transRef.start()
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
    setManuallyAccepted(false)
  }, [estimation])

  return transitions((styles, item) => {
    return (
      <PrimaryButton disabled={disabled} width="100%" fontWeight={900} onClick={clickHandler}>
        <Flex
          css={css`
            width: 100%;
            height: 1rem;
            position: relative;
            > div {
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              will-change: transform, opacity;
              -webkit-user-select: none;
              user-select: none;
            }
          `}
        >
          <animated.div style={{ ...styles }}>{text}</animated.div>
        </Flex>
      </PrimaryButton>
    )
  })
}
