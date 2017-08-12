module.exports = {
  entry: "./src/index.tsx",
  output: {
    libraryTarget: "umd",
    publicPath: './build/',
    filename: "bundle.js",
    path: __dirname + "/build"
  },

  devtool: "source-map",

  target: 'electron',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  externals: {
    '@brightsign/videomodeconfiguration': 'commonjs @brightsign/videomodeconfiguration',
    '@brightsign/networkconfiguration': 'commonjs @brightsign/networkconfiguration',
    '@brightsign/systemtime': 'commonjs @brightsign/systemtime',
    '@brightsign/networkhost': 'commonjs @brightsign/networkhost',
    '@brightsign/utils': 'commonjs @brightsign/utils',
    '@brightsign/dws': 'commonjs @brightsign/dws',
    '@brightsign/networkdiagnostics': 'commonjs @brightsign/networkdiagnostics',
    '@brightsign/touchscreen': 'commonjs @brightsign/touchscreen',
    '@brightsign/videoinputconfiguration': 'commonjs @brightsign/videoinputconfiguration',
    '@brightsign/registry': 'commonjs @brightsign/registry',
    '@brightsign/videooutput': 'commonjs @brightsign/videooutput',
    BSDeviceInfo : 'BSDeviceInfo',
    'core-js/fn/object/assign' : 'commonjs core-js/fn/object/assign',
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  },
};
