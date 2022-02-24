import React, { useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { css } from 'styled-components'

import { CircledCloseIcon, Icon } from 'components/Icon'
import { StyledText } from 'components/Text'
import UniModal, { UniModalContentWrapper } from 'components/UniModal'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import HistoryRecord from 'components/HistoryRecord'
import Empty from 'public/empty.svg'

export default function HistoryModal() {
  const { historyModalOpen, transactionDetailModalOpen, transactions } = useSelector((state: RootState) => {
    const { historyModalOpen, transactionDetailModalOpen, transactions } = state.application
    return { historyModalOpen, transactionDetailModalOpen, transactions }
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
      title="History"
    >
      {/*  <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>History</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setHistoryModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex> */}
      <UniModalContentWrapper flex={1}>
        <Flex width="100%" height="100%" flexDirection={'column'} maxHeight={'61.8vh'} overflowX={'hidden'} overflowY={'auto'} justifyContent={transactions.isEmpty() ? 'center' : 'flex-start'} alignItems={'center'}>
          {transactions.isEmpty() && (
            <>
              <Icon src={Empty} size={100} />
              <Text
                css={css`
                  font-style: normal;
                  font-size: 1.25rem;
                  line-height: 1.625rem;
                  text-transform: capitalize;
                  color: gray;
                  font-weight: 700;
                `}
              >
                No Data
              </Text>
            </>
          )}
          {!transactions.isEmpty() &&
            [...transactions].reverse().map((transaction) => {
              return <HistoryRecord key={transaction.send_tx_hash} transaction={transaction} />
            })}
        </Flex>
      </UniModalContentWrapper>
      {/* </Flex> */}
    </UniModal>
  )
}
