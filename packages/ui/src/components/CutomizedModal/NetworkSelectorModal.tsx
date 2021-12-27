import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Flex } from 'rebass'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Option from 'components/Option'
import { CircledCloseIcon } from 'components/Icon'
import { StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import SupportedChains from 'helpers/chains'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { useActiveWeb3React } from 'hooks/web3'
import { RootState } from 'store/store'
import { useDispatch } from 'hooks'

const OptionGrid = styled(Box)`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

export default function NetworkSelectModal() {
  const { active: active, account, activate, chainId, error, library, connector, setError } = useActiveWeb3React()
  const networkModalOpen = useSelector((state: RootState) => state.application.networkModalOpen)
  const {
    application: { setNetworkModalOpen: setNetworkMenuOpen },
  } = useDispatch()
  /* const menuRef = useRef(null)

  useEffect(() => {
    // testRef.current && document.body.append(testRef.current)
    const collapseMenuOnLoseFocus = (evt: MouseEvent) => {
      if (menuRef.current && evt.currentTarget !== menuRef.current && networkMenuOpen) {
        setNetworkMenuOpen(false)
      }
    }
    document.body.addEventListener('click', collapseMenuOnLoseFocus)
    return () => {
      document.body.removeEventListener('click', collapseMenuOnLoseFocus)
    }
  }, [networkMenuOpen, menuRef]) */

  const getNetworkOptions = useCallback(() => {
    return SupportedChains.map((chain) => {
      return (
        <Option
          id={`connect-${chain.name}`}
          onClick={() => {
            library && switchToNetwork({ library, chainId: chain.chain_id, connector })
          }}
          key={chain.chain_id}
          active={chainId == chain.chain_id}
          color={'blue'}
          // link={option.href}
          header={chain.name}
          subheader={null} //use option.descriptio to bring back multi-line
          icon={chain.logo}
        />
      )
    })
  }, [library, chainId])

  return (
    <UniModal
      maxWidth="40rem"
      maxHeight={61.8}
      isOpen={networkModalOpen}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setNetworkMenuOpen}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="fit-content" width="100%" justifyContent="flex-end">
          <StyledText style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a style={{ fontSize: '2rem' }}>Switch Chain</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setNetworkMenuOpen(false)} />
        </Flex>
        <UniModalContentWrapper>
          <OptionGrid>{getNetworkOptions()}</OptionGrid>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
