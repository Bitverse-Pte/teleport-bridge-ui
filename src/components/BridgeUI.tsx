import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Flex } from 'rebass'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { RefreshCw } from 'react-feather'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import 'react-toastify/dist/ReactToastify.css'

import bg1 from 'public/bg-1.svg'
import bg2 from 'public/bg-2.svg'
import Header from 'components/Header'
// import { hashPersonalMessage, recoverPublicKey, recoverPersonalSignature, formatTestTransaction, getChainData } from './helpers/utils'
import Body from 'components/Body'
import { RootState } from 'store'
import Spinner from 'components/Spinner'
import { TextPrimary1 } from 'components/Text'
import { useDispatch } from 'hooks'
import { BodyWrapper } from 'components/BodyWrapper'
import { errorNoti } from 'helpers/notifaction'
import { INIT_STATUS } from 'constants/types'
import Image from 'components/Image'
import CurrencySelectModal from './CustomizedModal/CurrencySelectModal'
import HistoryModal from './CustomizedModal/HistoryModal'
import NetworkSelectModal from './CustomizedModal/NetworkSelectorModal'
import TransactionDetailModal from './CustomizedModal/TransactionDetailModal'
import TransferConfirmationModal from './CustomizedModal/TransferConfirmationModal'
import WalletSelectModal from './CustomizedModal/WalletSelectModal'
// import { demo } from 'helpers/demo'

const SLayout = styled(Flex)`
  width: 100%;
  position: relative;
  min-height: 100vh;
  text-align: center;
  // background: url(${bg1}) no-repeat center center fixed;
  // -webkit-background-size: cover;
  // -moz-background-size: cover;
  // -o-background-size: cover;
  // background-size: cover;
  // > .bg2 {
  //   background: url(${bg2}) no-repeat center center fixed;
  //   -webkit-background-size: cover;
  //   -moz-background-size: cover;
  //   -o-background-size: cover;
  //   background-size: cover;
  // }
`

const Refresh = styled(RefreshCw)<{ disabled: boolean }>`
  :hover {
    opacity: 0.6;
  }
  ${({ disabled }) => {
    return `
    cursor:${disabled ? 'not-allowed' : 'pointer'};
    `
  }}
`

const ErrorBody = function ({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <Flex flex={1} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <BodyWrapper>{children}</BodyWrapper>
    </Flex>
  )
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [showSpinner, setShowSpinner] = useState(true)
  useEffect(() => {
    if (!showSpinner) {
      resetErrorBoundary()
    }
  }, [showSpinner])
  return (
    <Spinner closable={true} showSpinner={showSpinner} setShowSpinner={setShowSpinner}>
      <TextPrimary1>{`TelePort Bridge has encounter some unexpected issue
         we recommand you refresh the page
         or you can close this mask after 10 seconds.`}</TextPrimary1>
      <pre>{error.message}</pre>
    </Spinner>
  )
}

export default function BridgeUI() {
  const { account } = useSelector((state: RootState) => {
    const { account } = state.evmCompatibles
    return { account }
  })
  const theme = useTheme()
  const {
    application: { initChains, initTransactions, setWaitWallet, resetApp, stopTransactionHistoryUpdating, setInitStatus },
  } = useDispatch()
  /*  const [initStatus, setInitStatus] = useState(INIT_STATUS.initialized)
   */
  const [inFetching, setInFetching] = useState(false)
  const waitWallet = useSelector((state: RootState) => state.application.waitWallet)
  const connectStatus = useSelector((state: RootState) => state.application.connectStatus)
  const initStatus = useSelector((state: RootState) => state.application.initStatus)
  const transactions = useSelector((state: RootState) => state.application.transactions)
  // const inFetching = useSelector((state: RootState) => state.application.inFetching)

  const initEssentialData = useCallback(() => {
    if (inFetching) {
      return
    }
    setInFetching(true)
    setInitStatus(INIT_STATUS.starting)
    Promise.all([initChains()])
      .then(() => {
        setInitStatus(INIT_STATUS.initialized)
      })
      .catch((err) => {
        errorNoti(`failed to load essential data`)
        setInitStatus(INIT_STATUS.error)
      })
      .finally(() => {
        setInFetching(false)
      })
  }, [inFetching])

  // useEffect(() => {
  //   initEssentialData()
  // }, [])
  useEffect(() => {
    connectStatus && account && initTransactions(account)
    if (!connectStatus || !account) {
      stopTransactionHistoryUpdating()
    }
  }, [account, connectStatus])

  const showBody = useCallback(() => {
    switch (initStatus) {
      case INIT_STATUS.initialized:
        return (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              resetApp(undefined)
            }}
          >
            <Body />
            <NetworkSelectModal />
            <CurrencySelectModal />
            <TransferConfirmationModal />
            {!transactions.isEmpty() && <TransactionDetailModal />}
            <WalletSelectModal />
            <HistoryModal />
          </ErrorBoundary>
        )
      case INIT_STATUS.error:
        return (
          <ErrorBody>
            <Flex minHeight={'100%'} width={'100%'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              <TextPrimary1>Failed to load essential data!</TextPrimary1>
              <TextPrimary1>Please click refresh button to retry.</TextPrimary1>
              <br />
              <Refresh size={32} color={theme.primary1} onClick={initEssentialData} disabled={inFetching} />
            </Flex>
          </ErrorBody>
        )
      default:
        return <Spinner closable={false} showSpinner={true} />
    }
  }, [initStatus, inFetching, transactions])

  return (
    <Flex
      css={css`
        width: 100%;
        position: relative;
        min-height: 100vh;
        text-align: center;
        background-color: black;
      `}
      flexDirection={'column'}
      justifyContent={'center'}
    >
      <SLayout flexDirection={'column'} justifyContent={'center'}>
        <Image src={bg1} layout="fill" alt={'bg1'} objectFit="cover" quality={100}></Image>
        <Image src={bg2} layout="fill" alt={'bg2'} objectFit="cover" quality={100}></Image>
        <Flex className={'bg2'} flex={1} flexDirection={'column'} justifyContent={'space-between'}>
          <Header />
          {showBody()}
          <Spinner closable={true} showSpinner={waitWallet} setShowSpinner={setWaitWallet}>
            <TextPrimary1>This DApp is waiting response from your wallet.</TextPrimary1>
          </Spinner>
          <ToastContainer pauseOnFocusLoss={true} limit={8} draggable={true} autoClose={10000} theme="dark" />
        </Flex>
      </SLayout>
    </Flex>
  )
}
