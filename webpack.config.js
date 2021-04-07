const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const buildDir = path.resolve(__dirname, "build");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";

  //Init rules
  const CSSRule = {
    test: /\.css$/,
    use: [
      isProduction ? MiniCssExtractPlugin.loader : "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: isProduction
              ? "[hash:base64:10]"
              : "[local]-[hash:base64:5]",
          },
        },
      },
    ],
  };

  //Init Plugins
  const plugins = [new HtmlWebpackPlugin({ template: "./src/index.html" })];

  //Things to add for production build
  if (isProduction) {
    //Minify css
    plugins.unshift(
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      })
    );
  }

  return {
    mode,
    devtool: isProduction ? "source-map" : "eval-source-map",
    output: {
      path: isProduction ? buildDir : undefined,
      filename: "static/js/[name].[contenthash:8].js",
      chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
      publicPath: "/",
      clean: true,
    },
    entry: "./src/index.tsx",
    resolve: { extensions: [".ts", ".tsx", ".js", ".css"] },
    module: {
      rules: [
        CSSRule,
        {
          test: /\.jpe?g|\.svg/,
          loader: "file-loader",
          options: {
            name: "static/media/[name].[hash:8].[ext]",
          },
        },
        { test: /\.tsx?$/, use: "ts-loader" },
      ],
    },
    plugins,
    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: { ecma: 2018 },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `${entrypoint.name}.runtime`,
      },
    },
    performance: { hints: false },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      hot: true,
    },
  };
};
