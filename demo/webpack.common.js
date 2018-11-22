const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const extractLess = new ExtractTextPlugin({
  filename: (getPath) => {
    return getPath('[name].css');
  },
  allChunks: true,
  disable: true,
});

const APP_PATH = path.resolve(__dirname, 'src'); // 项目src目录

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./src/assets/dll/commons-manifest.json')
    }),
    new HtmlWebpackPlugin({
      title: 'CtMobile Demo',
      filename: 'index.html',
      template: 'src/index.html',
      hash: true,//防止缓存
      minify: {
        removeAttributeQuotes: true//压缩 去掉引号
      }
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['static/dll/commons.js'],
      append: false,
      hash: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
    extractLess,
    new CopyWebpackPlugin([
      {from: './src/assets', to: './static', toType: 'dir'},
    ]),
    // 提供全局变量_
    new webpack.ProvidePlugin({
      _: "lodash",
      $: "jquery",
    }),
  ],
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        // include: [APP_PATH],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', 'syntax-dynamic-import']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        include: [APP_PATH],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.less$/,
        exclude: /(node_modules|bower_components)/,
        include: [APP_PATH],
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader",
            options: {
              plugins: [
                new LessPluginCleanCSS({advanced: true}),
                new LessPluginAutoPrefix({add: false, remove: false, browsers: ['last 2 versions']})
              ]
            }
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      {
        test: /\.ejs/,
        loader: 'ejs-loader?variable=data'
      }
    ]
  },
  resolve: {
    alias: {
      ctmobile: path.resolve(__dirname,'src/ctmobile/'),
    }
  }
};