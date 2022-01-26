import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useTransition, config, animated, useSprings, useSpringRef, AnimatedProps } from '@react-spring/web'
import { BaseSpinner, TransitionSpinner } from 'components/Spinner'
import { PrimaryButton } from '.'
import { TRANSFER_STATUS } from 'constants/types'
import { useDispatch } from 'hooks'
import { Flex } from 'rebass'

const ConnectButton = function () {
  const {
    application: { setWalletModalOpen },
  } = useDispatch()
  return (
    <PrimaryButton width="100%" fontWeight={900} onClick={() => setWalletModalOpen(true)}>
      Connect
    </PrimaryButton>
  )
}

const NoInputButton = function () {
  return (
    <PrimaryButton disabled={true} width="100%" fontWeight={900}>
      Please input your amount.
    </PrimaryButton>
  )
}

const AllowanceOrTransferButton = function () {
  const { transferStatus } = useSelector((state: RootState) => {
    const { transferStatus } = state.application
    return { transferStatus }
  })
  const pending = useMemo(() => {
    return transferStatus === TRANSFER_STATUS.PENDINGALLOWANCE
  }, [transferStatus])
  const clickHandler = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READYTOTRANSFER) {
      //transfer()
    }
  }, [transferStatus])
  return (
    <PrimaryButton width="100%" fontWeight={900} onClick={clickHandler}>
      <TransitionSpinner show={pending} />
      &nbsp; Transfer
    </PrimaryButton>
  )
}

const ApproveButton = function () {
  const { transferStatus } = useSelector((state: RootState) => {
    const { transferStatus } = state.application
    return { transferStatus }
  })
  const pending = useMemo(() => {
    return transferStatus === TRANSFER_STATUS.PENDINGAPPROVE
  }, [transferStatus])
  const clickHandler = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READYTOAPPROVE) {
      //approve()
    }
  }, [transferStatus])
  return (
    <PrimaryButton width="100%" fontWeight={900} onClick={clickHandler}>
      <TransitionSpinner show={pending} />
      &nbsp; Approve
    </PrimaryButton>
  )
}

const TRANSFER_STATUS_BUTTONS_MAP = {
  [TRANSFER_STATUS.PENDINGAPPROVE]: 3,
  [TRANSFER_STATUS.READYTOAPPROVE]: 3,
  [TRANSFER_STATUS.PENDINGALLOWANCE]: 2,
  [TRANSFER_STATUS.READYTOTRANSFER]: 2,
  [TRANSFER_STATUS.NOINPUT]: 1,
  [TRANSFER_STATUS.UNCONNECTED]: 0,
}

export const TransferButton = function () {
  const { transferStatus } = useSelector((state: RootState) => {
    const { transferStatus } = state.application
    return { transferStatus }
  })
  const {
    application: { setWalletModalOpen },
  } = useDispatch()

  const [index, setIndex] = useState(0)
  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    // from: { opacity: 1 },
    // to: { opacity: 0 },
    ref: transRef,
    // config: { ...config.gentle, duration: 400 },
    from: { opacity: 0, transform: 'translate3d(0,0,100%)' },
    enter: { opacity: 1, transform: 'translate3d(0,0,0%)' },
    leave: { opacity: 0, transform: 'translate3d(0,0,-50%)' },
    // delay: 200,
    // config: config.gentle,
  })
  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    setIndex(TRANSFER_STATUS_BUTTONS_MAP[transferStatus])
  }, [transferStatus])

  const clickHandler = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.UNCONNECTED) {
      setWalletModalOpen(true)
    }
    if (transferStatus === TRANSFER_STATUS.READYTOTRANSFER) {
      //transfer()
    }
    if (transferStatus === TRANSFER_STATUS.READYTOAPPROVE) {
      //approve()
    }
  }, [transferStatus])

  const text = useMemo(() => {
    switch (transferStatus) {
      case TRANSFER_STATUS.UNCONNECTED:
        return 'Connect'
      case TRANSFER_STATUS.NOINPUT:
        return 'Please input your amount.'
      case TRANSFER_STATUS.PENDINGALLOWANCE:
      case TRANSFER_STATUS.READYTOTRANSFER:
        return 'Transfer'
      case TRANSFER_STATUS.PENDINGAPPROVE:
      case TRANSFER_STATUS.READYTOAPPROVE:
        return 'Approve'
      default:
        return null
    }
  }, [transferStatus])

  const pending = useMemo(() => {
    return transferStatus === TRANSFER_STATUS.PENDINGALLOWANCE || transferStatus === TRANSFER_STATUS.PENDINGAPPROVE
  }, [transferStatus])

  const disabled = useMemo(() => {
    return transferStatus === TRANSFER_STATUS.UNCONNECTED || transferStatus === TRANSFER_STATUS.NOINPUT
  }, [transferStatus])

  return (
    <PrimaryButton disabled={disabled} width="100%" fontWeight={900} onClick={clickHandler}>
      <TransitionSpinner style={{ position: 'absolute', left: '2rem' }} show={pending} />
      {transitions((styles, item) => {
        return <animated.div style={{ ...styles }}>{text}</animated.div>
      })}
    </PrimaryButton>
  )
}
