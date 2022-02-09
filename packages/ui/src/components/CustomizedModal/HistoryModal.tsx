import React, { useMemo } from 'react'
import { Flex } from 'rebass'
import { css } from 'styled-components/macro'

import { CircledCloseIcon } from 'components/Icon'
import { StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import HistoryRecord from 'components/HistoryRecord'

export default function HistoryModal() {
  const { historyModalOpen, transactionDetailModalOpen, transactions } = useSelector((state: RootState) => {
    const { historyModalOpen, transactionDetailModalOpen, transactions } = state.application
    return { historyModalOpen, transactionDetailModalOpen, transactions }
  })
  const {
    application: { setHistoryModalOpen },
  } = useDispatch()

  const isOpen = useMemo(() => {
    return historyModalOpen && !transactionDetailModalOpen
  }, [historyModalOpen, transactionDetailModalOpen])
  return (
    <UniModal
      isOpen={isOpen}
      maxWidth="61.8rem"
      maxHeight={61.8}
      onDismiss={() => {
        console.log('dismiss')
      }}
      closeByKeyboard={true}
      setIsOpen={setHistoryModalOpen}
    >
      <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>History</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setHistoryModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex>
        <UniModalContentWrapper>
          <Flex
            css={css`
              &::-webkit-scrollbar {
                width: 0.618rem;
                background-color: rgba(0, 0, 0, 0);
              }
              &::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 0.25rem;
              }
            `}
            width="100%"
            flexDirection={'column'}
            maxHeight={'61.8vh'}
            overflowX={'hidden'}
            overflowY={'auto'}
            justifyContent={'flex-start'}
            alignItems={'center'}
          >
            {[...transactions].map((transaction) => {
              return <HistoryRecord key={transaction.send_tx_hash} transaction={transaction} />
            })}
          </Flex>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
