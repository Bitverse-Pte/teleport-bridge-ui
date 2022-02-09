import React, { useCallback, useMemo, useState } from 'react'
import { darken } from 'polished'
import { useSelector } from 'react-redux'
import { Textfit } from 'react-textfit'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass/styled-components'
import { pick } from 'lodash'

import { useDispatch } from 'hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { RootState } from 'store/store'
import Blockie from 'components/Blockie'
import Banner from 'components/Banner'
import { ConnectButton, PrimaryButton } from 'components/Button'
import { StyledText, Text1 } from 'components/Text'
import { ButtonPrimary, ButtonSecondary, ButtonDropdown } from 'components/Button'
import HistorySvg from 'assets/history.svg'
import WalletSelectModal from 'components/CustomizedModal/WalletSelectModal'
import HistoryModal from 'components/CustomizedModal/HistoryModal'
import { Icon } from 'components/Icon'
import { MouseoverTooltip } from 'components/Tooltip'
import { HistoryButton } from './Button/HistoryButton'
import { Hash } from './Hash'
import { MEDIA_WIDTHS } from 'theme'
import { NetworkSelectModalMode } from 'constants/types'

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
  background-color: transparent;
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

const NetworkStatus = styled(Web3StatusGeneric)<{ pending?: boolean; error?: boolean }>`
  max-width: 25vw;
  background-color: ${({ error }) => (error ? 'red' : 'transparent')};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg1)};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    ${({ error }) => `background-color: ${darken(0.1, 'red')};`}
    border: 1px solid ${({ theme }) => darken(0.05, theme.bg3)};
    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg2))};
    }
  }
`

const SHeader = styled(Flex)`
  padding: 0 5rem;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
`

const SBlockie = styled(Blockie)`
  margin-right: 10px;
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

const FlyoutMenu = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg0};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px 8px;
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

const ActiveRowWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  width: 100%;
`

export default function Header() {
  const { active, account, connector, activate, chainId, error, deactivate } = useActiveWeb3React()
  const {
    application: { setHistoryModalOpen, manuallyLogout, setWalletModalOpen, setNetworkModalMode },
  } = useDispatch()
  const { connectStatus, historyModalOpen, walletModalOpen, availableChains } = useSelector((state: RootState) => {
    const { connectStatus, historyModalOpen, walletModalOpen, availableChains } = state.application
    return { connectStatus, historyModalOpen, walletModalOpen, availableChains }
  })
  const connectedChain = useMemo(() => {
    if (chainId) {
      return availableChains.get(chainId)
    }
  }, [availableChains, chainId])
  const [flyoutMenuShow, setFlyoutMenuShow] = useState(false)
  const address = useMemo(() => account ?? '', [account])
  const ready = useMemo(() => connectStatus && active && !!account, [connectStatus, active, account])

  const logout = useCallback(() => {
    deactivate()
    manuallyLogout()
  }, [])

  return (
    <SHeader>
      <Flex width="50%" height="100%">
        <Banner />
      </Flex>
      <Flex
        width="50%"
        justifyContent={ready ? 'space-evenly' : 'end'}
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
        {ready && (
          <>
            <Flex>
              <HistoryButton disabled={!ready} />
            </Flex>
            <NetworkStatus
              error={!connectedChain}
              onClick={() => {
                !connectedChain && setNetworkModalMode(NetworkSelectModalMode.SRC)
              }}
              style={{ cursor: !connectedChain ? 'pointer' : 'default', width: 'unset', maxWidth: 'unset', minWidth: '20%', justifyContent: 'center' }}
            >
              {connectedChain && (
                <>
                  <Icon src={connectedChain?.icon}></Icon>
                  <Textfit max={20} min={2} mode="single" style={{ marginLeft: '0.5rem' }}>
                    {connectedChain?.shortName}
                  </Textfit>
                </>
              )}
              {!connectedChain && (
                <Textfit max={20} min={2} mode="single" style={{ fontWeight: 800 }}>
                  Wrong Network
                </Textfit>
              )}
            </NetworkStatus>
            <Web3StatusConnected
              style={{ width: 'unset', maxWidth: 'unset' }}
              onMouseOver={() => {
                setFlyoutMenuShow(true)
              }}
            >
              <Flex alignItems="center">
                <SBlockie address={address} />
                {/* <MouseoverTooltip text={address}> */}
                <Hash ellipsis={true} hash={address} copyable={false} showCounts={4} />
                {/* </MouseoverTooltip> */}
              </Flex>
              {flyoutMenuShow && (
                <FlyoutMenu
                  onMouseLeave={() => {
                    setFlyoutMenuShow(false)
                  }}
                >
                  <ActiveRowWrapper
                    onClick={() => {
                      setWalletModalOpen(true)
                    }}
                  >
                    Change Wallet
                  </ActiveRowWrapper>
                  <ActiveRowWrapper
                    onClick={() => {
                      logout()
                    }}
                  >
                    Logout
                  </ActiveRowWrapper>
                </FlyoutMenu>
              )}
            </Web3StatusConnected>
          </>
        )}
        {!ready && (
          <PrimaryButton onClick={() => setWalletModalOpen(true)} style={{ margin: '0 0.5rem' }}>
            <Textfit max={20} min={2} mode="single">
              Connect
            </Textfit>
          </PrimaryButton>
        )}
      </Flex>
      {walletModalOpen && <WalletSelectModal />}
      {historyModalOpen && <HistoryModal />}
    </SHeader>
  )
}

/* 
  <FlyoutMenu onMouseLeave={toggle}>
          <FlyoutHeader>
            <Trans>Select a network</Trans>
          </FlyoutHeader>
          <Row onSelectChain={handleRowClick} targetChain={SupportedChainId.MAINNET} />
          <Row onSelectChain={handleRowClick} targetChain={SupportedChainId.POLYGON} />
          <Row onSelectChain={handleRowClick} targetChain={SupportedChainId.OPTIMISM} />
          <Row onSelectChain={handleRowClick} targetChain={SupportedChainId.ARBITRUM_ONE} />
        </FlyoutMenu>
*/
