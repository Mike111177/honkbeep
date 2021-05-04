const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const SVGOConfig = require("./svgo.config");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";
  const isDevelopment = !isProduction;
  const useSourceMap = env.noMap ? false : true;
  const Patterns = isProduction
    ? {
        JSModule: "static/[contenthash].js",
        JSChunk: "static/[contenthash].js",
        Image: "static/[contenthash].[ext]",
        CSSModule: "static/[contenthash].css",
        CSSChunk: "static/[contenthash].css",
        CSSClass: "[hash:base64:10]",
      }
    : {
        JSModule: "static/js/[name].[contenthash:8].js",
        JSChunk: "static/js/[name].[contenthash:8].chunk.js",
        Image: "static/media/[name].[contenthash:8].[ext]",
        CSSModule: "static/css/[name].[contenthash:8].css",
        CSSChunk: "static/css/[name].[contenthash:8].chunk.css",
        CSSClass: "[local]-[hash:base64:5]",
      };

  //Init Plugins
  const plugins = [
    isProduction
      ? new MiniCssExtractPlugin({
          filename: Patterns.CSSModule,
          chunkFilename: Patterns.CSSChunk,
        })
      : null,
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    isDevelopment ? new ForkTsCheckerWebpackPlugin() : null,
    isProduction
      ? new BundleAnalyzerPlugin({
          analyzerMode: "disabled",
          generateStatsFile: true,
        })
      : null,
  ].filter((i) => i);
  return {
    mode,
    devtool: useSourceMap ? "source-map" : false,
    output: {
      filename: Patterns.JSModule,
      chunkFilename: Patterns.JSChunk,
      path: path.resolve(__dirname, "build", "client"),
      publicPath: "/",
      clean: true,
    },
    entry: "./src/index.tsx",
    resolve: { extensions: [".ts", ".tsx", ".js", ".css"] },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: Patterns.CSSClass,
                },
              },
            },
          ],
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: Patterns.Image,
              },
            },
            isProduction
              ? {
                  loader: "image-webpack-loader",
                  options: {
                    svgo: SVGOConfig,
                  },
                }
              : null,
          ].filter((i) => i),
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                svgo: SVGOConfig,
              },
            },
            {
              loader: "file-loader",
              options: {
                name: Patterns.Image,
              },
            },
            isProduction
              ? {
                  loader: "image-webpack-loader",
                  options: {
                    svgo: SVGOConfig,
                  },
                }
              : null,
          ].filter((i) => i),
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: { transpileOnly: isDevelopment },
        },
      ],
    },
    plugins,
    optimization: {
      ...(isDevelopment
        ? { minimize: false }
        : {
            minimize: true,
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
            },
            runtimeChunk: true,
          }),
    },
    performance: isProduction ? {} : false,
    stats: isProduction
      ? {
          all: false,
          assets: true,
          chunks: true,
          chunkOrigins: true,
          performance: true,
          errors: true,
        }
      : "minimal",
    devServer: {
      historyApiFallback: true,
      hot: true,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          logLevel: "silent",
          ws: true,
        },
      },
    },
  };
};
