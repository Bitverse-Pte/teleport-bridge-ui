import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'rebass'
import { useSelector } from 'react-redux'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import MetamaskIcon from 'public/images/metamask.png'
import Modal from 'components/Modal'
import Option, { OPTION_TYPE } from 'components/Option'
import { SUPPORTED_WALLETS, WalletInfo } from 'constants/wallet'
import { injected /* ,portis */ } from 'connectors'
import { isMobile } from 'helpers/userAgent'
import { useDispatch } from 'hooks'
import { RootState } from 'store/store'
import { errorNoti } from 'helpers/notifaction'
import { WALLET_TYPE } from 'constants/index'

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
    application: { loggedIn, setWalletModalOpen, setWaitWallet, setWalletType },
  } = useDispatch()
  const { connectStatus, walletModalOpen, availableChains } = useSelector((state: RootState) => {
    const { connectStatus, walletModalOpen, availableChains } = state.application
    return { connectStatus, walletModalOpen, availableChains }
  })
  const { active, connector, activate } = useSelector((state: RootState) => {
    const { active, connector, activate } = state.evmCompatibles
    return { active, connector, activate }
  })

  const tryActivation = useCallback(
    async ({ walletType, connector }: WalletInfo) => {
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
                // setWalletType(walletType)
                loggedIn(walletType)
              })
              .then(() => setWalletModalOpen(false))
            // logMonitoringEvent({ walletAddress })
          })
          .catch((error: any) => {
            // setWalletType(WALLET_TYPE.UNSET)
            if (error.code === -32002) {
              errorNoti(`Unable to connect to your selection, as you have a same connection request awaiting your action in your wallet, please take action`)
              return
            }
            errorNoti(
              `Unable to connect to your selection, please use another wallet or connected to a available chains:${Array.from(availableChains.values())
                .map((e) => e.name)
                .join(', ')}`
            )
            /* if (error instanceof UnsupportedChainIdError) {
              activate(connector) // a little janky...can't use setError because the connector isn't set
            } */
          })
          .finally(() => setWaitWallet(false))
    },
    [connector, activate]
  )

  const getOptions = useCallback(() => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Array.from(SUPPORTED_WALLETS.values()).map((option) => {
      if (!option) {
        return
      }
      // check for mobile options
      // if (isMobile) {
      //   //disable portis on mobile for now
      //   // if (option.connector === portis) {
      //   //   return null
      //   // }

      //   if (!window.web3 && !window.ethereum && option.mobile) {
      //     return (
      //       <Option
      //         onClick={() => {
      //           tryActivation(option.connector) /* && tryActivation(option.connector)*/
      //           /*  ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href */
      //           // option.connector !== connector && !option.href && tryActivation(option.connector)
      //           /* option.connector !== connector */
      //         }}
      //         id={`connect-${key}`}
      //         key={key}
      //         active={connectStatus && active && option.connector && option.connector === connector}
      //         color={option.color}
      //         link={option.href}
      //         header={option.name}
      //         subheader={null}
      //         icon={option.iconURL}
      //         type={OPTION_TYPE.WALLET}
      //       />
      //     )
      //   }
      //   return null
      // }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return <Option id={`connect-${option.name}`} type={OPTION_TYPE.WALLET} key={option.name} color={'#E8831D'} header={<Text>Install Metamask</Text>} subheader={null} link={'https://metamask.io/'} icon={MetamaskIcon} />
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
        // !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${option.name}`}
            onClick={() => {
              /*  option.connector !== connector  */ /*  ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href */ /*  &&  */ tryActivation(option)
            }}
            key={option.name}
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
    <Modal isOpen={walletModalOpen} maxHeight={'61.8vh'} maxWidth={'40rem'} closeByKeyboard={true} setIsOpen={setWalletModalOpen} title="Select A Wallet">
      {/* <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <PrimaryText>Select a Wallet</PrimaryText>
          </StyledText>
          <CircledCloseIcon onClick={() => setWalletModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex> */}
      {/* <ModalContentWrapper> */}
      <OptionGrid>{getOptions()}</OptionGrid>
      {/* </ModalContentWrapper> */}
      {/*  </Flex> */}
    </Modal>
  )
}
