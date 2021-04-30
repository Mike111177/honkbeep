const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SVGOConfig = require("./svgo.config");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";
  const isDevelopment = !isProduction;

  const namePatterns = isProduction
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

  //Init rules
  const CSSRule = {
    test: /\.css$/,
    //This will have MiniCssExtractPlugin.loader or "style-loader" injected into it
    use: [
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: namePatterns.CSSClass,
          },
        },
      },
    ],
  };

  const ImageRule = {
    test: /\.(gif|png|jpe?g)$/i,
    use: [
      {
        loader: "file-loader",
        options: {
          name: namePatterns.Image,
        },
      },
    ],
  };

  const SVGRule = {
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
          name: namePatterns.Image,
        },
      },
    ],
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
        filename: namePatterns.CSSModule,
        chunkFilename: namePatterns.CSSChunk,
      })
    );

    //Analyze bundles
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
      .BundleAnalyzerPlugin;
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled",
        generateStatsFile: true,
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

    //Compress Images
    const ImageCompressLoader = {
      loader: "image-webpack-loader",
      options: {
        svgo: SVGOConfig,
      },
    };
    ImageRule.use.push(ImageCompressLoader);
    SVGRule.use.push(ImageCompressLoader);
  }

  return {
    mode,
    devtool: "source-map",
    output: {
      filename: namePatterns.JSModule,
      chunkFilename: namePatterns.JSChunk,
      path: path.resolve(__dirname, "build", "client"),
      publicPath: "/",
      clean: true,
    },
    entry: "./src/index.tsx",
    resolve: { extensions: [".ts", ".tsx", ".js", ".css"] },
    module: {
      rules: [CSSRule, ImageRule, SVGRule, TypeScriptRule],
    },
    plugins,
    optimization: {
      ...minimizing,
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: true,
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
        "/api": { target: "http://localhost:3001", logLevel: "silent" },
      },
    },
  };
};
