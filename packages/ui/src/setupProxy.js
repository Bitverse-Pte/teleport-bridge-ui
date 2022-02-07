// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')
const REACT_APP_CHAINS_DATA_URL = process.env.REACT_APP_CHAINS_DATA_URL
module.exports = function (app) {
  /*  app.use(
    '/chains',
    createProxyMiddleware({
      target: REACT_APP_CHAINS_DATA_URL,
      changeOrigin: true,
    })
  )
  app.use(
    '/counterpartyChains',
    createProxyMiddleware({
      target: REACT_APP_CHAINS_DATA_URL,
      changeOrigin: true,
    })
  )
  app.use(
    '/bridges',
    createProxyMiddleware({
      target: REACT_APP_CHAINS_DATA_URL,
      changeOrigin: true,
    })
  )
  app.use(
    '/bridge/packet/history',
    createProxyMiddleware({
      target: REACT_APP_CHAINS_DATA_URL,
      changeOrigin: true,
    })
  ) */
  app.use(
    '/bridge',
    createProxyMiddleware({
      target: REACT_APP_CHAINS_DATA_URL,
      changeOrigin: true,
    })
  )
}
