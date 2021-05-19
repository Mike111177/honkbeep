const webpack = require("webpack");
const NodemonPlugin = require("nodemon-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";
  // eslint-disable-next-line no-unused-vars
  const isDevelopment = !isProduction;
  const isDeployment = !!env.deploy;

  return {
    target: "node",
    devtool: "source-map",
    mode,
    entry: "./src/index.ts",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "build"),
      clean: true,
    },
    externalsPresets: { node: true },
    externals: [
      nodeExternals({ modulesFromFile: true, allowlist: [/^honkbeep-.*/] }),
    ],
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
      //new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
      //new webpack.ContextReplacementPlugin(/any-promise/),
      new NodemonPlugin({
        nodeArgs: ["-r", "honkbeep-testing/environment.js"],
      }),
    ].filter((i) => i !== null),
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              parallel: true,
              extractComments: isDeployment ? /a^/ : true,
              terserOptions: {
                compress: { ecma: 2020 },
              },
            }),
          ],
        }
      : { minimize: false },
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
