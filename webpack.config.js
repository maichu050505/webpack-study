const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { type } = require("os");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"), // 絶対パスを取得、__dirnameは現在のディレクトリ。
    filename: "./js/main.js", // 出力するファイル名の変更。デフォルトはmain.js
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
      {
        test: /\.(png|jpg|gif|svg)/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]", // 出力する画像ファイルの名前を指定する。.は使わない。[ext]の中に.が含まれるため。
        },
        use: [
          // {
          //   loader: "file-loader",
          //   options: {
          //     esModule: false, // 画像をHTMLに埋め込む際の設定。falseにしないと画像が表示されないことがある。
          //     name: "./images/[name].[ext]", // 出力する画像ファイルの名前を指定する
          //   },
          // },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: "pug-html-loader",
            options: {
              pretty: true, // Webpack 5ではoptionsを使って整形する必要がある。
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/main.css", // 抽出したCSSファイルの名前を指定する
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/index.pug", // 元となるHTMLファイル
    }),
    new CleanWebpackPlugin(), // 出力先ディレクトリをビルド前にクリーンアップする
  ],
};
