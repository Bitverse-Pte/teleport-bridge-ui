import React, { useDebugValue, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  animated,
  useTransition,
  config,
  useSpringRef,
} from '@react-spring/web'
import { Textfit } from 'react-textfit'
import styled from 'styled-components'
import { Icon } from 'components/Icon'
import { Text1 } from 'components/Text'
import { BaseButtonProps, ButtonDropdown } from '.'
import { RootState } from 'store/store'
import HistorySvg from 'public/history.svg'
import { TRANSACTION_STATUS } from 'constants/index'
import { TransitionSpinner } from 'components/Spinner'

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
      return e.status === TRANSACTION_STATUS.PENDING && !!e.src_chain_id
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
    from: {
      opacity: 0 /* backgroundColor: '#00c6a9', color: 'white'  */ /* transform: 'translate3d(0,0,100%)' */,
    },
    enter: {
      opacity: 1 /* , backgroundColor: '#2B1010', color: '#D25958', border: '1px solid #D25958', boxSizing: 'border-box' */,
    },
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
      <ButtonDropdown
        style={{
          backgroundColor: 'transparent',
          width: '30%',
          minWidth: 'fit-content',
          boxShadow: '0px 0px 4px 2px #323539',
        }}
        disabled={disabled}
        onClick={() => {
          setHistoryModalOpen(true)
        }}
      >
        <Wrapper className={'header-btn-img'}>
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
        <Text1 className={'header-btn-text'}>
          <Textfit max={20} min={2} mode="single">
            History
          </Textfit>
        </Text1>
      </ButtonDropdown>
    </>
  )
}