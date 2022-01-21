import React, { useEffect, useState } from 'react'
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
import { useActiveWeb3React } from 'hooks/web3'
import { useDispatch } from 'hooks'

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
  const [initialized, setInitialized] = useState(false)
  const waitWallet = useSelector((state: RootState) => state.application.waitWallet)

  useEffect(() => {
    initChains().then(() => {
      setInitialized(true)
    })
  }, [])

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
          {initialized && <Body />}
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
