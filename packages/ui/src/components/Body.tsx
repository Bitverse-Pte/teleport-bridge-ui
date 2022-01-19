import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useSelector } from 'react-redux'
import { parseEther } from '@ethersproject/units'
import { darken } from 'polished'
import { Settings, ArrowDown } from 'react-feather'
import styled, { css } from 'styled-components/macro'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import BigNumber from 'bignumber.js'
import { MEDIA_WIDTHS, Z_INDEX } from 'theme'
import { TokenInfo, Chain, TokenPairs, NetworkSelectModalMode } from 'constants/types'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { getChainData } from 'helpers/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { ButtonLight, ButtonPrimary, SelectorButton, ConnectButton, ButtonGray } from 'components/Button'
import { RootState } from 'store/store'
import NetworkSelectModal from 'components/CustomizedModal/NetworkSelectorModal'
import { useChain, useDispatch } from 'hooks'
import { useTransferFromEvmContract, useTransferFromTeleContract } from 'contracts/index'
import CurrencySelectModal from 'components/CustomizedModal/CurrencySelectModal'
import { useTokenBalance } from 'hooks/wallet'
import { AlertIcon } from 'components/Icon'
import { Balance } from 'components/Currency'
import Loader from 'components/Loader'
import { SelectorLabel } from 'components/Label'
import { StyledLogo, SelectorLogo } from 'components/Logo'
import { CurrencyInput } from 'components/Input'
import { Text1, TextPrimary1 } from 'components/Text'
import axios from 'axios'
import { BRIDGE_TOKENS__URL } from 'constants/index'

const BodyWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  display: flex;
  width: 50vw;
  margin-top: ${({ margin }) => margin ?? '0px'};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  width: 50vw;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 65vw;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 80vw;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 90vw;
  `}
  @media (min-width: ${MEDIA_WIDTHS.upToLarge}px) {
    max-width: 640px;
  }
  padding: 24px;
  min-height: 20rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.deprecated_zero};
`
const Container = styled(Flex)<{ hideInput: boolean }>`
  min-height: 6.18rem;
  padding: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  border: 1px solid ${({ theme, hideInput }) => (hideInput ? ' transparent' : theme.bg2)};
  background-color: ${({ theme }) => theme.bg1};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  :focus,
  :hover {
    border: 1px solid ${({ theme, hideInput }) => (hideInput ? ' transparent' : theme.bg3)};
  }
`

const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 4px;
  border-radius: 12px;
  height: 32px;
  width: 32px;
  position: relative;
  //   margin-top: -14px;
  //   margin-bottom: -14px;
  left: calc(50% - 16px);
  /* transform: rotate(90deg); */
  background-color: ${({ theme }) => theme.bg6};
  border: 0.15rem solid ${({ theme }) => darken(0.25, theme.bg6)};
  z-index: 2;
  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : css`
          cursor: not-allowed;
          opacity: 0.4;
          pointer-events: none;
        `}
`

const SelectedCurrencyButton = styled(ButtonGray)<{ visible: boolean; selected: boolean; hideInput?: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  align-items: center;
  font-size: 24px;
  display: flex;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg0 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 16px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  height: ${({ hideInput }) => (hideInput ? '2.8rem' : '2.4rem')};
  width: fit-content;
  min-width: 6.18rem;
  padding: 0 8px;
  justify-content: space-around;
  margin-right: ${({ hideInput }) => (hideInput ? '0' : '12px')};
  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
  :disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: unset;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  font-size: ${({ active }) => (active ? '18px' : '18px')};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ ...rest }) {
  const {
    application: { setNetworkModalMode, setCurrencySelectModalOpen, transferTokens, setTokens, setSrcChainId, setDestChainId, setSelectedTokenName },
  } = useDispatch()
  const { connectStatus, selectedTokenName, tokens, networkModalMode, currencySelectModalOpen, availableChains, srcChainId, destChainId } = useSelector((state: RootState) => {
    const { availableChains, selectedTokenName, tokens, networkModalMode, currencySelectModalOpen, connectStatus, srcChainId, destChainId } = state.application
    return { availableChains, selectedTokenName, tokens, networkModalMode, currencySelectModalOpen, connectStatus, srcChainId, destChainId }
  })
  const { active, account, activate, chainId, error, library, connector, setError } = useActiveWeb3React()
  const fromValueInputRef = useRef<any>({})
  const [toValue, setToValue] = useState<BigNumber>(new BigNumber(0))
  const ready = useMemo(() => connectStatus && active && !!account, [connectStatus, active, account])
  const srcChain = useMemo(() => {
    return availableChains.get(srcChainId)
  }, [availableChains, srcChainId])

  const destChain = useMemo(() => {
    return srcChain?.destChains.find((e) => e.chainId === destChainId)
  }, [availableChains, destChainId])

  const selectedTokenPair = useMemo(() => {
    const pairs = tokens.get(`${srcChainId}-${destChainId}`)
    if (pairs) {
      return pairs.find((e) => e.name === selectedTokenName) || pairs[0]
    }
  }, [tokens, selectedTokenName, srcChainId, destChainId])

  useEffect(() => {
    const key = `${srcChainId}-${destChainId}`
    if (!tokens.has(key)) {
      axios.get<TokenPairs[]>(BRIDGE_TOKENS__URL + `/${srcChainId}/${destChainId}`).then(({ data }) => {
        data.forEach(({ srcToken }) => {
          if (!isAddress(srcToken.address)) {
            srcToken.isNative = true
          }
        })
        tokens.set(key, data)
        setTokens(new Map(tokens))
        setSelectedTokenName(data[0].name)
      })
    }
  }, [srcChainId, destChainId, tokens])

  useEffect(() => {
    if (!ready && fromValueInputRef.current && 'value' in fromValueInputRef.current) {
      fromValueInputRef.current.value = new BigNumber(0).toString()
    }
  }, [ready, fromValueInputRef])

  const balance = useTokenBalance(selectedTokenPair && selectedTokenPair!.srcToken)

  const transfer = useCallback(() => {
    if (selectedTokenPair && fromValueInputRef.current && 'value' in fromValueInputRef.current && srcChainId && destChainId) {
      transferTokens({ tokenInfo: selectedTokenPair!.srcToken, amount: fromValueInputRef.current.value, srcChainId, destChainId })
    }
  }, [tokens, selectedTokenPair, fromValueInputRef.current, srcChainId, destChainId])

  const transferBalanceToFromValue = useCallback(() => {
    if (connectStatus && fromValueInputRef.current && 'value' in fromValueInputRef.current && balance) {
      fromValueInputRef.current.value = new BigNumber(balance!.toString()).shiftedBy(-selectedTokenPair!.srcToken.decimals).toString()
    }
  }, [fromValueInputRef, balance, connectStatus, selectedTokenPair])

  return (
    <>
      <BodyWrapper {...rest}>
        <Flex width="100%" flexDirection="column" justifyContent="space-between" paddingTop="10px">
          <Flex width="61.8%" justifyContent="space-between" height="40px" marginBottom="5%">
            <Flex alignItems="center" minWidth="60px">
              <Text1 fontWeight={600}>From</Text1>
            </Flex>
            <SelectorButton
              labelContent={`${srcChain?.name || 'Unavailable'}`}
              logoSrc={srcChain!.icon}
              interactive={false}
              maxWidth="15rem"
              onClick={() => setNetworkModalMode(NetworkSelectModalMode.SRC)}
              // disabled={!ready}
            />
          </Flex>
          <Container hideInput={false} marginBottom="2%">
            <Flex width="100%" height="100%" flexDirection="column" justifyContent="space-between">
              <Flex justifyContent="space-between">
                <Text1>Send</Text1>
                <Flex
                  style={{
                    borderBottom: 'white solid',
                    cursor: connectStatus ? 'pointer' : 'not-allowed',
                  }}
                  onClick={transferBalanceToFromValue}
                >
                  <Text1>{'Max:'}</Text1> &nbsp;
                  {ready && selectedTokenName && selectedTokenPair && balance ? (
                    <Balance balance={balance} currency={selectedTokenPair!.srcToken} />
                  ) : connectStatus && account ? (
                    <Loader size={17} />
                  ) : (
                    <Text1>{'N/A'}</Text1>
                  )}
                </Flex>
              </Flex>
              <br />
              <Flex>
                <CurrencyInput disabled={!ready} style={{ fontSize: '2rem' }} placeholder="0.0" type="number" ref={fromValueInputRef} defaultValue={0} />
                <SelectedCurrencyButton
                  disabled={!ready}
                  visible={true}
                  selected={false}
                  hideInput={true}
                  className="open-currency-select-button"
                  onClick={() => {
                    setCurrencySelectModalOpen(true)
                  }}
                >
                  {selectedTokenPair && <StyledLogo srcs={[selectedTokenPair!.srcToken.logoURI]} size={'24px'} />}
                  {selectedTokenPair && (
                    <StyledTokenName className="token-symbol-container" active={true}>
                      {selectedTokenPair!.srcToken.symbol}
                    </StyledTokenName>
                  )}
                </SelectedCurrencyButton>
              </Flex>
            </Flex>
          </Container>
          <Flex marginBottom="2%">
            <ArrowWrapper clickable={!!connectStatus}>
              <ArrowDown
                size="16"
                onClick={() => {
                  setSrcChainId(destChainId)
                  /*  const newdestChain = fromChainList.find((chain) => chain.chain_id === chainId)
                  setdestChain(newdestChain!)
                  switchToNetwork({ library, chainId: destChain.chain_id }) */
                }}
              />
            </ArrowWrapper>
          </Flex>
          <Flex width="61.8%" justifyContent="space-between" height="40px" marginBottom="5%">
            <Flex alignItems="center" minWidth="60px">
              <Text1 fontWeight={600}>To</Text1>
            </Flex>
            {/* <ButtonLight maxWidth="15rem" disabled={!ready}>
              <SelectorLogo interactive={true} src={destChain!.icon} />
              <SelectorLabel>{destChain!.name}</SelectorLabel>
            </ButtonLight> */}
            <SelectorButton
              labelContent={`${destChain?.name || 'Unavailable'}`}
              logoSrc={destChain!.icon}
              interactive={true}
              maxWidth="15rem"
              onClick={() => setNetworkModalMode(NetworkSelectModalMode.DEST)}
              // disabled={!ready}
            />
          </Flex>
          <Container hideInput={false} marginBottom="5%" flexDirection="column">
            <Flex width="100%" height={'fit-content'}>
              <AlertIcon size={'1rem'} style={{ alignSelf: 'center' }} />
              &nbsp;
              <TextPrimary1 fontWeight={600}>Receive(Estimated):</TextPrimary1>
            </Flex>
            <br />
            <CurrencyInput
              disabled={true}
              style={{ fontSize: '2rem' }}
              type="number"
              placeholder="0.0"
              value={selectedTokenPair ? toValue.shiftedBy(-selectedTokenPair!.srcToken.decimals).toString() : 0}
            />
          </Container>
          <Flex justifyContent="center">
            {connectStatus && (
              <ButtonPrimary width="61.8%" fontWeight={900} onClick={transfer}>
                Transfer
              </ButtonPrimary>
            )}
            {!connectStatus && <ConnectButton />}
          </Flex>
        </Flex>
      </BodyWrapper>
      {networkModalMode !== NetworkSelectModalMode.CLOSE && <NetworkSelectModal />}
      {currencySelectModalOpen && <CurrencySelectModal />}
    </>
  )
}
