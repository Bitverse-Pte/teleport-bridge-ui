import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { parseEther } from '@ethersproject/units'
import { darken } from 'polished'
import { Settings, ArrowDown } from 'react-feather'
import styled, { css } from 'styled-components/macro'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import BigNumber from 'bignumber.js'
import { MEDIA_WIDTHS, Z_INDEX } from 'theme'
import { switchToNetwork } from 'helpers/switchToNetwork'
import { getChainData } from 'helpers/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { ButtonLight, ButtonPrimary, SelectorButton, ConnectButton, ButtonGray } from 'components/Button'
import { RootState } from 'store/store'
import NetworkSelectModal from 'components/CustomizedModal/NetworkSelectorModal'
import { useDispatch } from 'hooks'
import { useTransferFromEvmContract, useTransferFromTeleContract } from 'contracts/index'
import CurrencySelectModal from 'components/CustomizedModal/CurrencySelectModal'
import { useTokenBalance } from 'hooks/wallet'
import { AlertIcon, ERC20Icon } from 'components/Icon'
import { Balance } from 'components/Currency'
import { useFromChainList } from 'hooks/useChainList'
import Loader from 'components/Loader'
import { SelectorLabel } from 'components/Label'
import { StyledLogo, SelectorLogo } from 'components/Logo'
import { CurrencyInput } from 'components/Input'

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

export const Text1 = styled(Text)`
  color: ${({ theme }) => theme.text1};
`

export const TextPrimary1 = styled(Text)`
  color: ${({ theme }) => theme.primary1};
`

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
  const transferFromEvmContract = useTransferFromEvmContract()
  const transfer = useCallback(async () => {
    let value = ''
    if (fromValueInputRef.current && 'value' in fromValueInputRef.current) {
      value = fromValueInputRef.current.value
    }
    if (chainId === 9000) {
      if (selectedCurrency && library && transferFromTeleContract && account && value) {
        transferFromTeleContract
          .sendTransferBase(
            {
              receiver: account,
              destChain: 'test-eth',
              relayChain: '',
            },
            { value: parseEther(fromValueInputRef.current.value) }
          )
          .then((res: any) => {
            console.log(res)
          })
          .catch((err: any) => {
            console.error(err)
          })
      }
    } else if (chainId === 4) {
      if (selectedCurrency && library && transferFromEvmContract && account && value) {
        transferFromEvmContract
          .sendTransferBase(
            {
              receiver: account,
              destChain: 'bitos',
              relayChain: '',
            },
            { value: parseEther(fromValueInputRef.current.value) }
          )
          .then((res: any) => {
            console.log(res)
          })
          .catch((err: any) => {
            console.error(err)
          })
      }
    }
  }, [transferFromTeleContract, selectedCurrency, fromValue, library, account, fromValueInputRef])

  return (
    <>
      <BodyWrapper {...rest}>
        <Flex width="100%" flexDirection="column" justifyContent="space-between" paddingTop="10px">
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
                <CurrencyInput disabled={!connectStatus} style={{ fontSize: '2rem' }} placeholder="0.0" type="number" ref={fromValueInputRef} defaultValue={0} />
                <SelectedCurrencyButton
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
                  {/* {selectedCurrency && <ERC20Icon contractAddress={selectedCurrency.address} />} */}
                </SelectedCurrencyButton>
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
            <CurrencyInput disabled={true} style={{ fontSize: '2rem' }} type="number" placeholder="0.0" value={selectedCurrency ? toValue.shiftedBy(-selectedCurrency!.decimals).toString() : 0} />
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
