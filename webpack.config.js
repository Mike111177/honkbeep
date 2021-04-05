const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const buildDir = path.resolve(__dirname, "build");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";
  const isDevelopment = !isProduction;

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
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            output: {
              ecma: 8,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
    },
  };
};
