import React, { useCallback } from 'react'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import { useSelector } from 'react-redux'
import { UnsupportedChainIdError } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import MetamaskIcon from 'public/images/metamask.png'
import { CircledCloseIcon } from 'components/Icon'
import { StyledText, PrimaryText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import Option, { OPTION_TYPE } from 'components/Option'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { injected, portis } from 'connectors'
import { isMobile } from 'helpers/userAgent'
import styled from 'styled-components'
import { useDispatch } from 'hooks'
import { RootState } from 'store'
import { useActiveWeb3React } from 'hooks/web3'
import { errorNoti } from 'helpers/notifaction'

const OptionGrid = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 100%;
    grid-gap: 10px;
  `};
`

export default function WalletSelectModal() {
  const {
    application: { loggedIn, setWalletModalOpen, setWaitWallet },
  } = useDispatch()
  const { connectStatus, walletModalOpen, availableChains } = useSelector((state: RootState) => {
    const { connectStatus, walletModalOpen, availableChains } = state.application
    return { connectStatus, walletModalOpen, availableChains }
  })
  const { active, account, connector, activate, chainId, error, deactivate } = useActiveWeb3React()

  const tryActivation = useCallback(
    async (connector: AbstractConnector | undefined) => {
      let name = ''
      Object.keys(SUPPORTED_WALLETS).map((key) => {
        if (connector === SUPPORTED_WALLETS[key].connector) {
          return (name = SUPPORTED_WALLETS[key].name)
        }
        return true
      })
      // log selected wallet
      /* ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    }) */
      /*   setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)
 */
      // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      if (connector instanceof WalletConnectConnector) {
        connector.walletConnectProvider = undefined
      }
      setWaitWallet(true)
      connector &&
        activate(connector, undefined, true)
          .then(() => {
            return Promise.resolve()
              .then(() => {
                loggedIn()
              })
              .then(() => setWalletModalOpen(false))
            // logMonitoringEvent({ walletAddress })
          })
          .catch((error: any) => {
            if (error.code === -32002) {
              errorNoti(`Unabled to connect to your selection, as you have a same connection request awaiting your action in your wallet, please take action`)
              return
            }
            errorNoti(
              `Unabled to connect to your selection, please use another wallet or connected to a available chains:${Array.from(availableChains.values())
                .map((e) => e.name)
                .join(', ')}`
            )
            /* if (error instanceof UnsupportedChainIdError) {
              activate(connector) // a little janky...can't use setError because the connector isn't set
            } */
          })
          .finally(() => setWaitWallet(false))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    },
    [connector]
  )

  const getOptions = useCallback(() => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                tryActivation(option.connector) /* && tryActivation(option.connector)*/
                /*  ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href */
                // option.connector !== connector && !option.href && tryActivation(option.connector)
                /* option.connector !== connector */
              }}
              id={`connect-${key}`}
              key={key}
              active={connectStatus && active && option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={option.iconURL}
              type={OPTION_TYPE.WALLET}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return <Option id={`connect-${key}`} type={OPTION_TYPE.WALLET} key={key} color={'#E8831D'} header={<Text>Install Metamask</Text>} subheader={null} link={'https://metamask.io/'} icon={MetamaskIcon} />
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              /*  option.connector !== connector  */ /*  ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href */ /*  &&  */ tryActivation(option.connector)
            }}
            key={key}
            active={connectStatus && active && option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={option.iconURL}
            type={OPTION_TYPE.WALLET}
          />
        )
      )
    })
  }, [connector, connectStatus, tryActivation])
  return (
    <UniModal
      isOpen={walletModalOpen}
      maxHeight={61.8}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setWalletModalOpen}
      title="Select A Wallet"
    >
      {/* <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <PrimaryText>Select a Wallet</PrimaryText>
          </StyledText>
          <CircledCloseIcon onClick={() => setWalletModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex> */}
      <UniModalContentWrapper>
        <OptionGrid>{getOptions()}</OptionGrid>
      </UniModalContentWrapper>
      {/*  </Flex> */}
    </UniModal>
  )
}
