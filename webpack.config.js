const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"), // 絶対パスを取得、__dirnameは現在のディレクトリ。
    filename: "main.js", // 出力するファイル名の変更。デフォルトはmain.js
  },
  module: {
    rules: [
      {
        test: /\.css/, // 正規表現で.cssファイルを対象にする
        use: [
          {
            // loader: "style-loader", // style-loaderを使用してCSSをHTMLの中にstyleタグに注入する。
            loader: MiniCssExtractPlugin.loader, // MiniCssExtractPluginを使用してCSSを別ファイルに抽出する。
          },
          {
            loader: "css-loader", // css-loaderを使用してCSSを読み込む。loaderは下から順に適用されるので、順番が大事。
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 元となるHTMLファイル
    }),
  ],
};
