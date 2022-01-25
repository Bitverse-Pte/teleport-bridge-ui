import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass'
import BigNumber from 'bignumber.js'
import { BigNumber as EhterBigNumber } from '@ethersproject/bignumber'
import { NetworkSelectModalMode } from 'constants/types'
import { useActiveWeb3React } from 'hooks/web3'
import { SelectorButton, ButtonGray, PrimaryButton } from 'components/Button'
import { RootState } from 'store/store'
import NetworkSelectModal from 'components/CustomizedModal/NetworkSelectorModal'
import { useDispatch } from 'hooks'
import CurrencySelectModal from 'components/CustomizedModal/CurrencySelectModal'
import { HelpIcon, Icon } from 'components/Icon'
import { Balance } from 'components/Currency'
import Loader from 'components/Loader'
import { CurrencyInput } from 'components/Input'
import { Text1, Text2, DarkGreenText } from 'components/Text'
import WormHole from 'assets/wormhole.svg'
import SwitchSvg from 'assets/switch.svg'
import { getBalance } from 'helpers/web3'
import { BodyWrapper, MarginTopForBodyContent } from 'components/BodyWrapper'

const Container = styled(Flex)<{ hideInput: boolean }>`
  border-radius: 0.5rem;
  flex-direction: column;
  padding: 1.5rem;
  min-height: 6.18rem;
  // border: 1px solid ${({ theme, hideInput }) => (hideInput ? ' transparent' : theme.bg2)};
  background-color: #000;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  /* :focus,
  :hover {
    border: 1px solid ${({ theme, hideInput }) => (hideInput ? ' transparent' : theme.bg3)};
  } */
`

const ArrowWrapper = styled.div<{ clickable: boolean }>`
  height: 32px;
  width: 32px;
  position: absolute;
  left: calc(50% - 16px);
  display: flex;
  justify-content: center;
  align-items: center;
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

const WormHoleWrapper = styled(Flex)`
  background: url(${WormHole}) no-repeat center;
  height: 88px;
  width: 100%;
  align-items: center;
  flex-direction: row-reverse;
`

const DarkenedSelectorButton = styled(SelectorButton)`
  background: #000000;
  height: 2.625rem;
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight};`}
  ${({ fontSize }) => fontSize && `font-size: ${String(fontSize)};`}
  ${({ lineHeight }) => lineHeight && `line-height: ${String(lineHeight)};`}
  box-shadow: 0px 0px 4px 2px #222529;
  border-radius: 6rem;
  font-family: IBM Plex Sans;
  font-style: normal;
  text-transform: capitalize;
`

const BalanceWrapper = styled(Flex)<{ clickable?: boolean }>`
  // background: #018d79;
  color: #018d79;
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: right;
  text-transform: capitalize;
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
        `}
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ ...rest }) {
  const {
    application: { setNetworkModalMode, setCurrencySelectModalOpen, transferTokens, updateBridgeInfo, turnOverSrcAndDestChain },
  } = useDispatch()
  const { connectStatus, selectedTokenName, bridgePairs, networkModalMode, currencySelectModalOpen, availableChains, srcChainId, destChainId } = useSelector((state: RootState) => {
    const { availableChains, selectedTokenName, bridgePairs, networkModalMode, currencySelectModalOpen, connectStatus, srcChainId, destChainId } = state.application
    return { availableChains, selectedTokenName, bridgePairs, networkModalMode, currencySelectModalOpen, connectStatus, srcChainId, destChainId }
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
    const pair = bridgePairs.get(`${srcChainId}-${destChainId}`)
    if (pair) {
      const { tokens } = pair
      return tokens.find((e) => e.name === selectedTokenName) || tokens[0]
    }
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  useEffect(() => {
    updateBridgeInfo({ srcChainId, destChainId })
  }, [srcChainId, destChainId, bridgePairs])

  useEffect(() => {
    if (!ready && fromValueInputRef.current && 'value' in fromValueInputRef.current) {
      fromValueInputRef.current.value = new BigNumber(0).toString()
    }
  }, [ready, fromValueInputRef])

  const [balance, setBalance] = useState<EhterBigNumber | undefined>(undefined)
  useEffect(() => {
    library &&
      account &&
      srcChainId === chainId &&
      selectedTokenPair &&
      getBalance(selectedTokenPair?.srcToken, library, account).then((res) => {
        setBalance(res)
      })
  }, [selectedTokenPair, srcChainId, chainId, library, account, selectedTokenName])

  const transfer = useCallback(() => {
    if (selectedTokenPair && fromValueInputRef.current && 'value' in fromValueInputRef.current && srcChainId && destChainId) {
      transferTokens({ tokenInfo: selectedTokenPair!.srcToken, amount: fromValueInputRef.current.value, srcChainId, destChainId })
    }
  }, [bridgePairs, selectedTokenPair, fromValueInputRef.current, srcChainId, destChainId])

  const transferBalanceToFromValue = useCallback(() => {
    if (connectStatus && fromValueInputRef.current && 'value' in fromValueInputRef.current && balance) {
      fromValueInputRef.current.value = new BigNumber(balance!.toString()).shiftedBy(-selectedTokenPair!.srcToken.decimals).toString()
    }
  }, [fromValueInputRef, balance, connectStatus, selectedTokenPair])

  return (
    <>
      <Flex flex={1} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'center'}>
        <MarginTopForBodyContent />
        <BodyWrapper {...rest}>
          <Flex width="100%" flexDirection="column" justifyContent="space-between">
            <Container hideInput={false}>
              <Flex width="100%" justifyContent="space-between" height="40px">
                <Flex alignItems="center" minWidth="60px">
                  <Text1 fontWeight={600}>Send</Text1>
                </Flex>
                <Flex justifyContent="space-between" padding={'0.5rem'}>
                  <BalanceWrapper clickable={!!(ready && selectedTokenName && selectedTokenPair && balance)} onClick={transferBalanceToFromValue}>
                    <DarkGreenText>{'Max ≈'}&nbsp;</DarkGreenText>
                    {ready && selectedTokenName && selectedTokenPair && balance ? (
                      <Balance balance={balance!} currency={selectedTokenPair!.srcToken} />
                    ) : connectStatus && account ? (
                      <Loader size={17} color="white" />
                    ) : (
                      <DarkGreenText>N/A</DarkGreenText>
                    )}
                  </BalanceWrapper>
                </Flex>
              </Flex>
              <br />
              <Flex width="100%" flexDirection="row" justifyContent="space-between">
                <Flex>
                  <DarkenedSelectorButton
                    labelContent={`${srcChain!.name.length > 10 ? srcChain?.shortName : srcChain?.name || 'Unavailable'}`}
                    logoSrc={srcChain!.icon}
                    interactive={false}
                    width="10rem"
                    onClick={() => setNetworkModalMode(NetworkSelectModalMode.SRC)}
                    fontSize="1rem"
                    lineHeight="1.3125rem"
                    // disabled={!ready}
                  />
                </Flex>
                <Flex flex={1} padding="0 1rem">
                  <CurrencyInput
                    disabled={!ready}
                    style={{ fontSize: '2rem' }}
                    step={selectedTokenPair && Math.pow(10, -(selectedTokenPair?.srcToken.decimals ?? 18))}
                    placeholder="0.0"
                    type="number"
                    ref={fromValueInputRef}
                    // defaultValue={0}
                  />
                </Flex>
                <Flex>
                  <DarkenedSelectorButton
                    labelContent={`${selectedTokenPair ? selectedTokenPair!.srcToken.name ?? '' : ''}`}
                    logoSrc={selectedTokenPair && selectedTokenPair!.srcToken.logoURI}
                    disabled={!(connectStatus && account) || !selectedTokenPair}
                    interactive={false}
                    width="10rem"
                    fontWeight={600}
                    fontSize="1.25rem"
                    lineHeight="1.625rem"
                    onClick={() => setCurrencySelectModalOpen(true)}
                  />
                </Flex>
              </Flex>
            </Container>
            <WormHoleWrapper paddingRight="1.5rem">
              <ArrowWrapper clickable={!!connectStatus} onClick={() => turnOverSrcAndDestChain(undefined)}>
                <Icon size={32} src={SwitchSvg} />
              </ArrowWrapper>
            </WormHoleWrapper>
            <Container hideInput={false}>
              <Flex width="100%" justifyContent="space-between">
                <Flex alignItems="center" minWidth="60px">
                  <Text1 fontWeight={600}>To</Text1>
                </Flex>
                <Flex height={'fit-content'}>
                  <Text2 fontWeight={500}>Receive(Estimated)</Text2>
                  &nbsp;
                  <HelpIcon size={'1rem'} style={{ alignSelf: 'center' }} />
                </Flex>
              </Flex>
              <br />
              <Flex width="100%" justifyContent="space-between">
                <Flex>
                  <DarkenedSelectorButton
                    width="10rem"
                    fontSize="1rem"
                    lineHeight="1.3125rem"
                    labelContent={`${destChain!.name.length > 10 ? destChain?.shortName : destChain?.name || 'Unavailable'}`}
                    logoSrc={destChain && destChain!.icon}
                    interactive={true}
                    onClick={() => setNetworkModalMode(NetworkSelectModalMode.DEST)}
                    // disabled={!ready}
                  />
                </Flex>
                <Flex flex={1} padding="0 1rem">
                  <CurrencyInput
                    disabled={true}
                    style={{ fontSize: '2rem' }}
                    step={selectedTokenPair && Math.pow(10, -(selectedTokenPair?.srcToken.decimals ?? 18))}
                    type="number"
                    placeholder="0.0"
                    // value={selectedTokenPair ? toValue.shiftedBy(-selectedTokenPair!.srcToken.decimals).toString() : 0}
                  />
                </Flex>
                <Flex>
                  <DarkenedSelectorButton
                    labelContent={`${selectedTokenPair ? selectedTokenPair!.destToken.name ?? '' : ''}`}
                    logoSrc={selectedTokenPair && selectedTokenPair!.destToken.logoURI}
                    disabled={true}
                    interactive={false}
                    width="10rem"
                    fontWeight={600}
                    fontSize="1.25rem"
                    lineHeight="1.625rem"
                  />
                </Flex>
              </Flex>
            </Container>
            <Flex
              justifyContent="center"
              css={css`
                padding: 1.5rem 0 0 0;
              `}
            >
              <PrimaryButton width="100%" fontWeight={900} onClick={transfer}>
                {connectStatus ? 'Transfer' : 'Connect'}
              </PrimaryButton>
            </Flex>
          </Flex>
        </BodyWrapper>
      </Flex>
      {networkModalMode !== NetworkSelectModalMode.CLOSE && <NetworkSelectModal />}
      {currencySelectModalOpen && <CurrencySelectModal />}
    </>
  )
}
