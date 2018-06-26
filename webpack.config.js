const { join } = require('path')
const AddModuleExportsPlugin = require('add-module-exports-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  node: false,
  devtool: 'source-map',
  output: {
    path: join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]
  },
  plugins: [
    new AddModuleExportsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  }
}
