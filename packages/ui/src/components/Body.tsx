import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass'
import { debounce } from 'lodash'
import BigNumber from 'bignumber.js'
import { NetworkSelectModalMode, TRANSFER_STATUS, CURRENCY_INPUT_ERROR } from 'constants/types'
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
import DisabledSwitchSvg from 'assets/disabled-switch.svg'
import { BodyWrapper } from 'components/BodyWrapper'
import { TransferButton } from 'components/Button/TransferButton'
import TransferConfirmationModal from 'components/CustomizedModal/TransferConfirmationModal'
import TransactionDetailModal from 'components/CustomizedModal/TransactionDetailModal'
import { EstimationBlock } from 'components/EstimationBlock'

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
  font-style: normal;
  // text-transform: capitalize;
`

const BalanceWrapper = styled(Flex)<{ clickable?: boolean }>`
  // background: #018d79;
  color: #018d79;
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

const ShadowIcon = styled(Icon)`
  box-shadow: 0 0 1px 1px rgb(0 198 169 / 50%);
  border-radius: ${({ size }) => size / 4 + 'px'};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ ...rest }) {
  const {
    application: { setSelectedTokenName, stopUpdateEstimation, startUpdateEstimation, changeTransferStatus, saveCurrentTokenBalance, setNetworkModalMode, setCurrencySelectModalOpen, judgeAllowance, turnOverSrcAndDestChain },
  } = useDispatch()
  const { connectStatus, selectedTokenName, currentTokenBalance, bridgePairs, currencySelectModalOpen, availableChains, transferStatus, srcChainId, destChainId, networkModalMode, transferConfirmationModalOpen, transactionDetailModalOpen } = useSelector((state: RootState) => {
    const { availableChains, selectedTokenName, currentTokenBalance, bridgePairs, networkModalMode, currencySelectModalOpen, connectStatus, srcChainId, destChainId, transferStatus, transferConfirmationModalOpen, transactionDetailModalOpen } = state.application // avoid to make a too long line
    return { availableChains, selectedTokenName, currentTokenBalance, bridgePairs, currencySelectModalOpen, connectStatus, transferStatus, srcChainId, destChainId, networkModalMode, transferConfirmationModalOpen, transactionDetailModalOpen }
  })
  const [inputError, setInputError] = useState<CURRENCY_INPUT_ERROR>(CURRENCY_INPUT_ERROR.OK)
  const { active, account, activate, chainId, error, library, connector, setError } = useActiveWeb3React()
  const fromValueInputRef = useRef<any>({})
  const toValueInputRef = useRef<any>({})
  // const [toValue, setToValue] = useState<BigNumber>(new BigNumber(0))
  const chainReady = useMemo(() => {
    if (chainId && srcChainId == chainId) {
      return availableChains.has(chainId)
    }
    return false
  }, [availableChains, chainId, srcChainId])
  const walletReady = useMemo(() => Boolean(connectStatus && active && chainReady && !!account), [chainReady, connectStatus, active, account])
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
      return tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName) || tokens[0]
    }
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  useEffect(() => {
    if (walletReady && fromValueInputRef.current && 'value' in fromValueInputRef.current && fromValueInputRef.current.value) {
      changeTransferStatus(TRANSFER_STATUS.PENDING_ALLOWANCE)
    }
  }, [walletReady, fromValueInputRef.current])

  useEffect(() => {
    const pairKey = `${srcChainId}-${destChainId}`
    if (bridgePairs.has(pairKey)) {
      const selectedPair = bridgePairs.get(pairKey)
      if (selectedPair && !selectedPair?.tokens.some((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName)) {
        setSelectedTokenName(selectedPair.tokens[0].srcToken.name!)
      }
    }
    // updateBridgeInfo({ srcChainId, destChainId })
    //update inputs value
    const fromInput = document.getElementById('fromValueInput')
    const toInput = document.getElementById('toValueInput')
    if (fromInput) {
      ;(fromInput as HTMLInputElement).value = ''
    }
    if (toInput) {
      ;(toInput as HTMLInputElement).value = ''
    }
  }, [srcChainId, destChainId, bridgePairs, selectedTokenName])

  useEffect(() => {
    if (!walletReady && fromValueInputRef.current && 'value' in fromValueInputRef.current) {
      fromValueInputRef.current.value = undefined
    } else if (walletReady && fromValueInputRef.current && 'value' in fromValueInputRef.current && !fromValueInputRef.current.value) {
      changeTransferStatus(TRANSFER_STATUS.NO_INPUT)
    }
  }, [walletReady, fromValueInputRef.current.value])

  const updateAllowance = useCallback(
    debounce(async () => {
      if (walletReady && fromValueInputRef.current && 'value' in fromValueInputRef.current && selectedTokenPair) {
        fromValueInputRef.current.value && (await judgeAllowance({ value: fromValueInputRef.current.value, tokenInfo: selectedTokenPair?.srcToken }))
      }
    }, 400),
    [fromValueInputRef, selectedTokenPair, walletReady]
  )

  const resetEstimationUpdatePolling = useCallback(() => {
    stopUpdateEstimation()
    if (srcChainId && destChainId && bridgePairs && selectedTokenName && fromValueInputRef.current && fromValueInputRef.current.value) {
      startUpdateEstimation(fromValueInputRef.current.value)
    }
  }, [srcChainId, destChainId, bridgePairs, selectedTokenName, fromValueInputRef])

  const judgeBalance = useCallback(() => {
    if (!selectedTokenPair) {
      return
    }
    if (fromValueInputRef.current.value) {
      const parsedCurrentTokenBalance = new BigNumber(currentTokenBalance!.toHexString()).div(`1e+${selectedTokenPair?.srcToken.decimals}`)
      const currentTokenBaseBit = new BigNumber(1).div(`1e+${selectedTokenPair?.srcToken.decimals}`)
      const parsedValue = new BigNumber(fromValueInputRef.current.value)
      if (parsedCurrentTokenBalance.isLessThan(parsedValue)) {
        setInputError(CURRENCY_INPUT_ERROR.INSUFFICIENT)
      } else if (parsedValue.isNegative() || parsedValue.isLessThan(currentTokenBaseBit)) {
        setInputError(CURRENCY_INPUT_ERROR.INVALID)
      } else {
        setInputError(CURRENCY_INPUT_ERROR.OK)
      }
    } else {
      setInputError(CURRENCY_INPUT_ERROR.OK)
    }
  }, [fromValueInputRef, selectedTokenPair, currentTokenBalance])

  useEffect(() => {
    judgeBalance()
  }, [selectedTokenPair, fromValueInputRef, currentTokenBalance])

  const fromInputChange = useCallback(() => {
    if (!selectedTokenPair) {
      return
    }
    judgeBalance()
    changeTransferStatus(TRANSFER_STATUS.PENDING_ALLOWANCE)
    // Dispatch the keyup event, so make the estimation update correctly.
    const event = new Event('keyup')
    fromValueInputRef.current.dispatchEvent(event)

    if (walletReady) {
      updateAllowance()
    }
    if (toValueInputRef.current) {
      toValueInputRef.current.value = fromValueInputRef.current.value || null
    }
    resetEstimationUpdatePolling()
  }, [transferStatus, fromValueInputRef, selectedTokenPair, toValueInputRef, currentTokenBalance])

  useEffect(() => {
    resetEstimationUpdatePolling()
  }, [selectedTokenPair, srcChainId, chainId, selectedTokenName, toValueInputRef])

  useEffect(() => {
    library && account && srcChainId === chainId && selectedTokenPair && saveCurrentTokenBalance(undefined)
  }, [selectedTokenPair, srcChainId, chainId, library, account, selectedTokenName])

  const transferBalanceToFromValue = useCallback(() => {
    if (connectStatus && fromValueInputRef.current && 'value' in fromValueInputRef.current && currentTokenBalance) {
      fromValueInputRef.current.value = new BigNumber(currentTokenBalance!.toString()).shiftedBy(-selectedTokenPair!.srcToken.decimals).toString()
      fromInputChange()
    }
  }, [fromValueInputRef, currentTokenBalance, connectStatus, selectedTokenPair, transferStatus, toValueInputRef])

  return (
    <>
      <Flex flex={1} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <BodyWrapper {...rest}>
          <Flex width="100%" flexDirection="column" justifyContent="space-between">
            <Container hideInput={false}>
              <Flex width="100%" justifyContent="space-between" height="40px">
                <Flex alignItems="center" minWidth="60px">
                  <Text1 fontWeight={600}>From</Text1>
                </Flex>
                <Flex justifyContent="space-between" padding={'0.5rem'}>
                  <BalanceWrapper clickable={!!(walletReady && selectedTokenName && selectedTokenPair && currentTokenBalance)} onClick={transferBalanceToFromValue}>
                    <DarkGreenText>{'Max ≈'}&nbsp;</DarkGreenText>
                    {walletReady && selectedTokenName && selectedTokenPair && currentTokenBalance ? <Balance balance={currentTokenBalance!} currency={selectedTokenPair!.srcToken} /> : walletReady && connectStatus && account ? <Loader size={17} color="white" /> : <DarkGreenText>N/A</DarkGreenText>}
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
                    fontWeight={600}
                    fontSize="1rem"
                    lineHeight="1.3125rem"
                    disabled={!walletReady}
                  />
                </Flex>
                <Flex flex={1} padding="0 1rem">
                  <CurrencyInput
                    id={'fromValueInput'}
                    error={inputError}
                    disabled={!walletReady || !selectedTokenPair || !currentTokenBalance}
                    style={{ fontSize: '2rem', textAlign: 'center' }}
                    min={selectedTokenPair && Math.pow(10, -(selectedTokenPair?.srcToken.decimals ?? 18))}
                    placeholder="0.0"
                    type="number"
                    ref={fromValueInputRef}
                    onChange={fromInputChange}
                    // defaultValue={0}
                  />
                </Flex>
                <Flex>
                  <DarkenedSelectorButton
                    labelContent={`${selectedTokenPair ? selectedTokenPair!.srcToken.symbol ?? '' : ''}`}
                    logoSrc={selectedTokenPair && selectedTokenPair!.srcToken.logoURI}
                    disabled={!walletReady || !(connectStatus && account) || !selectedTokenPair}
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
              <ArrowWrapper clickable={chainReady && walletReady} onClick={() => turnOverSrcAndDestChain(undefined)}>
                <Icon size={48} src={chainReady && walletReady ? SwitchSvg : DisabledSwitchSvg} />
              </ArrowWrapper>
            </WormHoleWrapper>
            <Container hideInput={false}>
              <Flex width="100%" justifyContent="space-between">
                <Flex alignItems="center" minWidth="60px">
                  <Text1 fontWeight={600}>To</Text1>
                </Flex>
                <Flex height={'fit-content'}>
                  <Text2 fontWeight={500}>Receive(Estimated)</Text2>
                  {/* &nbsp;
                  <HelpIcon size={'1rem'} style={{ alignSelf: 'center' }} /> */}
                </Flex>
              </Flex>
              <br />
              <Flex width="100%" justifyContent="space-between">
                <Flex>
                  <DarkenedSelectorButton
                    width="10rem"
                    fontSize="1rem"
                    lineHeight="1.3125rem"
                    disabled={!walletReady}
                    labelContent={`${destChain!.name.length > 10 ? destChain?.shortName : destChain?.name || 'Unavailable'}`}
                    logoSrc={destChain && destChain!.icon}
                    fontWeight={600}
                    interactive={true}
                    onClick={() => setNetworkModalMode(NetworkSelectModalMode.DEST)}
                    // disabled={!ready}
                  />
                </Flex>
                <Flex flex={1} padding="0 1rem">
                  <CurrencyInput
                    disabled={true}
                    ref={toValueInputRef}
                    id={'toValueInput'}
                    style={{ fontSize: '2rem', textAlign: 'center' }}
                    step={selectedTokenPair && Math.pow(10, -(selectedTokenPair?.srcToken.decimals ?? 18))}
                    type="number"
                    placeholder="0.0"
                    // value={selectedTokenPair ? toValue.shiftedBy(-selectedTokenPair!.srcToken.decimals).toString() : 0}
                  />
                </Flex>
                <Flex>
                  <DarkenedSelectorButton
                    labelContent={`${selectedTokenPair ? selectedTokenPair!.destToken.symbol ?? '' : ''}`}
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
              {/*  <PrimaryButton width="100%" fontWeight={900} onClick={transfer}>
                {pending && <BaseSpinner warning={false} size={'1rem'}></BaseSpinner>}
                {connectStatus ? 'Transfer' : 'Connect'}
              </PrimaryButton> */}
              <TransferButton error={inputError} />
            </Flex>
          </Flex>
        </BodyWrapper>
        <EstimationBlock style={{ width: '44vw', maxWidth: '512px', borderRadius: '0 0 0.5rem 0.5rem', borderWidth: '0px 1px 1px 1px' }} />
      </Flex>
      {networkModalMode && <NetworkSelectModal />}
      {currencySelectModalOpen && <CurrencySelectModal />}
      {transferConfirmationModalOpen && <TransferConfirmationModal />}
      {transactionDetailModalOpen && <TransactionDetailModal />}
    </>
  )
}
