const path = require("path");
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
    //This will have MiniCssExtractPlugin.loader or "style-loader" injected into it
    use: [
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

  const MediaRule = {
    test: /\.jpe?g|\.svg/,
    loader: "file-loader",
    options: {
      name: "static/media/[name].[hash:8].[ext]",
    },
  };

  const TypeScriptRule = {
    test: /\.tsx?$/,
    loader: "ts-loader",
    options: { happyPackMode: true, transpileOnly: true },
  };

  //Init Plugins
  const plugins = [new HtmlWebpackPlugin({ template: "./src/index.html" })];

  //Init minimizing settings
  let minimizing = {};

  //Things to add in development environment
  if (isDevelopment) {
    //Add typechecking
    const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
    plugins.push(new ForkTsCheckerWebpackPlugin());

    //Make sure css is loaded without minification
    CSSRule.use.unshift("style-loader");

    //Disable minimizer
    minimizing = { minimize: false };
  }

  //Things to add for production build
  if (isProduction) {
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
    const TerserPlugin = require("terser-webpack-plugin");

    //Minify css
    CSSRule.use.unshift(MiniCssExtractPlugin.loader);
    plugins.unshift(
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      })
    );

    //Enable minimizers
    minimizing = {
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
    };
  }

  return {
    mode,
    devtool: isProduction ? "source-map" : "eval-cheap-source-map",
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
      rules: [CSSRule, MediaRule, TypeScriptRule],
    },
    plugins,
    optimization: {
      ...minimizing,
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: {
        name: (entrypoint) => `${entrypoint.name}.runtime`,
      },
    },
    performance: isProduction ? {} : false,
    stats: isProduction ? "normal" : "minimal",
    devServer: {
      historyApiFallback: true,
      hot: true,
    },
  };
};
