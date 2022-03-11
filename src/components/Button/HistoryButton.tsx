import React, { useDebugValue, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { animated, useTransition, config, useSpringRef } from '@react-spring/web'
import { Textfit } from 'react-textfit'
import styled from 'styled-components'
import { Icon } from 'components/Icon'
import { Text1 } from 'components/Text'
import { BaseButtonProps, ButtonDropdown } from '.'
import { RootState } from 'store/store'
import HistorySvg from 'public/history.svg'
import { TRANSACTION_STATUS } from 'constants/index'
import { TransitionSpinner } from 'components/Spinner'
import Fade from '@mui/material/Fade'
import { Flex } from 'rebass'

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
      return !!e.send_tx_hash && e.status === TRANSACTION_STATUS.PENDING && !!e.src_chain_id
    })
  }, [transactions])

  /*  useEffect(() => {
    window.setHasPending = setHasPending
  }, []) */

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
          <TransitionSpinner show={hasPending} />
          <Fade in={!hasPending}>
            <Flex>
              <Icon size={20} src={HistorySvg} />
            </Flex>
          </Fade>
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
