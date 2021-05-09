const webpack = require("webpack");
const newRequire = require("./scripts/newRequire");
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
          options: {
            //For dev type checking is done separately for speed
            transpileOnly: isDevelopment,
          },
        },
      ],
    },
    plugins: [
      new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
      new webpack.ContextReplacementPlugin(/any-promise/),
      isDevelopment ? newRequire("fork-ts-checker-webpack-plugin") : null,
      newRequire("nodemon-webpack-plugin"),
    ].filter((i) => i !== null),
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            newRequire("terser-webpack-plugin", {
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
