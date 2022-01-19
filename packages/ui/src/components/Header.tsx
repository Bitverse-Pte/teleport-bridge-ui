import React, { useCallback, useMemo } from 'react'
import { darken } from 'polished'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass/styled-components'
import { pick } from 'lodash'

import { useDispatch } from 'hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { RootState } from 'store/store'
import Blockie from 'components/Blockie'
import Banner from 'components/Banner'
import { ConnectButton } from 'components/Button'
import { StyledText, Text1 } from 'components/Text'
import { ButtonPrimary, ButtonSecondary, ButtonDropdown } from 'components/Button'
import WalletSelectModal from 'components/CustomizedModal/WalletSelectModal'
import HistoryModal from 'components/CustomizedModal/HistoryModal'

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
    application: { setHistoryModalOpen, saveConnectStatus },
  } = useDispatch()
  const { connectStatus } = useSelector((state: RootState) => pick(state.application, 'connectStatus'))
  const address = useMemo(() => account ?? '', [account])
  const ready = useMemo(() => connectStatus && active && !!account, [connectStatus, active, account])

  const logout = useCallback(() => {
    deactivate()
    saveConnectStatus(false)
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
          <ButtonDropdown disabled={!ready} onClick={() => setHistoryModalOpen(true)}>
            <Text1 width="100%">History</Text1>
          </ButtonDropdown>
        </Flex>
        {!ready && <ConnectButton />}
        {ready && (
          <Web3StatusConnected>
            <Flex alignItems="center">
              <SBlockie address={address} />
              <StyledText>{`${address.substring(0, 6)}...${address.substring(42 - 6)}`}</StyledText>
            </Flex>
          </Web3StatusConnected>
        )}
        {ready && (
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
