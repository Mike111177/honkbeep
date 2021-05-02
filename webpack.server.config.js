const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";
  // eslint-disable-next-line no-unused-vars
  const isDevelopment = !isProduction;

  return {
    target: "node",
    devtool: "source-map",
    mode,
    entry: "./src/server/index.ts",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "build", "server"),
      clean: true,
    },
    resolve: { extensions: [".js", ".ts"] },
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
      isProduction
        ? new TerserPlugin({
            parallel: true,
            terserOptions: {
              compress: { ecma: 2020 },
            },
          })
        : null,
      new NodemonPlugin(),
    ].filter((i) => i !== null),
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
};
