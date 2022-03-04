import React, { useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { css } from 'styled-components'

import { CircledCloseIcon, Icon } from 'components/Icon'
import { StyledText } from 'components/Text'
import Modal from 'components/Modal'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import HistoryRecord from 'components/HistoryRecord'
import Empty from 'public/empty.svg'

export default function HistoryModal() {
  const { historyModalOpen, transactions } = useSelector((state: RootState) => {
    const { historyModalOpen, transactions } = state.application
    return { historyModalOpen, transactions }
  })
  const {
    application: { setHistoryModalOpen },
  } = useDispatch()

  return (
    <Modal isOpen={historyModalOpen} maxWidth="61.8rem" maxHeight={'61.8vh'} closeByKeyboard={true} setIsOpen={setHistoryModalOpen} title="History">
      {/*  <Flex flexDirection="column" width="100%" overflow="hidden">
        <Flex height="40px" width="100%" justifyContent="flex-end">
          <StyledText style={{ lineHeight: '40px', textAlign: 'center', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <a>History</a>
          </StyledText>
          <CircledCloseIcon onClick={() => setHistoryModalOpen(false)} style={{ position: 'absolute' }} />
        </Flex> */}
      {/* <ModalContentWrapper flex={1}> */}
      <Flex width="100%" /* maxHeight="calc(61.8vh - 40px - 2rem)" */ flexDirection={'column'} overflowX={'hidden'} overflowY={'auto'} justifyContent={transactions.isEmpty() ? 'center' : 'flex-start'} alignItems={'center'}>
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
      {/* </ModalContentWrapper> */}
      {/* </Flex> */}
    </Modal>
  )
}
