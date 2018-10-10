const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  entry: {
    app: ["./main.js"]
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "bundle.js"
  },
  externals: [nodeExternals()],
};
