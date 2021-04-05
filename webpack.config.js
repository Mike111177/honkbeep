const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: false,
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "static/js/[name].[contenthash:8].js",
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
    clean: true,
  },
  entry: "./src/index.tsx",
  resolve: { extensions: [".ts", ".tsx", ".js", ".css"] },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
      //exclude: ["vendor.js"],
    }),
  ],
  optimization: {
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
