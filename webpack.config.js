const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|bmp|svg|wav)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    library: 'scratch-boot',
    filename: '[name].js',
    // chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2'
  },
  // output: {
  //   libraryTarget: 'ES6'
  // },
  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //   },
  // },
  plugins: [
    new CleanWebpackPlugin({}),
    new CopyPlugin([
      {
        from: "node_modules/scratch-blocks/media",
        to: "static/media",
      },
    ]),
    new HtmlWebPackPlugin({
      title: "Example Scratch project",
      template: "index.html",
    }),
  ],
};
