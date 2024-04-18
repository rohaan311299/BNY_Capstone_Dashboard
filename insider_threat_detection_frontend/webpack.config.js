const webpack = require('webpack');

module.exports = {
  // Other webpack config settings...
  resolve: {
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      fs: false,  // Set to false if you do not need it
      net: false, // Set to false if you do not need it
    }
  },
  plugins: [
    // This configures webpack to provide buffer/node functionality if required by any modules
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]
};
