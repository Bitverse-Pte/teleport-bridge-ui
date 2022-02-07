import React, { useCallback, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { pick } from 'lodash'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'

import { CircledCloseIcon, Icon } from 'components/Icon'
import { StyledText, Text1, Text2, Text4 } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import Option from 'components/Option'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { injected, portis } from 'connectors'
import { isMobile } from 'helpers/userAgent'
import styled from 'styled-components'
import { useDispatch } from 'hooks'
import { RootState } from 'store'
import { useActiveWeb3React } from 'hooks/web3'
import CurrencyList from '../Currency/CurrencyList'
import { getChainData } from 'helpers/chains'
import { EstimationBlock } from 'components/EstimationBlock'
import { TransferConfirmationButton } from 'components/Button/TransferConfirmationButton'

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const Wrapper = styled(Flex)`
  color: white;
  padding: 2.5rem 1.6rem;
  width: 80%;
  height: 10rem;
  background: rgba(0, 0, 0, 0.3);
  border: solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  backdrop-filter: blur(0.125rem);
  border-radius: 0.5rem;
  justify-content: center;
  flex-direction: column;
`

export default function TransactionDetailModal() {
  const {
    application: { setTransactionDetailModalOpen },
  } = useDispatch()
  const { transactionDetailModalOpen, selectedTransactionId, transactions } = useSelector((state: RootState) => {
    const { transactionDetailModalOpen, selectedTransactionId, transactions } = state.application
    return { transactionDetailModalOpen, selectedTransactionId, transactions }
  })

  const srcTx = useMemo(() => {
    return transactions.find((t) => {
      return t.send_tx_hash === selectedTransactionId
    })
  }, [selectedTransactionId, transactions])

  const destTx = useMemo(() => {
    return transactions.find((t) => {
      return t.receive_tx_hash === selectedTransactionId
    })
  }, [selectedTransactionId, transactions])

  /*  const destChain = useMemo(() => {
    return availableChains.get(destChainId)
  }, [destChainId, availableChains])

  const selectedTokenPairs = useMemo(() => {
    return bridgePairs.get(`${srcChainId}-${destChainId}`)?.tokens.find((e) => e.name === selectedTokenName)
  }, [bridgePairs, selectedTokenName, srcChainId, destChainId])

  const amount = useMemo(() => {
    const input = document.getElementById('fromValueInput')
    if (input) {
      return (input as HTMLInputElement).value
    } else {
      return '0'
    }
  }, [transferConfirmationModalOpen]) */

  return (
    <UniModal
      isOpen={transactionDetailModalOpen}
      maxHeight={61.8}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setTransactionDetailModalOpen}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden" height={'fit-content'}>
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>Transfer</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setTransactionDetailModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex>
        <UniModalContentWrapper justifyContent="space-evenly" flexDirection="column">
          <Wrapper>
            <Flex>
              <Text2>You Send</Text2>
            </Flex>
            <Flex>
              <Icon></Icon>
              <Text1 fontSize={32} fontWeight={900}>
                Ethereum Mainnet
              </Text1>
              <Text1 color="red">amount</Text1>
            </Flex>
            <Flex>
              <Text2>Tx Hash</Text2>
              <Flex>
                <Text1>hash</Text1>
                <Icon />
              </Flex>
            </Flex>
            <Flex>
              <Text2>Tx Hash</Text2>
              <Flex>
                <Text1>hash</Text1>
                <Icon />
              </Flex>
            </Flex>
          </Wrapper>
          <Wrapper>
            <Flex>
              <Text2>You Send</Text2>
            </Flex>
            <Flex>
              <Icon></Icon>
              <Text1 fontSize={32} fontWeight={900}>
                Ethereum Mainnet
              </Text1>
              <Text1 color="red">amount</Text1>
            </Flex>
            <Flex>
              <Text2>Tx Hash</Text2>
              <Flex>
                <Text1>hash</Text1>
                <Icon />
              </Flex>
            </Flex>
            <Flex>
              <Text2>Tx Hash</Text2>
              <Flex>
                <Text1>hash</Text1>
                <Icon />
              </Flex>
            </Flex>
          </Wrapper>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
