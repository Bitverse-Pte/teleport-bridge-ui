import axios from 'axios'
import { HISTORY_TRANSACTION_QUEUE_LENGTH } from 'constants/index'
import { TransactionDetail } from 'constants/types'
import { TRANSACTION_HISTORY_URL } from 'constants/urls'
import { isServer } from 'helpers'
import http from 'http'
import https from 'https'
import { IAppState } from 'store/models/application'

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

const requestor = axios.create({
  httpAgent, // httpAgent: httpAgent -> for non es6 syntax
  httpsAgent,
  timeout: 10 * 1000,
})

requestor.interceptors.request.use(
  async (config) => {
    if (isServer) {
      config.baseURL = process.env.BACKEND_URL
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default requestor

// const demo = {
//   src_chain: 'teleport',
//   dest_chain: 'rinkeby',
//   src_chain_id: '7001',
//   dest_chain_id: '4',
//   sender: '0xbb0b5f8b7ca372785cfd2e0b87d8c14c5e238106',
//   send_tx_hash: '0x8d4e5e87c60a110c4462ae9b710b74a785e3144ef0cc3bf9e39f98b52ca6a975',
//   receiver: '0xbb0b5f8b7ca372785cfd2e0b87d8c14c5e238106',
//   receive_tx_hash: '0x846452b36c31a1045cc65f002eb338a333b24a29f678499ef86f60012c47232f',
//   amount: '10000000000000000000',
//   token: '',
//   ack_token: '0x0000000000000000000000000000000000000000',
//   token_address: '0x0000000000000000000000000000000000000000',
//   err_message: '',
//   sequence: 29,
//   status: 2,
//   tx_time: '2022-03-14 06:43:16',
// }
export const getHistroyTxes = async function (account: string, pagination?: IAppState['transactionsPagination']) {
  const {
    data: { data },
  } = await requestor.post<{ data: { history: TransactionDetail[]; pagination: IAppState['transactionsPagination'] } }>(TRANSACTION_HISTORY_URL, { sender: account, pagination: { current_page: 1, page_size: HISTORY_TRANSACTION_QUEUE_LENGTH, ...(pagination || {}) } })
  return data
  // var dd = new Array(100).fill(undefined)
  // return {
  //   history: dd.map((e, index) => {
  //     return { ...demo, send_tx_hash: demo.send_tx_hash + index, index } as unknown as TransactionDetail
  //   }),
  //   pagination: {
  //     current_page: 1,
  //     last_page: 1,
  //     page_size: 50,
  //     total: 100,
  //   },
  // }
}
