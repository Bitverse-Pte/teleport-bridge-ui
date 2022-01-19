// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/chains',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  )
  app.use(
    '/counterpartyChains',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  )
  app.use(
    '/bridges',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  )
}
