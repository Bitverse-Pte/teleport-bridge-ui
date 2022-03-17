const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    // your other plugins here
  ],
  {
    env: {
      BACKEND_URL: process.env.BACKEND_URL,
    },
    publicRuntimeConfig: {
      APP_ENV: process.env.APP_ENV || 'development',
    },
    api: {
      externalResolver: true,
    },
    async rewrites() {
      return {
        fallback: [
          {
            source: '/bridge/:path*',
            destination: process.env.BACKEND_URL + '/bridge/:path*',
          },
        ],
      }
    },
    images: {
      domains: ['static-files.teleport.network'],
    },
    /*   webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }

    return config
  }, */
    webpack5: true,
    webpack: (config, { isServer }) => {
      !isServer &&
        (config.resolve.fallback = {
          fs: false,
          path: false,
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('http-browserify'),
          https: require.resolve('https-browserify'),
          // os: require.resolve('os-browserify/browser'),
          os: false,
          util: false,
          buffer: false,
          module: false,
          assert: false,
          events: false,
        })
      /* !isServer &&
      config.plugins.push(
        new webpack.ProvidePlugin({
          window: 'global/window',
        }),
      )
    !isServer && (config.output.globalObject = 'window') */
      return config
    },
  }
)
