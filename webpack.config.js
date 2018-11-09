const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_PATH = path.resolve(__dirname, 'src');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'ctmobile.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    libraryExport: "default",
    globalObject: 'this',
    // library: 'CtMobile'
  },
  mode: "production",
  // externals: {
  //   'jquery': {
  //     commonjs: 'jquery',
  //     commonjs2: 'jquery',
  //     amd: 'jquery',
  //     root: '$'
  //   }
  // },
  plugins: [
    new CopyWebpackPlugin([
      {from: './src/index.less', to: './index.less'},
    ]),
    new webpack.ProvidePlugin({ // 自动加载jq
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: [APP_PATH],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
};