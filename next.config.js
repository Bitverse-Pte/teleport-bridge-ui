module.exports = {
  async rewrites() {
    return [
      {
        source: '/bridge',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL,
      },
    ]
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
