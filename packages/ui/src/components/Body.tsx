import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CssValueParser from 'parse-unit'
import { darken } from 'polished'
import { Settings, ArrowDown, ChevronDown } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import styled, { css } from 'styled-components/macro'
import { Flex, Box, Text } from 'rebass/styled-components'
import { ReactComponent as Dropdown } from 'assets/images/dropdown.svg'
import { DefaultButtonRadius, MEDIA_WIDTHS, Z_INDEX } from 'theme'
import { switchToNetwork } from 'helpers/switchToNetwork'
import UniModal from './UniModal'
import SupportedChains, { getChainData } from 'helpers/chains'
import Option from './Option'
import { useActiveWeb3React } from 'hooks/web3'
import { BaseButton, BaseButtonProps, ButtonLight, ButtonPrimary, ButtonDropdown, SelectorButton, ConnectButton } from 'components/Button'
import { StyledText } from 'components/Text'
import { CircledCloseIcon } from 'components/Icon'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { SelectorLogo, SelectorLabel } from './Common'
import NetworkSelectModal from './CutomizedModal/NetworkSelectorModal'
import { useDispatch } from 'hooks'

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
  height: 100%;
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
      : null}
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
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  padding: 0 8px;
  justify-content: space-between;
  margin-right: ${({ hideInput }) => (hideInput ? '0' : '12px')};
  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '18px' : '18px')};
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

export const Text1 = styled(Text)`
  color: ${({ theme }) => theme.text1};
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
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
  const connectStatus = useSelector((state: RootState) => state.application.connectStatus)
  const { active: active, account, activate, chainId, error, library, connector, setError } = useActiveWeb3React()
  // const { activate: activateNetwork } = useWeb3React(NetworkContextName)
  const {
    application: { setNetworkModalOpen },
  } = useDispatch()
  /*   const address = useMemo(() => account ?? '', [account])
  const menuRef = useRef(null) */
  /*const { application: appDispatcher } = useDispatch()
  const appState = useSelector((state: RootState) => state.application)
  const [connectionInfo, setConnectionInfo] = useState({ chainId: 1, address: '', balance: '0' } as connectionInfo)
  const { address, chainId, balance } = useMemo(() => connectionInfo, [connectionInfo])
  const connected = useMemo(() => {
    return has(appState.providerController.currentProvider, 'connection')
  }, [appState.providerController.currentProvider]) */
  const chainData = useMemo(() => {
    let data
    try {
      data = getChainData(chainId)
    } catch (error) {
      setError(error as Error)
    }
    return data
  }, [chainId])
  /* 
  useEffect(() => {
    appState.web3 &&
      Promise.all([appState.web3.eth.getAccounts(), appState.web3.eth.getChainId()]).then(([[address], chainId]) => {
        appState.web3.eth.getBalance(address).then((balance) => {
          setConnectionInfo({
            address,
            chainId,
            balance,
          })
        })
      })
  }, [appState.web3])
 */

  // const switchNetwork = useCallback(
  //   async (chain: IChainData) => {
  //     const formattedChainId = hexStripZeros(BigNumber.from(chain.chain_id).toHexString())
  //     try {
  //       const provider = get(appState, 'web3.currentProvider', {})
  //       const requestFunction = get(provider, 'request', () => {
  //         console.error("this provider doesn't support request")
  //       })
  //       await requestFunction.apply(provider, [
  //         {
  //           method: 'wallet_switchEthereumChain',
  //           params: [{ chainId: formattedChainId }],
  //         },
  //       ])
  //       /*   const requestFunction = get(provider, 'getBalance', () => {
  //         console.error("this provider doesn't support request")
  //       }) */
  //       setNetworkMenuOpen(false)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   },
  //   [appState]
  // )

  /* const getNetworkOptions = useCallback(() => {
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
  }, [library, chainId]) */

  return (
    <>
      <BodyWrapper {...rest}>
        <Flex width="100%" flexDirection="column" justifyContent="space-between" paddingTop="10px">
          <RightTopCornerContainer top={14} right={14} width="20px" height="20px">
            <StyledMenuButton>
              <StyledMenuIcon />
            </StyledMenuButton>
          </RightTopCornerContainer>
          <Flex width="61.8%" justifyContent="space-between" height="40px" marginBottom="5%">
            <Flex alignItems="center" minWidth="60px">
              <Text1 fontWeight={600}>From</Text1>
            </Flex>
            <SelectorButton
              labelContent={`${chainData?.name}`}
              logoSrc={chainData!.logo}
              interactive={false}
              maxWidth="15rem"
              onClick={() => setNetworkModalOpen(true)}
              disabled={!(connectStatus && active)}
            />
          </Flex>
          <Container hideInput={false} marginBottom="2%">
            <Flex width="100%" height="100%" flexDirection="column" justifyContent="space-between">
              <Flex justifyContent="space-between">
                <Text1>Send</Text1>
                <Text1>Max:{/* balance */}</Text1>
              </Flex>
              <Flex>
                <Input type="number" />
                <CurrencySelect
                  visible={true}
                  selected={false}
                  hideInput={false}
                  className="open-currency-select-button"
                  onClick={() => {
                    /* if (onCurrencySelect) {
                      setModalOpen(true)
                    } */
                  }}
                >
                  <Aligner>
                    <RowFixed>
                      {/*  <CurrencyLogo style={{ marginRight: '0.5rem' }} currency={currency} size={'24px'} />
                      <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) || <Trans>Select a token</Trans>}
                      </StyledTokenName>*/}
                    </RowFixed>
                    {/*{onCurrencySelect && <StyledDropDown selected={!!currency} />} */}
                  </Aligner>
                </CurrencySelect>
              </Flex>
            </Flex>
          </Container>
          <Flex marginBottom="2%">
            <ArrowWrapper clickable>
              <ArrowDown
                size="16"
                onClick={() => {
                  /*   setApprovalSubmitted(false) // reset 2 step UI for approvals
              onSwitchTokens() */
                }}
                // color={/* currencies[Field.INPUT] && currencies[Field.OUTPUT] ? */ theme.text1 /* : theme.text3 */}
              />
            </ArrowWrapper>
          </Flex>
          <Flex width="61.8%" justifyContent="space-between" height="40px" marginBottom="5%">
            <Flex alignItems="center" minWidth="60px">
              <Text1 fontWeight={600}>To</Text1>
            </Flex>
            <ButtonLight maxWidth="15rem">
              <SelectorLogo interactive={true} src={chainData!.logo} />
              <SelectorLabel>{chainData?.name}</SelectorLabel>
            </ButtonLight>
          </Flex>
          <Container hideInput={false} marginBottom="5%">
            <Flex width="100%" height="100%">
              <StyledText>{'this is to side'}</StyledText>
            </Flex>
          </Container>
          <Flex justifyContent="center">
            {connectStatus && (
              <ButtonPrimary width="61.8%" fontWeight={900}>
                Transfer
              </ButtonPrimary>
            )}
            {!connectStatus && <ConnectButton />}
          </Flex>
        </Flex>
      </BodyWrapper>
      <NetworkSelectModal />
    </>
  )
}
