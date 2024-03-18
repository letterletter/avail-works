const path = require('path');
const progressBarPlugin = require("progress-bar-webpack-plugin");

const tsConfigPath = path.join(__dirname, 'tsconfig.json');

const config = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: tsConfigPath,
            },
          },
        ],
      },
    ],
  },
};


/** @type WebpackConfig */
const webviewConfig = {
  mode: "production",
  entry: {
    "plugin-manage": path.join(
      __dirname,
      "src",
      "webview",
      "source/plugin-manage",
      "index.tsx"
    )
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx", ".css"],
  },
  devtool: "hidden-source-map",
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendors",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        exclude: "/node_modules/",
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "webview"),
  },
  plugins: [
    //@ts-ignore
    new progressBarPlugin(),
  ],
};

// module.exports = (env, argv) => {
//   if (argv.mode === 'development') {
//     config.devtool = 'source-map';
//   }

//   return config;
// };


module.exports = [config, webviewConfig];
