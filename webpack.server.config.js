const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");

module.exports = {
  target: "node",
  devtool: "source-map",
  mode: "development",
  entry: "./src/server/index.ts",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build", "server"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/any-promise/),
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        compress: { ecma: 2020 },
      },
    }),
    new NodemonPlugin(),
  ],
  optimization: {
    splitChunks: {
      name(module, chunks, cacheGroupKey) {
        return cacheGroupKey;
      },
      chunks: "all",
    },
  },
  stats: {
    all: false,
    assets: true,
    chunks: true,
    chunkOrigins: true,
    performance: true,
    errors: true,
  },
};
