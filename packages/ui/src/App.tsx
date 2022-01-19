import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass/styled-components'
import { useSelector } from 'react-redux'

import Header from './components/Header'
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
  background-color: ${({ theme }) => theme.bg0};
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
    <SLayout flexDirection={'column'} justifyContent={'center'}>
      <Header />
      {initialized && <Body />}
      {waitWallet && (
        <Spinner>
          <TextPrimary1>This DApp is awaiting response from your wallet.</TextPrimary1>
        </Spinner>
      )}
    </SLayout>
  )
}

export default App
