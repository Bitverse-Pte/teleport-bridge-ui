import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Flex } from 'rebass/styled-components'
import { useSelector } from 'react-redux'

import bg1 from 'assets/bg-1.svg'
import bg2 from 'assets/bg-2.svg'
import Header from 'components/Header'
// import { hashPersonalMessage, recoverPublicKey, recoverPersonalSignature, formatTestTransaction, getChainData } from './helpers/utils'
import Body from 'components/Body'
import { RootState } from 'store'
import Spinner from 'components/Spinner'
import { TextPrimary1 } from 'components/Text'
import { useDispatch } from 'hooks'
import { BodyWrapper, MarginTopForBodyContent } from 'components/BodyWrapper'

const SLayout = styled(Flex)`
  width: 100%;
  position: relative;
  min-height: 100vh;
  text-align: center;
  background: url(${bg1}) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  > .bg2 {
    background: url(${bg2}) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
`

const ErrorBody = function ({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <Flex flex={1} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'center'}>
      <MarginTopForBodyContent />
      <BodyWrapper>{children}</BodyWrapper>
    </Flex>
  )
}

enum INIT_STATUS {
  starting = 'starting',
  initialized = 'initialized',
  error = 'error',
}

function App() {
  // useConnectStatus()
  // @ts-ignore
  /* public web3Modal: Web3Modal
  public state: IAppState

  constructor(props: any) {
    super(props) */
  const {
    application: { initChains },
  } = useDispatch()
  const [initStatus, setInitStatus] = useState(INIT_STATUS.starting)
  const waitWallet = useSelector((state: RootState) => state.application.waitWallet)

  useEffect(() => {
    initChains()
      .then(() => {
        setInitStatus(INIT_STATUS.initialized)
      })
      .catch((err) => {
        console.error(err)
        setInitStatus(INIT_STATUS.error)
        console.log('set initialized state as error')
      })
  }, [])

  const showBody = useCallback(() => {
    if (waitWallet) {
      return null
    }
    switch (initStatus) {
      case INIT_STATUS.initialized:
        return <Body />
      case INIT_STATUS.error:
        return (
          <ErrorBody>
            <TextPrimary1>Error</TextPrimary1>
          </ErrorBody>
        )
      default:
        return null
    }
  }, [waitWallet, initStatus])

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
        <Flex className={'bg2'} flex={1} flexDirection={'column'} justifyContent={'space-between'}>
          <Header />
          {showBody()}
          {waitWallet && (
            <Spinner>
              <TextPrimary1>This DApp is awaiting response from your wallet.</TextPrimary1>
            </Spinner>
          )}
        </Flex>
      </SLayout>
    </Flex>
  )
}

export default App
