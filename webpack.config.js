const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  devtool: false,
  output: {
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  resolve: { extensions: [".ts", ".tsx", ".js", ".css"] },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.jpe?g|\.svg/,
        use: ["file-loader"],
      },
      { test: /\.tsx?$/, use: "ts-loader" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
      //exclude: ["vendor.js"],
    }),
  ],
  optimization: {
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
