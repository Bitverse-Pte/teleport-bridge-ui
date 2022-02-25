import axios from 'axios'
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
