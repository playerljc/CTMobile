const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    publicPath: '/',
    host: 'localhost',
    compress: true,
    port: 8000,
    clientLogLevel: 'none', //不再输出繁琐的信息
    historyApiFallback: true,
    overlay: true, //浏览器全屏显示错误信息
  },
  plugins:[
    new webpack.DefinePlugin({
      'process': {
        'env': {
          'NODE_ENV': JSON.stringify('development'),
          'REAP_PATH': JSON.stringify(process.env.REAP_PATH)
        }
      }
    }),
  ]
});