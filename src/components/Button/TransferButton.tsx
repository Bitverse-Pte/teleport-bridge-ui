import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useTransition, config, animated, useSprings, useSpringRef, AnimatedProps } from '@react-spring/web'
import { TransitionSpinner } from 'components/Spinner'
import { PrimaryButton } from '.'
import { CURRENCY_INPUT_ERROR, NetworkSelectModalMode, TRANSFER_STATUS } from 'constants/types'
import { useDispatch } from 'hooks'
import { Flex } from 'rebass'
import { css } from 'styled-components'

const TRANSFER_STATUS_BUTTONS_MAP = {
  [TRANSFER_STATUS.PENDING_APPROVE]: 5,
  [TRANSFER_STATUS.READY_TO_APPROVE]: 4,
  [TRANSFER_STATUS.PENDING_ALLOWANCE]: 3,
  [TRANSFER_STATUS.READY_TO_TRANSFER]: 2,
  [TRANSFER_STATUS.NO_INPUT]: 1,
  [TRANSFER_STATUS.UNCONNECTED]: 0,
}

export const TransferButton = function ({ error }: { error?: CURRENCY_INPUT_ERROR }) {
  const { account, active, chainId } = useSelector((state: RootState) => {
    const { account, active, chainId } = state.evmCompatibles
    return { account, active, chainId }
  })
  const { transferStatus, connectStatus, availableChains, srcChainId } = useSelector((state: RootState) => {
    const { transferStatus, connectStatus, availableChains, srcChainId } = state.application
    return { transferStatus, connectStatus, availableChains, srcChainId }
  })
  const {
    application: { setWalletModalOpen, setTransferConfirmationModalOpen, setNetworkModalMode, transferTokens, approveAmount },
  } = useDispatch()
  const chainReady = useMemo(() => {
    if (chainId && srcChainId == chainId) {
      return availableChains.has(+chainId) && active
    }
    return false
  }, [availableChains, chainId, srcChainId])
  const walletReady = useMemo(() => connectStatus && active && !!account, [connectStatus, active, account]) /* useMemo(() => {
    return connectStatus && active
  }, [connectStatus, active]) */
  const btnDisabled = useMemo(() => {
    if (!walletReady || !chainReady) {
      return false
    }
    return transferStatus === TRANSFER_STATUS.NO_INPUT || (error && error !== CURRENCY_INPUT_ERROR.OK)
  }, [transferStatus, chainReady, walletReady, error])

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
    return () => {
      transRef.stop()
    }
  }, [index])

  useEffect(() => {
    setIndex(TRANSFER_STATUS_BUTTONS_MAP[transferStatus])
  }, [transferStatus])

  const approve = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READY_TO_APPROVE) {
      approveAmount(undefined)
    }
  }, [transferStatus])

  const clickHandler = useCallback(() => {
    if (!walletReady) {
      setWalletModalOpen(true)
      return
    }
    if (!chainReady) {
      setNetworkModalMode(NetworkSelectModalMode.SRC)
      return
    }
    if (transferStatus === TRANSFER_STATUS.READY_TO_TRANSFER) {
      setTransferConfirmationModalOpen(true)
    }
    if (transferStatus === TRANSFER_STATUS.READY_TO_APPROVE) {
      approve()
    }
  }, [transferStatus, walletReady, chainReady])

  const text = useMemo(() => {
    if (!walletReady) {
      return 'Connect'
    }
    if (!chainReady) {
      return 'Choose Available Chain'
    }
    if (error) {
      switch (error) {
        case CURRENCY_INPUT_ERROR.INSUFFICIENT:
          return 'Insufficient Balance'
        case CURRENCY_INPUT_ERROR.INVALID:
          return 'Invalid Amount'
        case CURRENCY_INPUT_ERROR.OK:
          break
      }
    }
    switch (transferStatus) {
      case TRANSFER_STATUS.NO_INPUT:
        return 'Please input your amount.'
      case TRANSFER_STATUS.PENDING_ALLOWANCE:
        return 'Judging Allowance'
      case TRANSFER_STATUS.READY_TO_TRANSFER:
        return 'Transfer'
      case TRANSFER_STATUS.PENDING_APPROVE:
        return 'Approving'
      case TRANSFER_STATUS.READY_TO_APPROVE:
        return 'Approve'
      default:
        return null
    }
  }, [transferStatus, error, walletReady, chainReady])

  const pending = useMemo(() => {
    if (error !== CURRENCY_INPUT_ERROR.OK || !walletReady || !chainReady) {
      return false
    }
    return transferStatus === TRANSFER_STATUS.PENDING_ALLOWANCE || transferStatus === TRANSFER_STATUS.PENDING_APPROVE
  }, [transferStatus, error, walletReady, chainReady])

  return (
    <PrimaryButton disabled={btnDisabled} width="100%" fontWeight={900} onClick={clickHandler}>
      <TransitionSpinner color={'#83F2C4'} type="linear" style={{ position: 'absolute', bottom: 0, width: 'calc(100% - 0.5rem)', display: 'flex', justifyContent: 'center' }} show={pending} />
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
          return <>{item === index && <animated.div style={{ ...styles }}>{text}</animated.div>}</>
        })}
      </Flex>
    </PrimaryButton>
  )
}
