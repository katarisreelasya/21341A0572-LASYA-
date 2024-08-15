const webpack = require('webpack');

module.exports = {
  // other configuration options...
  resolve: {
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": false,  // fs is not available in the browser
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "net": false,  // net is not available in the browser
      "url": require.resolve("url/")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
