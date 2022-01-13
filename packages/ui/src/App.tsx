import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'
import { Flex } from 'rebass'
import { convertUtf8ToHex } from '@walletconnect/utils'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider'
// @ts-ignore
import Fortmatic from 'fortmatic'
import Torus from '@toruslabs/torus-embed'
import { Bitski } from 'bitski'

import { SButtonPrimary } from './components/Button'
import Column from './components/Column'
import Wrapper from './components/Wrapper'
import Modal from './components/Modal'
import Header from './components/Header'
import Loader from './components/Loader'
import ModalResult from './components/ModalResult'
import AccountAssets from './components/AccountAssets'
import ConnectButton from './components/Button/ConnectButton'

import { apiGetAccountAssets } from './helpers/api'
// import { hashPersonalMessage, recoverPublicKey, recoverPersonalSignature, formatTestTransaction, getChainData } from './helpers/utils'
import { ICurrency, IBoxProfile } from './helpers/types'
import { fonts } from './styles'
import { openBox, getProfile } from './helpers/box'
import { ETH_SEND_TRANSACTION, ETH_SIGN, PERSONAL_SIGN, BOX_GET_PROFILE, DAI_BALANCE_OF, DAI_TRANSFER } from './constants'
import { callBalanceOf, callTransfer } from './helpers/web3'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useDispatch, useProviderController } from 'hooks'
import { render } from 'blockies-ts'
import Body from 'components/Body'
import UniModal from 'components/UniModal'
import { truncate } from 'fs'
import { useActiveWeb3React } from 'hooks/web3'

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.bg0};
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`

const SLanding = styled(Column)`
  height: 600px;
`

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`

const SModalParagraph = styled.p`
  margin-top: 30px;
`

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`

const STestButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`

const STestButton = styled(SButtonPrimary)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  max-width: 175px;
  margin: 12px;
`

interface IAppState {
  fetching: boolean
  address: string
  web3: any
  provider: any
  connected: boolean
  chainId: number
  networkId: number
  assets: ICurrency[]
  showModal: boolean
  pendingRequest: boolean
  result: any | null
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
}

function App() {
  // useConnectStatus()
  // @ts-ignore
  /* public web3Modal: Web3Modal
  public state: IAppState

  constructor(props: any) {
    super(props) */

  return (
    <SLayout>
      <Header />
      <Body />
    </SLayout>
  )
}

export default App
