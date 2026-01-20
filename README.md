Udemy: Webpackでウェブサイト制作のHTML/CSS/JSコーディングを一気に効率化する実践講座 (Mac / Win)で学んだことまとめ。
https://www.udemy.com/course/webpack-config/

# Section2

要約
https://github.com/shunwitter/webpack_course/tree/section/02

1、Gitの初期化
作業フォルダを作り（mkdir フォルダ名）、そのフォルダに移動して、「git init」で、.git が作られる。（ls -aで確認できる。）

2、Gitの初期設定
git config user.name　で、ユーザーネームを確認する。
git config user.email　で、emailを確認する。

変更する場合は、
git config —global user.name “Mai”
git config —global user.email “test@example.com”

ここのメールアドレスは、
プロフィール > Settings > Email > Keep my email addresses private をONにし、そこに書いてある、
We’ll remove your public profile email and use 160446887+maichu050505@users.noreply.github.com when performing web-based Git operations (e.g. edits and merges) and sending email on your behalf. If you want command line Git operations to use your private email you must set your email in Git.
ここの、160446887+maichu050505@users.noreply.github.com　このアドレスを登録すると、自分のメールアドレスが刻み込まれずに、githubと連携することができる。

ーーーーーーーー
vim test.txt
a = INSERTモード
esc + :wq + Enter　は、保存して閉じる
:q + Enter は保存せず閉じる
ーーーーーーーー

3、最初のコミット
git add .
git commit -m “ Initial commit”
で、最初のコミットをする。

4、（初めてGithubを使う場合）SSHキーの作成
・確認方法：
ターミナルで、ssh -T git@github.com　を実行
Hi maichu050505! You've successfully authenticated, but GitHub does not provide shell access.
と表示されれば、SSHキーを作成しなくてOK！

・作成する場合は、
cd ~/.ssh
ssh-keygen -t ed25519 -C "email@example.com"

5、Githubと紐付け
git remote add origin git@github.com:maichu050505/test_repo.git　を実行
git remote を実行すると、origin と出るはず。
git push -u origin main　で、プッシュする。（-uをつけるのは、初回だけ。main → origin/main と記録される。ちなみに、git clone では-uは不要）

※ git cloneとgit remote add origin の違い：
(1) cloneを使う場合（9割こっち）
条件
・GitHubにリポジトリがすでに存在
・ローカルにまだ .git がない
・＝ これから初めて持ってくる
起こること
・フォルダが作られる
・.git が作られる
・origin が自動で設定される
・main/master がチェックアウトされる

(2) remote add origin を使う場合、「このGitは、ここに送る」という紐づけだけ行い、中身はコピーされない。後付け設定。
条件
・ローカルにすでに .git がある
・＝ git init 済み or 既存プロジェクト
・GitHubリポは 空（READMEなし） が多い

チェック方法：
ls -aを実行し、
.git が ある → remote add
.git が ない → clone

「最初に作ったのがGitHubなら clone、
最初に作ったのがローカルなら remote add」

6、SSHパスフレーズを作成する（省略）

# Section3: Webpack入門

補助教材：
https://github.com/shunwitter/webpack_course/tree/5x/section/03

1, npm init を実行

package name: (webpack-study) が出るので、このままEnterキーを押すと、(webpack-study) の中の文字列になる。
それ以外も空欄でエンター

```bash
package name: (webpack-study)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author: Mai
license: (ISC)
About to write to /Users/maichu0505/Documents/Web勉強 2024-/Udemy/webpack-study/package.json:

{
"name": "webpack-study",
"version": "1.0.0",
"main": "index.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"author": "Mai",
"license": "ISC",
"description": ""

Is this OK? (yes)
```

で、エンターを押すと、lsで確認すると、package.json ができている。

code . で、VS Codeで開く。
package.jsonを開き、最後の行に、,を追加し、
「"private": true」を追加する。最後に,は不要。

2, VS codeのターミナルで、npm install —save-dev webpack@latest を実行
—save-dev を入れ忘れた場合：
npm uninstall webpack　をしてから、
npm install --save-dev webpack@latest　を実行。

—save-devを入れる理由は、本番では不要で、開発時だけ必要だから！！
package.jsonで、

```json
"devDependencies": {
"webpack": "^5.104.1"
}
```

となる。

3、npm install --save-dev webpack-cli@latest を実行
npm i -D webpack-cli@latest でもOK（短縮版）

4、エントリーポイントを使う。（Webpackが一番最初に観にいくファイル。index.js）
src/index.jsを作成
console.log("Hello Webpack!");
を書く。

npx webpack　を実行
そうすると、dist/main.js が生成。ただ、警告が出る。

npx webpack —mode development を実行すると、警告は出なくなる。開発用はdevelopment, 本番環境では、productionを指定。

5、モジュールを作成する。
src/modules/my.js

```js
export default () => {
  console.log("This is my module!");
};
```

index.jsで読み込む

```js
import my from "./modules/my.js"; // 読み込み
my(); // 実行
```

webpackでビルドする
ターミナルで、npx webpack --mode developmentを実行。
dist/main.jsが出力させている。

githubにバージョン管理する。node_modulesフォルダは除外する。（npm installすればpackage.jsonからnode_modulesが生成できるから）
.gitignoreを作成し、
node_modules/ とかく。

# Section4: Webpack設定ファイルとLoader

補助教材：
https://github.com/shunwitter/webpack_course/tree/5x/section/04

ビルドしたコードをブラウザで表示する
1、distフォルダ内にindex.htmlを作成
html:5と打って、タブキーで雛形が展開される。

<script src="./main.js"></script>

と、main.jsを読み込む。
Finderで開き、index.htmlをChromeで開くと確認できる。

## Webpackの設定ファイルを作成

webpack.config.jsを作成する。

```js
const path = require("path");

module.exports = {
entry: "./src/index.js",
output: {
path: path.resolve(**dirname, "./dist"), // 絶対パスを取得、**dirnameは現在のディレクトリ。
},
};
```

ターミナルで、npx webpack --mode developmentを実行すると、さっきと同じようにビルドされる。（dist/main.jsが出力）

## CSSを読み込む方法

src/modules/my.cssを作成
それを、src/index.jsで読み込む。
import "./modules/my.css";　を追加。

CSS LoaderとStyle loaderが必要になるので、
npm install —save-dev css-loader@latestを実行
npm install —save-dev style-loader@latest を実行

webpack.config.jsに、

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"), // 絶対パスを取得、__dirnameは現在のディレクトリ。
    filename: "main.js", // 出力するファイル名の変更。デフォルトはmain.js
  },
  // 追加！！
  module: {
    rules: [
      {
        test: /\.css/, // 正規表現で.cssファイルを対象にする
        use: [
          {
            loader: "style-loader", // style-loaderを使用してCSSをHTMLの中にstyleタグに注入する。
          },
          {
            loader: "css-loader", // css-loaderを使用してCSSを読み込む。loaderは下から順に適用されるので、順番が大事。
          },
        ],
      },
    ],
  },
};
```

と書く。

npx webpack --mode developmentを実行すると、dist/main.jsに、my.cssが読み込まれている。

ターミナルでは、
open -a "Google Chrome" ./dist/index.html
を実行すると、Chromeで開く。

# Section5: Webpackのプラグイン

補助教材：https://github.com/shunwitter/webpack_course/tree/5x/section/05

## style-loaderの問題点：

1、HTMLの肥大化
2、CSSが別ファイルではなく、HTMLの中にCSSの記述が入っている

この問題を解決するために、Webpackのプラグインを使う。
npm install --save-dev mini-css-extract-plugin@latest でインストール。
webpack.config.jsに、下記を追加。
moduleの下に、pluginsを追加し、moduleのloaderをMiniCssExtractPlugin.loaderに差し替え。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  plugins: [new MiniCssExtractPlugin()], // 追加
};
```

その後、npx webpack --mode development でビルドすると、dist/main.css　が生成される。
そのため、index.htmlに、<link rel="stylesheet" href="./main.css" /> を追加して読み込む。

## プラグインでHTMLを自動生成する方法

- distの中身は直接編集すべきではない。編集するのはsrcの中だけ。
- dist/index.htmlを直接編集しないために、html-webpack-pluginを使用する。
  npm install --save-dev html-webpack-plugin@latestを実行。
- webpack.config.jsに下記を追加。pluginsの配列に、HtmlWebpackPluginを追加。

```js
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
```

- そして、src/index.htmlを作成する。
- ここで、npx webpack --mode developmentを実行してビルドすると、index.htmlが生成されるようになる。

# Section6: ファイル構成を整える

補助教材：https://github.com/shunwitter/webpack_course/tree/5x/section/06

## distフォルダ内の不要なファイルを自動的に削除する

npm install --sav-dev clean-webpack-plugin@latestでインストール。
webpack.config.jsに、下記を追加し、pluginsの配列に、new CleanWebpackPlugin()を追加する。

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
```

npx webpack --mode development でビルドすると、まず、dist内のファイルが全て削除されてから、新しいファイルが生成される。

## 生成されるCSSファイル名を変更する

webpack.config.jsの、new MiniCssExtractPlugin()の中で、CSSファイル名を設定する。ビルド前と同じファイル名にする。

```js
new MiniCssExtractPlugin({
    filename: "./css/my.css", // 抽出したCSSファイルの名前を指定する
}),
```

index.htmlに読み込む記述も自動で変更してくれる。

## distフォルダの中を、cssやjsフォルダにまとめるには、webpack.config.jsで、パスを指定する。

- CSS:

```js
new MiniCssExtractPlugin({
    filename: "./css/my.css", // 抽出したCSSファイルの名前を指定する
}),
```

- JS:

```js
output: {
    path: path.resolve(__dirname, "./dist"), // 絶対パスを取得、__dirnameは現在のディレクトリ。
    filename: "./js/main.js", // 出力するファイル名の変更。デフォルトはmain.js
  },
```

## srcフォルダの中を整理する。distフォルダと同じ構成にする。

- src/css/my.css
- src/js/my.js, main.js
- src/templates/index.html
  それぞれ、webpack.config.jsと、main.jsのパスを修正する。

# Section7: 画像の読み込み

補足教材：https://github.com/shunwitter/webpack_course/tree/5x/section/07

- src/images/ディレクトリの中に、画像を用意する。
- npm install --save-dev url-loader@latest でインストール
- webpack.config.jsで、modulesのrulesの配列の中に、新しくtestを追加する。

```js
{
test: /\.(png|jpg|gif|svg)/,
use: [
    {
        loader: "url-loader",
        options: {
            esModule: false, // 画像をHTMLに埋め込む際の設定。falseにしないと画像が表示されないことがある。
        },
        },
    ],
},
```

- templates/index.htmlの中で、imgタグを配置。<img src="<%= require('../images/icon.png') %>" />
- これでビルドすると、dist内に画像ファイルが出力されないが、ブラウザで画像が表示される。画像のファイル名がものすごい長くなり、よろしくない。
- そこで、file-loader をダウンロードする。npm install --save-dev file-loader@latest
- webpack.config.jsで、先ほどのurl-loaderのところを、file-loaderに変更する。optionsに、name: "./images/[name].[ext]",を追加する。
- ビルドすると、dist内に、画像ファイルが生成される。
  つまり、url-loaderではなく、file-loaderを使う！！

```js
{
    test: /\.(png|jpg|gif|svg)/,
    use: [
        {
        loader: "file-loader",
        options: {
            esModule: false, // 画像をHTMLに埋め込む際の設定。falseにしないと画像が表示されないことがある。
            name: "./images/[name].[ext]", // 出力する画像ファイルの名前を指定する
        },
        },
    ],
},
```

## file-loaderのnameに使えるオプション

画像のファイル名のカスタマイズには、
[name] [ext] 以外にも下記のようなものが使用できます。

### [path]

リソースへのパス。srcフォルダを参照してしまうので今回は不適切。

### [folder]

フォルダーの名前。
images/about/icon.png のように画像フォルダの中にさらに階層を設けたい場合に最適です。

### [query]

?foo=bar のようなクエリストリングも含める場合。

### [emoji]

ランダムな絵文字が出力されます。
使いどころが分からないおもしろ機能 😆
[emoji:<length>]
絵文字の数をコントロール。
[emoji:2]と書くと絵文字が2つ出力されます。

### [hash]

ハッシュ値を自動生成してくれます。
講座後半のキャッシュクリアのテクニックで使用します。

### 公式ドキュメント：

https://webpack.js.org/loaders/file-loader/#placeholders

## Webpack5のAsset Modulesを使う。

Webpack5では、file-loaderを使う必要がなく、Asset Modulesを使える。
webpack.config.jsの、moduleのrulesのところを下記のようにする。

```js
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
```

- file-loaderとurl-loaderは不要なので、npm uninstall file-loader url-loader でアンインストールする。

# 効率的なHTMLの制作方法

- 補足教材：https://github.com/shunwitter/webpack_course/tree/5x/section/08

## Pugを使って書く

- npm install --save-dev pug-html-loader@latest でインストール
- npm install --save-dev html-loader@latest でインストール
- webpack.config.jsを更新。moduleのrulesのところに新しく{}を追加する。

```js
{
  test: /\.pug$/,
  use: [
    {
      loader: "html-loader",
    },
    {
      loader: "pug-html-loader",
      options: {
        pretty: true, // Webpack5では、optionsが必要
      },
    },
  ],
},
```

- templates/index.pugを作成。
  書き方の詳細：
  https://pugjs.org/api/getting-started.html
  サイドバーのTagsを見る。
  pugは、HTMLの階層構造をインデントで表現する。インデントは半角スペース2個。

```pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Template HTML
  body
    h1 Hello, Webpack!
    img(src="../images/icon.png", alt="")
    img(src="../images/thumbnail.jpg", alt="")
```

## 複数のHTMLページを作る。

- webpack.config.jsで、new HtmlWebpackPluginを追加する。

```js
new HtmlWebpackPlugin({
  template: "./src/templates/index.pug", // 元となるHTMLファイル
  filename: "index.html", // 出力するHTMLファイルの名前
}),
new HtmlWebpackPlugin({
  template: "./src/templates/access.pug", // 元となるHTMLファイル
  filename: "access.html", // 出力するHTMLファイルの名前
}),
```

## 部分テンプレートを利用した効率化

- templates/\_menu.pug を作成し、ヘッダーナビゲーションを書く。
- templates/index.pugや、templates/access.pugから、

```pug
include _menu.pug
```

で読み込む。

## テンプレート拡張を利用した効率化

- templates/\_layout.pugを作成し、templates/access.pugの、

```pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Access
  body
    include ./_menu.pug
    block content
```

この部分を、切り取って貼り付けする。

- templates/access.pugは、代わりに下記のコードで読み込み。templates/index.pugも同じ。

```pug
extends ./_layout.pug
block content
```

## 変数を使ってHTMLをカスタマイズ

- titleタグの中身をページごとに動的に設定する。
- \_layout.pugに、

```pug
block locals
  - var title = 'My Website';
```

と書き、実際のtitleタグを書くところは、

```pug
title #{title}
```

とする。

- templates/index.pugで、下記を記載。

```pug
block locals
  - var title = 'Home Page';
```

- また、templates/access.pugでは、下記を記載。

```pug
block locals
  - var title = 'Access Page';
```

- Pugのドキュメント：https://pugjs.org/api/getting-started.html

# Section9: ローカルサーバーを利用した開発

補助教材：https://github.com/shunwitter/webpack_course/tree/5x/section/09

- webpack-dev-server というライブラリを使ってローカルサーバーを起動する。
- メリットの1つに Live Reload（変更があれば自動でリロードしてくれる機能）がある。
- npm install --save-dev webpack-dev-server@latestで のインストール後、webpack.config.js に以下の内容を追加する。

```js
// 追加（もしなければ）
const path = require("path");
// ...省略

module.exports = {
  // 追加
  devServer: {
    static: path.resolve(__dirname, "src"),
  },
};
```

- npx webpack serve --mode=development を実行
- http://localhost:8080/ が出るので、確認できる。
- Live Reloadが使える。
- \_menu.pugで、

```pug
a(href="./index.html") Home
a(href="./access.html") Access
```

これを、こうできる！相対パスを意識しなくて良くなる。単にルート直下だから、/index.htmlのようにかける。（ルートパス）

```pug
a(href="/index.html") Home
a(href="/access.html") Access
```

このように書かないと、\_menu.pugで問題が起こる。

## webpack-dev-serverに関するTip

- 実際にはdistを生成していないが、開発サーバーで変更がLive Reloadで見れる。
- 最終的に開発が終わったら、npx webpack --mode production
  を実行して、distを生成する。

# Section10: Sassを使う

補助教材：https://github.com/shunwitter/webpack_course/tree/5x/section/10

- npm install --save-dev node-sass をインストールと言っているけど、これは古い。今は、
- npm install --save-dev sass でインストールする。
- npm install --save-dev sass-loader をインストール
- ちなみに、短縮系は、npm i -D sass sass-loader でOK
- webpack.config.jsの、moduleのrulesのuseに追加する。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)/,
        use: [
          {
            // loader: "style-loader", // style-loaderを使用してCSSをHTMLの中にstyleタグに注入する。
            loader: MiniCssExtractPlugin.loader, // MiniCssExtractPluginを使用してCSSを別ファイルに抽出する。
          },
          {
            loader: "css-loader", // css-loaderを使用してCSSを読み込む。loaderは下から順に適用されるので、順番が大事。
          },
          {
            loader: "sass-loader", // sass-loaderを使用してSassをCSSに変換する。
          },
        ],
      },
    ],
  },
};
```

- css/main.cssを、main.scssに変更。
- js/main.jsで、main.cssをインポートしているところを、main.scssをインポートするように変更。

# Section11: ES6

補助教材：https://github.com/shunwitter/webpack_course/tree/5x/section/11

- Bableを使って、新しいJavaScript(ES6)を、古いブラウザでも動く形に変換（トランスパイル）する。
- 補足：昔のBabel（必須だった時代）
  ・IE11 対応
  ・古いAndroidブラウザ
  ・ES5 しか動かない環境
  👉 Babelは絶対必要
- 今のBabel（2025年）
  ブラウザ事情
  Chrome / Edge / Safari / Firefox は ES2020 以降ほぼ対応
  IEは完全終了
  ES Modules が標準
  👉 「変換しなくても動くJS」が増えた
- 今のBabelの役割：
  ・JSXを書きたい（React導入）
  ・古いブラウザ対応が必要と言われた
  ・「このJS、Safariで動かない」と実害が出た

- Babelを使わない世界線も増えている
  Vite / Next.js / Astro など内部で esbuild や swc を使用。
  速くて設定不要。
  Babelを「直接触らない」
  👉 Babelは「消えた」ように見える理由

- 下記をインストール。
  npm i -D babel-loader @babel/core @babel/preset-env

- webpack.config.jsに、modulesのrulesにtestを追加

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],
    },
  },
},
```

- そうすると、ビルドしたmy.jsがアロー関数ではなく、functionになっている。

## 対象ブラウザを指定してトランスパイルする

- preset-envにオプションを渡す。
  webpack.config.jsで、下記のように記載。

```js
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
```

# Section12: コードのデバック方法

補助教材：https://github.com/shunwitter/webpack_course/tree/5x/section/12

## JSのソースマップ

- webpack.config.jsonに、1行追加。

```js
module.exports = {
  devtool: "source-map",
};
```

- そうすると、コンソールで、自分が書いたJSをそのまま見れる。
- 他にも、devtoolは色々指定できる。
  https://webpack.js.org/configuration/devtool/

## Sassのソースマップ

- css-loaderにoptionを追加する。

```js
 {
  loader: "css-loader",
  // ここを追加！！
  options: {
    sourceMap: true, // ソースマップを有効にする。
  },
},
```

- そうすると、開発ツールの要素から、元のScssが見れる。
- ただし、trueにすると、ファイルサイズが重くなるので、重くなる場合はfalseにする！！

## modeオプション

- 本番用にbuildするとき：プロダクションモード
  npx webpack --mode production

- 開発用にbuildするとき：developmentモード
  npx webpack serve --mode=development

- webpack.config.jsに、下記を追加すると、

```js
module.exports = {
  mode: "development",
};
```

npx webpackだけで、developmentモードでビルドされる。

## package.jsonでのコマンド管理

- package.jsonのscriptsを下記のように記載。

```json
"scripts": {
   "start": "webpack-dev-server",
    "build": "webpack --mode production",
    "build:dev": "webpack"
  },
```

- npm start とすると、webpackサーバーが立ちあがる。
- npm run buildすると、本番用にビルドする。
- npm run build:dev すると、devモードでビルドする。

# Section13: 画像の最適化

- npm i -D image-webpack-loader でインストール
- webpack.config.jsに、のtest: 画像のところに、下記を追加。

```js
{
  test: /\.(png|jpg|gif|svg)/,
  type: "asset/resource",
  generator: {
    filename: "images/[name][ext]", // 出力する画像ファイルの名前を指定する。.は使わない。[ext]の中に.が含まれるため。
  },
  use: [
   {
    loader: "image-webpack-loader",
    options: {
      mozjpeg: {
        progressive: true,
        quality: 65,
      },
    },
  },
  ],
},
```

- ただし、image-webpack-loaderはもう主流ではない！！
  ・ビルド時に毎回圧縮するので遅くなる
  ・dev / production 切り替えが面倒
  ・エラー対応コストが高い
- 実務では例えば、下記のようにする。
  ・画像はsrc/images_raw/に未圧縮の画像を入れる。
  ・npm run imgで、一括で圧縮&webpを作り、src/images/に入れる。
  ・devサーバーは軽い。
  ・開発後は納品前に、npm run buildする。npm run buildに、npm run imgを含める。
  ・webpack.config.jsは、

  ```js
  {
    test: /\.(png|jpe?g|gif|svg|webp)$/i,
    type: "asset/resource",
    generator: {
      filename: "images/[name][ext]",
    },
  }
  ```

  ・設定方法：
  1, npm i -D sharp でsharpをインストール
  2, script/img.jsを作成。（WebP対応）

  ```js
  // scripts/img.js
  const fs = require("fs");
  const path = require("path");
  const sharp = require("sharp");

  const INPUT_DIR = path.resolve(__dirname, "../src/images_raw");
  const OUTPUT_DIR = path.resolve(__dirname, "../src/images");

  // 対象拡張子
  const TARGET_EXTS = new Set([".jpg", ".jpeg", ".png"]);

  function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
  }

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) files.push(...walk(full));
      else files.push(full);
    }
    return files;
  }

  function outPathFor(inputPath) {
    const rel = path.relative(INPUT_DIR, inputPath);
    return path.join(OUTPUT_DIR, rel);
  }

  function isUpToDate(input, outputs) {
    if (!outputs.every(fs.existsSync)) return false;
    const inTime = fs.statSync(input).mtimeMs;
    return outputs.every((p) => fs.statSync(p).mtimeMs >= inTime);
  }

  async function optimizeOne(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!TARGET_EXTS.has(ext)) return { skipped: true };

    const baseOut = outPathFor(filePath);
    const webpOut = baseOut.replace(ext, ".webp");

    ensureDir(path.dirname(baseOut));

    // 更新チェック（元形式 + webp 両方）
    if (isUpToDate(filePath, [baseOut, webpOut])) {
      return { skipped: true };
    }

    const img = sharp(filePath);

    // ---- 元形式（jpg/png） ----
    if (ext === ".png") {
      await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(baseOut);
    } else {
      await img.jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(baseOut);
    }

    // ---- WebP ----
    await img
      .webp({
        quality: 75,
        effort: 4, // 圧縮効率（0-6）
      })
      .toFile(webpOut);

    return { skipped: false };
  }

  (async () => {
    ensureDir(INPUT_DIR);
    ensureDir(OUTPUT_DIR);

    const files = walk(INPUT_DIR);
    if (files.length === 0) {
      console.log("[img] No files in src/images_raw");
      return;
    }

    let done = 0;
    let skipped = 0;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!TARGET_EXTS.has(ext)) continue;

      try {
        const res = await optimizeOne(file);
        if (res.skipped) skipped++;
        else done++;
      } catch (e) {
        console.error("[img] Failed:", file);
        console.error(e);
        process.exitCode = 1;
      }
    }

    console.log(`[img] optimized: ${done}, skipped: ${skipped}`);
  })();
  ```

  3, package.jsonの、scriptsのbuildを書き換え、imgを追加。

  ```json
   "build": "npm run img && webpack --mode production",
   "img": "node scripts/img.js"
  ```

  4、HTML側では、普通に、このように使う。

  ```html
  <picture>
    <source srcset="images/hero.webp" type="image/webp" />
    <img src="images/hero.jpg" alt="" />
  </picture>
  ```

  使い方は、画像がきたら、images_rawに入れ、npm run imgする。最終的に、npm run buildすれば、npm run imgし忘れても大丈夫。
