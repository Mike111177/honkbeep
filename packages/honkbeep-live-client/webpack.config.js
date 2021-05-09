const path = require("path");
const newRequire = require("./scripts/newRequire");
const SVGOConfig = require("./svgo.config");

module.exports = (env) => {
  //Get mode
  const mode = env.production ? "production" : "development";
  const isProduction = mode === "production";
  const isDevelopment = !isProduction;
  const isDeployment = !!env.deploy;

  //File name patters for production or development
  const Patterns = isProduction
    ? {
        JSModule: "static/[contenthash].js",
        JSChunk: "static/[contenthash].js",
        Image: "static/[contenthash].[ext]",
        CSSModule: "static/[contenthash].css",
        CSSChunk: "static/[contenthash].css",
        CSSClass: "[hash:base64:10]",
        Font: "static/[contenthash].[ext]",
      }
    : {
        JSModule: "static/js/[name].[contenthash:8].js",
        JSChunk: "static/js/[name].[contenthash:8].chunk.js",
        Image: "static/media/[name].[contenthash:8].[ext]",
        CSSModule: "static/css/[name].[contenthash:8].css",
        CSSChunk: "static/css/[name].[contenthash:8].chunk.css",
        CSSClass: "[local]-[hash:base64:5]",
        Font: "static/fonts/[name].[contenthash:8].[ext]",
      };

  return {
    mode,
    devtool: "source-map",
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
        //CSS
        {
          test: /\.css$/,
          use: [
            isProduction
              ? require("mini-css-extract-plugin").loader
              : "style-loader",
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
        //Images (non-svg)
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
        //SVG
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
        //Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: Patterns.Font,
              },
            },
          ],
        },
        //Typescript
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            //For dev type checking is done separately for speed
            transpileOnly: isDevelopment,
          },
        },
      ],
    },
    plugins: [
      //Minify CSS in Production
      isProduction
        ? newRequire("mini-css-extract-plugin", {
            filename: Patterns.CSSModule,
            chunkFilename: Patterns.CSSChunk,
          })
        : null,
      //We always need to load index.html
      newRequire("html-webpack-plugin", { template: "./src/index.html" }),
      //Separately check types during development, during production this is done by ts-loader
      isDevelopment ? newRequire("fork-ts-checker-webpack-plugin") : null,
      //Analyze the bundle size during production, but not deployment
      isProduction && !isDeployment
        ? new require("webpack-bundle-analyzer").BundleAnalyzerPlugin({
            analyzerMode: "disabled",
            generateStatsFile: true,
          })
        : null,
      //For deployment generate gzipped files
      isDeployment ? newRequire("compression-webpack-plugin") : null,
    ].filter((i) => i),
    optimization: {
      //Only optimize for production
      ...(isDevelopment
        ? { minimize: false }
        : {
            minimize: true,
            minimizer: [
              newRequire("css-minimizer-webpack-plugin"),
              newRequire("terser-webpack-plugin", {
                parallel: true,
                extractComments: isDeployment ? /a^/ : true,
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
    //Default performance warnings for production
    performance: isProduction ? {} : false,
    //Less verbose readout
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
    //In deployment we have nginx, here we just have this
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
