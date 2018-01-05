var webpack = require('webpack');
var CopyWebpackPlugin =  require('copy-webpack-plugin');
var environment = require('./environment');

module.exports = {
  entry: "./src/index.tsx",
  output: {
    libraryTarget: "umd",
    publicPath: './build/',
    filename: "bundle.js",
    path: __dirname + "/build"
  },
  devtool: 'source-map',
  target: 'node',
  
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  externals: {
    'core-js/fn/object/assign' : 'commonjs core-js/fn/object/assign',
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  },
  plugins: [
    new webpack.DefinePlugin(environment.globals),
    new CopyWebpackPlugin([{
      context: 'node_modules/@brightsign/bs-device-artifacts/static',
      from: '**/*',
      to: './static'
    }])
  ]
};