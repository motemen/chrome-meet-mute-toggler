/* eslint-env node */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/background.ts",
    content_script: "./src/content_script.ts",
  },
  output: {
    path: `${__dirname}/build/`,
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          transform: (content, _path) => {
            return JSON.stringify({
              ...JSON.parse(content.toString()),
              version: process.env.npm_package_version,
            });
          },
        },
        { from: "icons/*", context: "src/" },
      ],
    }),
  ],
  devtool: "inline-source-map",
};
