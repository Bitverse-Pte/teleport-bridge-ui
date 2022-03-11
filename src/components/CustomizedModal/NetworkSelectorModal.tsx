import React, { useCallback } from 'react'
import { Box, Flex } from 'rebass'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Option, { OPTION_TYPE } from 'components/Option'
import Modal from 'components/Modal'
import { RootState } from 'store/store'
import { useDispatch } from 'hooks'
import { NetworkSelectModalMode } from 'constants/index'

const OptionGrid = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  button {
    width: calc(50% - 0.5rem);
    margin-bottom: 0.5rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    justify-content: flex-start;
    height: unset;
    button {
      width: calc(100%);
    }
    button:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  `};
`

export default function NetworkSelectModal() {
  const { active, account, chainId, library } = useSelector((state: RootState) => {
    const { active, account, chainId, library } = state.evmCompatibles
    return { active, account, chainId, library }
  })
  const { waitWallet, networkModalMode, availableChains, srcChainId, destChainId, connectStatus } = useSelector((state: RootState) => {
    const { waitWallet, networkModalMode, availableChains, srcChainId, destChainId, connectStatus } = state.application
    return { waitWallet, networkModalMode, availableChains, srcChainId, destChainId, connectStatus }
  })
  const {
    application: { setWaitWallet, setNetworkModalMode, saveDestChainId, setSrcChainId, changeNetwork },
  } = useDispatch()
  // const fromChainList = useFromChainList()

  const getNetworkOptions = useCallback(() => {
    switch (networkModalMode) {
      case NetworkSelectModalMode.SRC:
        return [...availableChains.values()].map((chain) => {
          return (
            <Option
              id={`connect-${chain.name}`}
              onClick={() => {
                if (connectStatus && account && chainId == chain.chainId) {
                  return
                }
                changeNetwork({ chainId: chain.chainId })
                /* srcChainId !== chain.chainId && */
              }}
              key={chain.chainId}
              active={!!(connectStatus && account && chainId == chain.chainId)}
              color={'blue'}
              header={chain.name}
              subheader={null} //use option.descriptio to bring back multi-line
              icon={chain.icon}
              type={OPTION_TYPE.NETWORK}
            />
          )
        })
      case NetworkSelectModalMode.DEST:
        return availableChains.get(srcChainId)!.destChains.map((chain) => {
          return (
            <Option
              id={`connect-${chain.name}`}
              onClick={() => {
                destChainId !== chain.chainId && saveDestChainId(chain.chainId)
              }}
              key={chain.chainId}
              active={destChainId == chain.chainId}
              color={'blue'}
              header={chain.name}
              subheader={null} //use option.descriptio to bring back multi-line
              icon={chain.icon}
              type={OPTION_TYPE.NETWORK}
            />
          )
        })
      default:
        break
    }
  }, [library, chainId, availableChains, networkModalMode, srcChainId, destChainId])

  return (
    <Modal
      maxWidth="40rem"
      maxHeight={'61.8vh'}
      isOpen={!!networkModalMode}
      /* onDismiss={() => {
        console.log('dismiss')
      }} */
      closeByKeyboard={true}
      setIsOpen={setNetworkModalMode}
      title="Select A Chain"
    >
      {/* <Flex flexDirection="column" width="100%" overflow="hidden" justifyContent={'flex-start'}> */}
      {/* <ModalContentWrapper> */}
      <OptionGrid>{getNetworkOptions()}</OptionGrid>
      {/* </ModalContentWrapper> */}
      {/* </Flex> */}
    </Modal>
  )
}
