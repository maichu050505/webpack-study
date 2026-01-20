const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const loader = require("sass-loader");

module.exports = {
  mode: "development", // productionにすると、ファイルが圧縮される。デフォルトはproduction。
  devtool: "source-map",
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"), // 絶対パスを取得、__dirnameは現在のディレクトリ。
    filename: "./js/main.js", // 出力するファイル名の変更。デフォルトはmain.js
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "> 30%, not dead" }], // 30%以上のシェアを持つブラウザをターゲットにする設定
            ],
          },
        },
      },
      {
        test: /\.(css|scss|sass)/, // 正規表現で対象ファイルを指定する。
        use: [
          {
            // loader: "style-loader", // style-loaderを使用してCSSをHTMLの中にstyleタグに注入する。
            loader: MiniCssExtractPlugin.loader, // MiniCssExtractPluginを使用してCSSを別ファイルに抽出する。
          },
          {
            loader: "css-loader", // css-loaderを使用してCSSを読み込む。loaderは下から順に適用されるので、順番が大事。
            options: {
              sourceMap: false, // trueにすると、ソースマップを有効にする。ただしファイルサイズが大きくなる。
            },
          },
          {
            loader: "sass-loader", // sass-loaderを使用してSassをCSSに変換する。
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
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
          // {
          //   loader: "image-webpack-loader", // 画像を圧縮するローダー。今では古い。
          //   options: {
          //     mozjpeg: {
          //       progressive: true,
          //       quality: 65,
          //     },
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
      filename: "index.html", // 出力するHTMLファイルの名前
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/access.pug", // 元となるHTMLファイル
      filename: "access.html", // 出力するHTMLファイルの名前
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/members/taro.pug", // 元となるHTMLファイル
      filename: "members/taro.html", // 出力するHTMLファイルの名前
    }),
    new CleanWebpackPlugin(), // 出力先ディレクトリをビルド前にクリーンアップする
  ],
  devServer: {
    static: path.resolve(__dirname, "src"),
  },
};
