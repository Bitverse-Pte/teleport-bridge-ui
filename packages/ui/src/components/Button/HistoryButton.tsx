import React, { useDebugValue, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { animated, useTransition, config, useSpringRef } from '@react-spring/web'
import styled from 'styled-components/macro'
import { Icon } from 'components/Icon'
import { Text1 } from 'components/Text'
import { BaseButtonProps, ButtonDropdown } from '.'
import { RootState } from 'store/store'
import HistorySvg from 'assets/history.svg'
import { TRANSACTION_STATUS } from 'constants/index'
import { TransitionSpinner } from 'components/Spinner'
import { Textfit } from 'react-textfit'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  height: 1.625rem;
  width: 1.625rem;
  > div {
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

export function HistoryButton({ disabled }: BaseButtonProps) {
  const {
    application: { setHistoryModalOpen },
  } = useDispatch()
  const { transactions } = useSelector((state: RootState) => {
    const { transactions } = state.application
    return { transactions }
  })

  const hasPending = useMemo(() => {
    return transactions.some((e) => {
      return e.status === TRANSACTION_STATUS.PENDING
    })
  }, [transactions])

  /*  useEffect(() => {
    window.setHasPending = setHasPending
  }, []) */

  const transRef = useSpringRef()
  const transitions = useTransition(hasPending, {
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
  }, [hasPending])

  return (
    <>
      <ButtonDropdown style={{ backgroundColor: 'transparent' }} disabled={disabled} onClick={() => setHistoryModalOpen(true)}>
        <Wrapper>
          {transitions((styles, item) => {
            return (
              <>
                {item ? (
                  <animated.div style={{ ...styles }}>
                    <TransitionSpinner show={item} />
                  </animated.div>
                ) : (
                  <animated.div style={{ ...styles }}>
                    <Icon src={HistorySvg} />
                  </animated.div>
                )}
              </>
            )
          })}
        </Wrapper>
        <Text1 width={'50%'}>
          <Textfit max={20} min={2} mode="single">
            History
          </Textfit>
        </Text1>
      </ButtonDropdown>
    </>
  )
}
