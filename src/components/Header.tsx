import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { darken } from 'polished'
import { useSelector } from 'react-redux'
// import { Text1 } from 'react-Text1'
import { AlertCircle } from 'react-feather'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass/styled-components'
import Grow from '@mui/material/Grow'
import { LogOut } from 'react-feather'

import { useDispatch } from 'hooks'
import { RootState } from 'store/store'
import Blockie from 'components/Blockie'
import Banner from 'components/Banner'
import { ConnectButton, PrimaryButton } from 'components/Button'
import { StyledText, Text1 } from 'components/Text'
import { ButtonPrimary, ButtonSecondary, ButtonDropdown } from 'components/Button'
import HistorySvg from 'public/history.svg'
import WalletSelectModal from 'components/CustomizedModal/WalletSelectModal'
import HistoryModal from 'components/CustomizedModal/HistoryModal'
import { HistoryButton } from './Button/HistoryButton'
import { Hash } from './Hash'
import { MEDIA_WIDTHS } from 'theme'
import { NetworkSelectModalMode } from 'constants/types'
import { StyledLogo } from 'components/Logo'
import { Icon } from './Icon'
import { sensorsTrack } from 'helpers/sensors'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 1rem;
  margin-left: 1.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  min-width: fit-content;
  background-color: transparent;
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg1)};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  box-shadow: 0px 0px 4px 2px #323539;
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.bg3)};
  }
`

const NetworkStatus = styled(Web3StatusGeneric)<{ pending?: boolean; error?: boolean }>`
  min-width: fit-content;
  background-color: ${({ error, theme }) => (error ? theme.red1 : 'transparent')};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg1)};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  box-shadow: 0px 0px 4px 2px #323539;
  :hover,
  :focus {
    ${({ error }) => (error ? `background-color: ${darken(0.1, 'red')};` : '')}
    border: 1px solid ${({ theme }) => darken(0.05, theme.bg3)};
    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg2))};
    }
  }
`

const SHeader = styled(Flex)`
  padding: 0 5rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: flex-start;
    padding: 0;
  `}
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
`

const SBlockie = styled(Blockie)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-right: 0;
`}// margin-right: 10px;
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

const ActiveRowWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  width: 100%;
  .hidden-when-narrow {
    ${({ theme }) => theme.mediaWidth.upToMedium`
      display: none;
    `}
  }
  .keep-when-narrow {
    ${({ theme }) => theme.mediaWidth.upToMedium`
      justify-content: center;
      width: 100%;
  `}
  }
`

const HeaderFunctionalArea = styled(Flex)<{ ready: boolean }>`
  width: 50%;
  justify-content: ${({ ready }) => (ready ? 'space-evenly' : 'end')};
  & {
    .header-btn-text {
      min-width: fit-content;
    }
    ${({ theme }) => theme.mediaWidth.upToMedium`
    .header-btn-text {
      display: none;
    }
    .header-btn-img {
      margin-right: 0;
    }
    `}
    > div,
    > button {
      height: 44px;
    }
  }
`
const BannerArea = styled(Flex)`
  width: 50%;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: flex-start;
  `}
`

export default function Header() {
  const { account, active, chainId, deactivate } = useSelector((state: RootState) => {
    const { account, active, chainId, deactivate } = state.evmCompatibles
    return { account, active, chainId, deactivate }
  })
  const { walletAddress: keplrWalletAddress } = useSelector((state: RootState) => {
    const { walletAddress } = state.cosmosCompatibles
    return { walletAddress }
  })
  const {
    application: { setHistoryModalOpen, manuallyLogout, setWalletModalOpen, setNetworkModalMode },
    cosmosCompatibles: { disconnect: disconnectKeplr },
  } = useDispatch()
  const { connectStatus, historyModalOpen, walletModalOpen, availableChains } = useSelector((state: RootState) => {
    const { connectStatus, historyModalOpen, walletModalOpen, availableChains } = state.application
    return { connectStatus, historyModalOpen, walletModalOpen, availableChains }
  })
  const flyoutMenuRef = useRef<any>()
  const connectedChain = useMemo(() => {
    if (chainId) {
      return availableChains.get(chainId)
    }
    return false
  }, [availableChains, chainId])
  const [flyoutMenuShow, setFlyoutMenuShow] = useState(false)
  const address = useMemo(() => (keplrWalletAddress || account) ?? '', [keplrWalletAddress, account])
  const ready = useMemo(() => connectStatus && ((active && !!account) || !!keplrWalletAddress), [connectStatus, active, account, keplrWalletAddress])

  /*   useEffect(() => {
    const clickHandler = function (evt: MouseEvent) {
      if (flyoutMenuRef.current && flyoutMenuShow && evt.currentTarget !== flyoutMenuRef.current) {
        setFlyoutMenuShow(false)
      }
    }
    document.addEventListener('click', clickHandler)
    return () => {
      document.removeEventListener('click', clickHandler)
    }
  }, [flyoutMenuRef, flyoutMenuShow])
 */
  const logout = useCallback(() => {
    sensorsTrack('logout_click')
    deactivate()
    manuallyLogout()
  }, [deactivate])

  const [delayedCloseMenuTimer, setDelayedCloseMenuTimer] = useState(NaN)

  const delayedCloseMenu = useCallback(() => {
    flyoutMenuShow && setFlyoutMenuShow(false)
  }, [flyoutMenuShow])

  const connectToWallet = useCallback(() => {
    sensorsTrack('connect_header_click')
    setWalletModalOpen(true)
  }, [])

  const chooseNetwork = useCallback(() => {
    sensorsTrack('select_src_chain_header_click')
    setNetworkModalMode(NetworkSelectModalMode.SRC)
  }, [])

  return (
    <SHeader>
      <BannerArea>
        <Banner />
      </BannerArea>
      <HeaderFunctionalArea ready={ready}>
        {ready && (
          <>
            <HistoryButton disabled={!ready} />
            <NetworkStatus error={!connectedChain} onClick={chooseNetwork} style={{ width: '30%', cursor: 'pointer', justifyContent: 'center' }}>
              {connectedChain && (
                <>
                  <StyledLogo className={'header-btn-img'} srcs={[connectedChain?.icon]} size={'1.25rem'} />
                  <Text1 style={{ marginLeft: '6px' }} className={'header-btn-text'} /* max={20} min={2} mode="single" */>
                    {connectedChain?.name}
                  </Text1>
                </>
              )}
              {!connectedChain && (
                <>
                  <Flex minWidth="1.625rem" height={'1.625rem'} alignItems={'center'} justifyContent="center">
                    <AlertCircle size={'1.25rem'} className={'header-btn-img'} />
                  </Flex>
                  <Text1 className={'header-btn-text'} /* max={20} min={2} mode="single" */ style={{ fontSize: '1rem', fontWeight: 800 }}>
                    Wrong Network
                  </Text1>
                </>
              )}
            </NetworkStatus>
            <Web3StatusConnected
              style={{ width: '30%' }}
              onClick={() => {
                setFlyoutMenuShow(true)
              }}
              onMouseLeave={() => {
                setDelayedCloseMenuTimer(window.setTimeout(() => delayedCloseMenu(), 500))
              }}
            >
              <Flex alignItems="center">
                <SBlockie className={'header-btn-img'} address={address} size={20} style={{ minWidth: '32px' }} />
                {/* <Hash ellipsis={true} hash={address} copyable={false} showCounts={4} /> */}
                <Text1 className={'header-btn-text'} /* max={20} min={2} mode="single"  */ style={{ fontWeight: 600 }}>
                  {`${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`}
                </Text1>
              </Flex>
              <Grow in={flyoutMenuShow}>
                <FlyoutMenu
                  onMouseLeave={() => {
                    setFlyoutMenuShow(false)
                  }}
                  onMouseOver={() => {
                    window.clearTimeout(delayedCloseMenuTimer)
                    setFlyoutMenuShow(true)
                  }}
                  ref={flyoutMenuRef}
                  style={{ overflow: 'hidden' }}
                >
                  {/*    <ActiveRowWrapper
                    onClick={() => {
                      setWalletModalOpen(true)
                    }}
                  >
                    <Text1  style={{ fontWeight: 800, width: '100%' }}>Change Wallet</Text1>
                  </ActiveRowWrapper> */}
                  <ActiveRowWrapper onClick={logout}>
                    <Flex flex={1} className="hidden-when-narrow"></Flex>
                    <Flex minWidth="fit-content" className="hidden-when-narrow">
                      <Text1 /*  max={20} min={2} mode="single" */ style={{ fontWeight: 650, width: '100%' }}>Logout</Text1>
                    </Flex>
                    <Flex className="keep-when-narrow" flex={1} paddingLeft="0.25rem" alignItems={'center'}>
                      <LogOut size="1rem" strokeWidth="3.5" />
                    </Flex>
                  </ActiveRowWrapper>
                </FlyoutMenu>
              </Grow>
            </Web3StatusConnected>
          </>
        )}
        {!ready && (
          <PrimaryButton onClick={connectToWallet} style={{ margin: '0 0.5rem', width: '30%', minWidth: 'fit-content' }}>
            <Text1 /*  max={20} min={2} mode="single" */ style={{ width: '100%' }}>Connect</Text1>
          </PrimaryButton>
        )}
      </HeaderFunctionalArea>
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
