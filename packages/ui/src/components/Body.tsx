import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CssValueParser from 'parse-unit'
import { darken } from 'polished'
import { Settings, ArrowDown, ChevronDown } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import styled, { css } from 'styled-components/macro'
import { Flex, Box, Text } from 'rebass'
import { ReactComponent as Dropdown } from 'assets/images/dropdown.svg'
import { DefaultButtonRadius, MEDIA_WIDTHS, Z_INDEX } from 'theme'
import { switchToNetwork } from 'helpers/switchToNetwork'
import UniModal from './UniModal'
import { getChainData } from 'helpers/chains'
import Option from './Option'
import { useActiveWeb3React } from 'hooks/web3'
import { BaseButton, BaseButtonProps, ButtonLight, ButtonPrimary, ButtonDropdown, SelectorButton, ConnectButton } from 'components/Button'
import { StyledText } from 'components/Text'
import { CircledCloseIcon } from 'components/Icon'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { SelectorLogo, SelectorLabel, StyledLogo } from './Common'
import NetworkSelectModal from './CutomizedModal/NetworkSelectorModal'
import { useDispatch } from 'hooks'
import { useTransferFromTeleContract } from 'contracts/index'
import { RowFixed } from './Row'
import CurrencySelectModal from './CutomizedModal/CurrencySelectModal'
import { pick, debounce } from 'lodash'
import { SupportedChains } from 'constants/chains'
import TELEABI from 'contracts/tele.json'
import { utils } from 'ethers'
import { useTokenBalance } from 'hooks/wallet'
import { AlertIcon } from 'components/Icon'
import { Balance } from './Currency'
import BigNumber from 'bignumber.js'
import { useFromChainList } from 'hooks/useChainList'
import { getContract } from 'helpers'
import Loader from './Loader'

const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`
const NetworkLabel = styled.div`
  flex: 1 1 auto;
`

/* export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}
 */
export const BodyWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
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

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text2};
  }

  :hover {
    opacity: 0.7;
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;
  height: 20px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
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

const RightTopCornerContainer = styled.div<{ top: number; right: number; width?: string; height?: string }>`
  position: absolute;
  top: ${({ top }) => top}px;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  right: ${({ right }) => right}px;
`

const Row = styled(Box)<{
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
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

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

export const ButtonGray = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
  }
`

const CurrencySelect = styled(ButtonGray)<{ visible: boolean; selected: boolean; hideInput?: boolean }>`
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

const StyledDropDown = styled(Dropdown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  font-size: ${({ active }) => (active ? '18px' : '18px')};
`

export const Text1 = styled(Text)`
  color: ${({ theme }) => theme.text1};
`

export const TextPrimary1 = styled(Text)`
  color: ${({ theme }) => theme.primary1};
`

export function DisplayButton({ children, ...rest }: Omit<BaseButtonProps, 'onClick'>) {
  return (
    <ButtonLight {...rest} padding="10px">
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
      </RowBetween>
    </ButtonLight>
  )
}

interface connectionInfo {
  address: string
  chainId: number
  balance: string
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ ...rest }) {
  const {
    application: { setNetworkModalOpen, setCurrencySelectModalOpen, setSelectedCurrency, setDestinationChain },
  } = useDispatch()
  const { connectStatus, selectedCurrency, destinationChain, networkModalOpen, currencySelectModalOpen } = useSelector((state: RootState) =>
    pick(state.application, 'networkModalOpen', 'currencySelectModalOpen', 'connectStatus', 'selectedCurrency', 'destinationChain')
  )
  const { active, account, activate, chainId, error, library, connector, setError } = useActiveWeb3React()
  const fromValueInputRef = useRef<any>({})
  const [fromValue, setFromValue] = useState<BigNumber>(new BigNumber(0))
  const [toValue, setToValue] = useState<BigNumber>(new BigNumber(0))
  const [ready, setReady] = useState(false)
  const fromChainList = useFromChainList()

  const chainData = useMemo(() => {
    let data
    try {
      if (connectStatus) {
        data = getChainData(chainId)
        active && library && setReady(true)
      } else {
        throw null
      }
    } catch (error) {
      data = fromChainList[0]
      setReady(false)
      // setError(error as Error)
    }
    return data
  }, [chainId, connectStatus, active, library])

  useEffect(() => {
    if (chainData && selectedCurrency?.chainId !== chainData.chain_id) {
      setSelectedCurrency(chainData.supportTokens[0])
    }
    setFromValue(new BigNumber(0))
  }, [selectedCurrency, chainData])

  const balance = useTokenBalance(selectedCurrency!)

  const transferBalanceToFromValue = useCallback(() => {
    if (connectStatus && fromValueInputRef.current && 'value' in fromValueInputRef.current && balance) {
      fromValueInputRef.current.value = new BigNumber(balance!.toString()).shiftedBy(-selectedCurrency!.decimals).toString()
    }
  }, [fromValueInputRef, balance, connectStatus, selectedCurrency])

  const transferFromTeleContract = useTransferFromTeleContract()
  const transfer = useCallback(async () => {
    let value = ''
    if (fromValueInputRef.current && 'value' in fromValueInputRef.current) {
      value = fromValueInputRef.current.value
    }
    if (selectedCurrency && library && transferFromTeleContract && account && value) {
      transferFromTeleContract
        .sendTransferBase(
          {
            receiver: account,
            destChain: 'test-eth',
            relayChain: '',
          },
          { value: utils.parseEther(fromValueInputRef.current.value) }
        )
        .then((res: any) => {
          console.log(res)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
  }, [transferFromTeleContract, selectedCurrency, fromValue, library, account, fromValueInputRef])

  return (
    <>
      <BodyWrapper {...rest}>
        <Flex width="100%" flexDirection="column" justifyContent="space-between" paddingTop="10px">
          <RightTopCornerContainer top={14} right={14} width="20px" height="20px">
            <StyledMenuButton disabled={!connectStatus}>
              <StyledMenuIcon cursor={connectStatus ? 'pointer' : 'not-allowed'} />
            </StyledMenuButton>
          </RightTopCornerContainer>
          <Flex width="61.8%" justifyContent="space-between" height="40px" marginBottom="5%">
            <Flex alignItems="center" minWidth="60px">
              <Text1 fontWeight={600}>From</Text1>
            </Flex>
            <SelectorButton labelContent={`${chainData?.name}`} logoSrc={chainData!.logo} interactive={false} maxWidth="15rem" onClick={() => setNetworkModalOpen(true)} disabled={!connectStatus} />
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
                  /* onClick={() => {
                    setFromValue(new BigNumber(balance.toString()).shiftedBy(-selectedCurrency!.decimals))
                  }} */
                >
                  <Text1>{'Max:'}</Text1> &nbsp;
                  {connectStatus && selectedCurrency && balance ? <Balance balance={balance} currency={selectedCurrency} /> : connectStatus && account ? <Loader size={17} /> : <Text1>{'N/A'}</Text1>}
                </Flex>
              </Flex>
              <br />
              <Flex>
                <Input disabled={!connectStatus} style={{ fontSize: '2rem' }} placeholder="0.0" type="number" ref={fromValueInputRef} defaultValue={0} />
                <CurrencySelect
                  disabled={!connectStatus}
                  visible={true}
                  selected={false}
                  hideInput={true}
                  className="open-currency-select-button"
                  onClick={() => {
                    setCurrencySelectModalOpen(true)
                  }}
                >
                  {selectedCurrency && <StyledLogo srcs={[selectedCurrency.logoURI!]} size={'24px'} />}
                  {selectedCurrency && (
                    <StyledTokenName className="token-symbol-container" active={true}>
                      {selectedCurrency!.symbol}
                    </StyledTokenName>
                  )}
                </CurrencySelect>
              </Flex>
            </Flex>
          </Container>
          <Flex marginBottom="2%">
            <ArrowWrapper clickable={connectStatus}>
              <ArrowDown
                size="16"
                onClick={() => {
                  const newDestinationChain = fromChainList.find((chain) => chain.chain_id === chainId)
                  setDestinationChain(newDestinationChain!)
                  switchToNetwork({ library, chainId: destinationChain.chain_id })
                }}
              />
            </ArrowWrapper>
          </Flex>
          <Flex width="61.8%" justifyContent="space-between" height="40px" marginBottom="5%">
            <Flex alignItems="center" minWidth="60px">
              <Text1 fontWeight={600}>To</Text1>
            </Flex>
            <ButtonLight maxWidth="15rem" disabled={!connectStatus}>
              <SelectorLogo interactive={true} src={destinationChain.logo} />
              <SelectorLabel>{destinationChain.name}</SelectorLabel>
            </ButtonLight>
          </Flex>
          <Container hideInput={false} marginBottom="5%" flexDirection="column">
            <Flex width="100%" height={'fit-content'}>
              <AlertIcon size={'1rem'} style={{ alignSelf: 'center' }} />
              &nbsp;
              <TextPrimary1 fontWeight={600}>Receive(Estimated):</TextPrimary1>
            </Flex>
            <br />
            <Input disabled={true} style={{ fontSize: '2rem' }} type="number" placeholder="0.0" value={selectedCurrency ? toValue.shiftedBy(-selectedCurrency!.decimals).toString() : 0} />
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
      {networkModalOpen && <NetworkSelectModal />}
      {currencySelectModalOpen && <CurrencySelectModal />}
    </>
  )
}
