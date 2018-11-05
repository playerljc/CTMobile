const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {

  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process': {
        'env': {
          'NODE_ENV': JSON.stringify('production'),
          'REAP_PATH': JSON.stringify(process.env.REAP_PATH)
        }
      }
    }),
  ]
});