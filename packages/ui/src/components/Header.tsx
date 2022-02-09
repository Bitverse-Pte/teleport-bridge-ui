import React, { useCallback, useMemo } from 'react'
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

export default function Header() {
  const { active, account, connector, activate, chainId, error, deactivate } = useActiveWeb3React()
  const {
    application: { setHistoryModalOpen, manuallyLogout, setWalletModalOpen },
  } = useDispatch()
  const { connectStatus } = useSelector((state: RootState) => pick(state.application, 'connectStatus'))
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
            <Web3StatusConnected style={{ width: 'unset', maxWidth: 'unset' }}>
              <Flex alignItems="center">
                <SBlockie address={address} />
                <MouseoverTooltip text={address}>
                  <Hash ellipsis={true} hash={address} copyable={false} showCounts={4} />
                </MouseoverTooltip>
              </Flex>
            </Web3StatusConnected>
          </>
        )}
        <PrimaryButton onClick={() => (ready ? logout() : setWalletModalOpen(true))} style={{ margin: '0 0.5rem' }}>
          <Textfit max={20} min={2} mode="single">
            {ready ? 'Logout' : 'Connect'}
          </Textfit>
        </PrimaryButton>
      </Flex>
      <WalletSelectModal />
      <HistoryModal />
    </SHeader>
  )
}
