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
