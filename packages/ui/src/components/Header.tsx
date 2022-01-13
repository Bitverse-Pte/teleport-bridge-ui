import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { darken } from 'polished'
import { AbstractConnector } from '@web3-react/abstract-connector'
import styled, { css } from 'styled-components'
import { Flex, Box, Text } from 'rebass/styled-components'
import { ChevronDown, XCircle } from 'react-feather'

import { injected, portis } from 'connectors'
import Blockie from './Blockie'
import Banner from './Banner'
import { MEDIA_WIDTHS } from 'theme'
import UniModal from 'components/UniModal'
import { useDispatch } from 'hooks'
import Option from './Option'
import { ConnectButton } from 'components/Button'
import { useActiveWeb3React } from 'hooks/web3'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { isMobile } from 'helpers/userAgent'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { UnsupportedChainIdError } from '@web3-react/core'
import { StyledText, Text1 } from 'components/Text'
import { useSelector } from 'react-redux'
import { ButtonPrimary, ButtonSecondary, ButtonDropdown } from 'components/Button'
import { RootState } from 'store/store'
import { CircledCloseIcon } from 'components/Icon'
import WalletSelectModal from './CutomizedModal/WalletSelectModal'
import { pick } from 'lodash'
import HistoryModal from './CutomizedModal/HistoryModal'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  max-width: 25vw;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg1)};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.bg3)};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg2))};
    }
  }
`

const SHeader = styled(Flex)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bg1};
`

const SBlockie = styled(Blockie)`
  margin-right: 10px;
`

const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`
const FlyoutMenu = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  position: absolute;
  top: 64px;
  width: 100%;
  z-index: 99;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    top: 50px;
  }
`
const FlyoutRow = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  padding: 1rem 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 100%;
  max-height: calc(100% - 20px);
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0 1rem 1rem 1rem`};
`

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`

export default function Header() {
  const { active, account, connector, activate, chainId, error, deactivate } = useActiveWeb3React()
  const {
    application: { setWalletModalOpen, setHistoryModalOpen, saveConnectStatus },
  } = useDispatch()
  const { connectStatus } = useSelector((state: RootState) => pick(state.application, 'connectStatus'))
  const address = useMemo(() => account ?? '', [account])

  const logout = useCallback(() => {
    deactivate()
    saveConnectStatus(false)
  }, [])

  const openWalletSelector = useCallback(() => {
    setWalletModalOpen(true)
  }, [])

  return (
    <SHeader>
      <Flex width="50%" height="100%">
        <Banner />
      </Flex>
      <Flex
        width="50%"
        justifyContent="space-evenly"
        css={css`
          & {
            > div,
            > button {
              height: 44px;
              max-width: 30%;
              width: 30%;
            }
          }
        `}
      >
        <Flex>
          <ButtonDropdown disabled={!connectStatus} onClick={() => setHistoryModalOpen(true)}>
            <Text1 width="100%">History</Text1>
          </ButtonDropdown>
        </Flex>
        {(!connectStatus || !active) && <ConnectButton />}
        {connectStatus && (
          <Web3StatusConnected
          /*    onClick={() => {
              setLogoutMenuOpen(true)
            }} */
          >
            <Flex alignItems="center">
              <SBlockie address={address} />
              <StyledText>{`${address.substring(0, 6)}...${address.substring(42 - 6)}`}</StyledText>
            </Flex>
            {/*  {logoutMenuOpen && (
              <FlyoutMenu ref={menuRef}>
                <FlyoutRow onClick={resetApp}>Logout</FlyoutRow>
              </FlyoutMenu>
            )} */}
          </Web3StatusConnected>
        )}
        {connectStatus && (
          <ButtonPrimary onClick={logout} fontWeight={900}>
            Logout
          </ButtonPrimary>
        )}
      </Flex>
      <WalletSelectModal />
      <HistoryModal />
    </SHeader>
  )
}
