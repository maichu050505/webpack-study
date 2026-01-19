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
