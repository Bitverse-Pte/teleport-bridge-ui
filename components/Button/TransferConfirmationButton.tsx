import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTransition, config, animated, useSprings, useSpringRef, AnimatedProps } from '@react-spring/web'
import BigNumber from 'bignumber.js'
import { darken } from 'polished'

import { useDispatch } from 'hooks'
import { RootState } from 'store/store'
import styled, { css } from 'styled-components'
import { TRANSFER_STATUS } from 'constants/types'
import { getBalance } from 'helpers/web3'

const StyledAnimatedBtn = styled(animated.button)<{ backgroundColor: string }>`
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

enum TransferConfirmButtonStatus {
  MANUALLY_ACCEPTED,
  NEED_MANUALLY_ACCEPTED,
  INVALID_BALANCE,
}

export const TransferConfirmationButton = function () {
  const { transferStatus, estimation, selectedTokenName, bridgePairs, srcChainId, destChainId, library, account, currentTokenBalance } = useSelector((state: RootState) => {
    const { transferStatus, estimation, selectedTokenName, bridgePairs, srcChainId, destChainId, library, account, currentTokenBalance } = state.application
    return { transferStatus, estimation, selectedTokenName, bridgePairs, srcChainId, destChainId, library, account, currentTokenBalance }
  })
  const {
    application: { transferTokens, saveCurrentTokenBalance },
  } = useDispatch()
  const [lastEstimationId, setLastEstimationId] = useState(0)
  useEffect(() => {
    setLastEstimationId(estimation?.id || 0)
  }, [])
  const [buttonStatus, setButtonStatus] = useState(TransferConfirmButtonStatus.MANUALLY_ACCEPTED)
  const transRef = useSpringRef()
  const transitions = useTransition(buttonStatus, {
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
  }, [buttonStatus])

  const transfer = useCallback(() => {
    if (transferStatus === TRANSFER_STATUS.READY_TO_TRANSFER) {
      const input = document.getElementById('fromValueInput')
      input && transferTokens({ amount: (input as HTMLInputElement)!.value })
    }
  }, [transferStatus])

  const disabled = useMemo(() => {
    return false //to do
  }, [estimation])

  const text = useMemo(() => {
    if (estimation.rate && buttonStatus === TransferConfirmButtonStatus.MANUALLY_ACCEPTED) {
      return 'Confirm'
    } else if (!disabled && buttonStatus === TransferConfirmButtonStatus.NEED_MANUALLY_ACCEPTED) {
      return 'Accept(new estimation)'
    } else if (buttonStatus === TransferConfirmButtonStatus.INVALID_BALANCE) {
      return 'Invalid Balance'
    } else {
      return 'Confirm'
    }
  }, [estimation, disabled, buttonStatus])

  const clickHandler = useCallback(() => {
    if (buttonStatus === TransferConfirmButtonStatus.NEED_MANUALLY_ACCEPTED) {
      setButtonStatus(TransferConfirmButtonStatus.MANUALLY_ACCEPTED)
    }
    if (buttonStatus === TransferConfirmButtonStatus.MANUALLY_ACCEPTED) {
      transfer()
    }
  }, [text, transferStatus])

  useEffect(() => {
    if (lastEstimationId !== estimation?.id) {
      setButtonStatus(TransferConfirmButtonStatus.NEED_MANUALLY_ACCEPTED)
    } else {
      setButtonStatus(TransferConfirmButtonStatus.MANUALLY_ACCEPTED)
    }

    saveCurrentTokenBalance(undefined)
    /*  const selectedToken = bridgePairs.get(`${srcChainId}-${destChainId}`)?.tokens.find((token) => token.name === selectedTokenName)?.srcToken
    getBalance(selectedToken, library!, account!).then((balance) => {
      const input = document.getElementById('fromValueInput') as HTMLInputElement
      if (input) {
        const parsedCurrentTokenBalance = new BigNumber(balance!.toHexString()).div(`1e+${selectedToken!.decimals}`)
        const parsedInputValue = new BigNumber(input.value)
        if (parsedCurrentTokenBalance.isLessThan(parsedInputValue) || parsedInputValue.isNegative()) {
          setButtonStatus(TransferConfirmButtonStatus.INVALID_BALANCE)
        }
      }
    }) */
  }, [lastEstimationId, estimation?.id])

  useEffect(() => {
    const input = document.getElementById('fromValueInput') as HTMLInputElement
    const pairKey = `${srcChainId}-${destChainId}`
    if (input && currentTokenBalance && bridgePairs.has(pairKey)) {
      const selectedToken = bridgePairs.get(pairKey)?.tokens.find((token) => token.name === selectedTokenName || token.srcToken.name === selectedTokenName)?.srcToken
      const parsedCurrentTokenBalance = new BigNumber(currentTokenBalance!.toHexString()).div(`1e+${selectedToken!.decimals}`)
      const parsedInputValue = new BigNumber(input.value)
      if (parsedCurrentTokenBalance.isLessThan(parsedInputValue) || parsedInputValue.isNegative()) {
        setButtonStatus(TransferConfirmButtonStatus.INVALID_BALANCE)
      }
    }
  }, [currentTokenBalance, selectedTokenName, srcChainId, destChainId])

  return (
    <Wrapper>
      {transitions((styles, item) => {
        switch (item) {
          case TransferConfirmButtonStatus.MANUALLY_ACCEPTED:
            return (
              <StyledAnimatedBtn disabled={disabled} backgroundColor={'#00c6a9'} style={{ /* backgroundColor: '#00c6a9', */ color: 'white', ...styles }} onClick={clickHandler}>
                <animated.div>{text}</animated.div>
              </StyledAnimatedBtn>
            )
          case TransferConfirmButtonStatus.NEED_MANUALLY_ACCEPTED:
            return (
              <StyledAnimatedBtn disabled={disabled} backgroundColor={'#2B1010'} style={{ border: '1px solid #D25958', /*  backgroundColor: '#2B1010', */ color: '#D25958', ...styles }} onClick={clickHandler}>
                <animated.div>{text}</animated.div>
              </StyledAnimatedBtn>
            )
          case TransferConfirmButtonStatus.INVALID_BALANCE:
            return (
              <StyledAnimatedBtn disabled={disabled} backgroundColor={'#222222'} style={{ backgroundColor: '#222222', color: '#C3C5CB', cursor: 'not-allowed', boxShadow: 'none', border: '1px solid transparent', outline: 'none', ...styles }}>
                <animated.div>{text}</animated.div>
              </StyledAnimatedBtn>
            )
        }
      })}
      )
    </Wrapper>
  )
}
