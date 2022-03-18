import React, { useEffect, useMemo, useState } from 'react'
import { Flex, Text } from 'rebass'
import styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'
import Pagination from '@mui/material/Pagination'

import { Icon } from 'components/Icon'
import Modal from 'components/Modal'
import { RootState } from 'store'
import { useDispatch } from 'hooks'
import HistoryRecord from 'components/HistoryRecord'
import Empty from 'public/empty.svg'
import { HISTORY_TRANSACTION_QUEUE_LENGTH, HISTORY_MODAL_PAGE_SIZE, WALLET_TYPE, TransactionDetail, TRANSACTION_HISTORY_URL } from 'constants/index'
import { getHistroyTxes } from 'helpers/requestor'
import { TransitionSpinnerMask } from 'components/Spinner'
import { warnNoti } from 'helpers/notifaction'

const ColoredPagination = styled(Pagination)`
  transform: translateY(0.5rem);
  button {
    color: white;
  }
`

export default function HistoryModal() {
  const { historyModalOpen, transactions, walletType, transactionsPagination } = useSelector((state: RootState) => {
    const { historyModalOpen, transactions, walletType, transactionsPagination } = state.application
    return { historyModalOpen, transactions, walletType, transactionsPagination }
  })

  const { account } = useSelector((state: RootState) => {
    const { account } = state.evmCompatibles
    return { account }
  })

  const { walletAddress } = useSelector((state: RootState) => {
    const { walletAddress } = state.cosmosCompatibles
    return { walletAddress }
  })

  const accountAddress = useMemo(() => {
    switch (walletType) {
      case WALLET_TYPE.EVM:
        return account!
      case WALLET_TYPE.COSMOS:
        return walletAddress
      default:
        throw new Error('not valid wallet type')
    }
  }, [account, walletType, walletAddress])

  const {
    application: { setHistoryModalOpen, setTransactionsPagination },
  } = useDispatch()
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = useState(false)
  const [displayData, setDisplayData] = useState<TransactionDetail[]>([])
  useEffect(() => {
    ;(async () => {
      if (!accountAddress) {
        return []
      }
      if (page <= Math.ceil(HISTORY_TRANSACTION_QUEUE_LENGTH / HISTORY_MODAL_PAGE_SIZE)) {
        const dataPart1 = transactions.filter((e, index) => {
          if (index >= (page - 1) * HISTORY_MODAL_PAGE_SIZE && index < page * HISTORY_MODAL_PAGE_SIZE) {
            return true
          }
          return false
        })
        setDisplayData(dataPart1)
      } else {
        setLoading(true)
        try {
          const { history: data, pagination } = await getHistroyTxes(accountAddress, { current_page: page, page_size: HISTORY_MODAL_PAGE_SIZE })
          setTransactionsPagination(pagination)
          setDisplayData(
            data
              .reverse()
              .filter((e) => e.sender && e.send_tx_hash && e.amount && e.token_address && e.status)
              .slice(0, 10)
          )
        } catch (err) {
          console.error(err)
          warnNoti(`failed to load historic transactions info from ${TRANSACTION_HISTORY_URL},
          the detail is ${(err as any)?.message}`)
        } finally {
          setTimeout(() => {
            setLoading(false)
          }, 1000)
        }
      }
    })()
  }, [page, transactions, accountAddress])

  const handleChange = (event: any, value: React.SetStateAction<number>) => {
    setPage(value)
  }
  return (
    <Modal isOpen={historyModalOpen} maxWidth="61.8rem" maxHeight={'61.8vh'} closeByKeyboard={true} setIsOpen={setHistoryModalOpen} title="History">
      <Flex width="100%" flexDirection={'column'} overflowX={'hidden'} overflowY={'hidden'} justifyContent={'flex-start'} alignItems={'center'}>
        <Flex flex={1} width="100%" style={{ position: 'relative' }} flexDirection={'column'} overflowX={'hidden'} overflowY={loading ? 'hidden' : 'auto'} justifyContent={transactions.isEmpty() ? 'center' : 'flex-start'} alignItems={'center'}>
          <TransitionSpinnerMask show={loading} />
          {!displayData.length && (
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
          {displayData.length &&
            displayData.reverse().map((transaction) => {
              return <HistoryRecord key={transaction.send_tx_hash} transaction={transaction} />
            })}
        </Flex>
        {displayData.length && (
          <Flex minHeight={'3rem'} alignItems="center">
            <ColoredPagination color="primary" count={Math.ceil((transactionsPagination.total || 0) / HISTORY_MODAL_PAGE_SIZE)} page={page} onChange={handleChange} />
          </Flex>
        )}
      </Flex>
    </Modal>
  )
}
