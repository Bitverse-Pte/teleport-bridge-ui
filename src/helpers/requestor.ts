import axios from 'axios'
import { HISTORY_TRANSACTION_QUEUE_LENGTH } from 'constants/index'
import { TransactionDetail } from 'constants/types'
import { TRANSACTION_HISTORY_URL } from 'constants/urls'
import http from 'http'
import https from 'https'

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

const requestor = axios.create({
  httpAgent, // httpAgent: httpAgent -> for non es6 syntax
  httpsAgent,
  timeout: 10 * 1000,
})

const isServer = typeof window === 'undefined'
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

export const getLatest50HistroyTx = async function (account: string) {
  const {
    data: {
      data: { history },
    },
  } = await requestor.post<{ data: { history: TransactionDetail[] } }>(TRANSACTION_HISTORY_URL, { sender: account, pagination: { current_page: 1, page_size: HISTORY_TRANSACTION_QUEUE_LENGTH, last_page: 1 } })
  return history
}
