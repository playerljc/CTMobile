const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'commons': ['./src/commons']
  },
  output: {
    path: path.join(__dirname, 'src', 'assets', 'dll'),
    filename: '[name].js',
    library: '[name]_[hash]'
  },
  mode: 'development',
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'src', 'assets', 'dll', '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};
