import React from 'react'
import { Flex } from 'rebass'

import { CircledCloseIcon } from 'components/Icon'
import { StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import HistoryRecord from 'components/HistoryRecord'

export default function HistoryModal() {
  const { historyModalOpen, transactions } = useSelector((state: RootState) => {
    const { historyModalOpen, transactions } = state.application
    return { historyModalOpen, transactions }
  })
  const {
    application: { setHistoryModalOpen },
  } = useDispatch()
  return (
    <UniModal
      isOpen={historyModalOpen}
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
          <Flex height={'100%'} width="100%" flexDirection={'column'} maxHeight={'61.8vh'} overflowX={'hidden'} overflowY={'auto'}>
            {[...transactions].map((transaction) => {
              return <HistoryRecord key={transaction.send_tx_hash} transaction={transaction} />
            })}
          </Flex>
        </UniModalContentWrapper>
      </Flex>
    </UniModal>
  )
}
