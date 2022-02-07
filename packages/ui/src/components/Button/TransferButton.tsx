import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useTransition, config, animated, useSprings, useSpringRef, AnimatedProps } from '@react-spring/web'
import { BaseSpinner, TransitionSpinner } from 'components/Spinner'
import { PrimaryButton } from '.'
import { TRANSFER_STATUS } from 'constants/types'
import { useDispatch } from 'hooks'
import { Flex } from 'rebass'
import { css } from 'styled-components/macro'

const TRANSFER_STATUS_BUTTONS_MAP = {
  [TRANSFER_STATUS.PENDING_APPROVE]: 3,
  [TRANSFER_STATUS.READY_TO_APPROVE]: 3,
  [TRANSFER_STATUS.PENDING_ALLOWANCE]: 2,
  [TRANSFER_STATUS.READY_TO_TRANSFER]: 2,
  [TRANSFER_STATUS.NO_INPUT]: 1,
  [TRANSFER_STATUS.UNCONNECTED]: 0,
}

export const TransferButton = function ({ error }: { error?: boolean }) {
  const { transferStatus } = useSelector((state: RootState) => {
    const { transferStatus } = state.application
    return { transferStatus }
  })
  const {
    application: { setWalletModalOpen, setTransferConfirmationModalOpen, transferTokens, approveAmount },
  } = useDispatch()

  const [index, setIndex] = useState(0)
  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    // from: { opacity: 1 },
    // to: { opacity: 0 },
    ref: transRef,
    keys: null,
    config: { ...config.gentle, duration: 400 },
    from: { opacity: 0 /* transform: 'translate3d(0,0,100%)' */ },
    enter: { opacity: 1 /*  transform: 'translate3d(0,0,0%)'  */ },
    leave: { opacity: 0 /*  transform: 'translate3d(0,0,-50%)' */ },
    // delay: 200,
    // config: config.gentle,
  })
  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    setIndex(TRANSFER_STATUS_BUTTONS_MAP[transferStatus])
  }, [transferStatus])

  const transfer = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READY_TO_TRANSFER) {
      const input = document.getElementById('fromValueInput')
      input && transferTokens({ amount: (input as HTMLInputElement)!.value })
    }
  }, [transferStatus])

  const approve = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READY_TO_APPROVE) {
      const input = document.getElementById('fromValueInput')
      input && approveAmount({ amount: (input as HTMLInputElement)!.value })
    }
  }, [transferStatus])

  const clickHandler = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.UNCONNECTED) {
      setWalletModalOpen(true)
    }
    if (transferStatus === TRANSFER_STATUS.READY_TO_TRANSFER) {
      setTransferConfirmationModalOpen(true)
    }
    if (transferStatus === TRANSFER_STATUS.READY_TO_APPROVE) {
      approve()
    }
  }, [transferStatus])

  const text = useMemo(() => {
    switch (transferStatus) {
      case TRANSFER_STATUS.UNCONNECTED:
        return 'Connect'
      case TRANSFER_STATUS.NO_INPUT:
        return 'Please input your amount.'
      case TRANSFER_STATUS.PENDING_ALLOWANCE:
      case TRANSFER_STATUS.READY_TO_TRANSFER:
        return 'Transfer'
      case TRANSFER_STATUS.PENDING_APPROVE:
      case TRANSFER_STATUS.READY_TO_APPROVE:
        return 'Approve'
      default:
        return null
    }
  }, [transferStatus])

  const pending = useMemo(() => {
    return transferStatus === TRANSFER_STATUS.PENDING_ALLOWANCE || transferStatus === TRANSFER_STATUS.PENDING_APPROVE
  }, [transferStatus])

  const disabled = useMemo(() => {
    return transferStatus === TRANSFER_STATUS.UNCONNECTED || transferStatus === TRANSFER_STATUS.NO_INPUT
  }, [transferStatus])

  return (
    <PrimaryButton disabled={disabled || error} width="100%" fontWeight={900} onClick={clickHandler}>
      <TransitionSpinner style={{ position: 'absolute', left: 'calc(50% - 4rem)' }} show={pending} />
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
        {transitions((styles, item) => {
          return <animated.div style={{ ...styles }}>{text}</animated.div>
        })}
      </Flex>
    </PrimaryButton>
  )
}
