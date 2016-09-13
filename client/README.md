
## コレは何？

納会アプリのクライアントサイドです。

React, Redux, typescript, webpackあたりの技術で構成されています。

## requirement

- NodeJS 6.X~

npmタスクを動かすのに必要です。

## 動かし方

- ライブラリをインストールする。

`npm install`

- 部署の設定を入れ替える

https://github.com/opt-tech/noukai_quiz_app/blob/master/client/src/noukai-app/login/LoginRoot.tsx#L17

- （本番向けの）ビルドをする

（ソースマップを吐かず、reactの開発用ワーニングも出さず、minifyした状態で出力します。）

`npm run build:prod`

### ユーザー向け画面

`http://localhost:3000/noukai_login` にアクセス

- 所属と名前（ユニークになればなんでもいい。マルチバイト文字可）でログインして、問題が配られるのを待機する。
- 問題が配られたら、回答して正解を待つ。
- （画面下部に音のなるのボタンがある）

### 管理者向け画面

`http://localhost:3000/console` にアクセス

- みんながログインしたら、任意のタイミングで問題番号（例：問題１）をクリックして問題を配布する
- 回答が出揃ったら、回答番号（例：回答１）を選んで回答結果を配布する
- 問題を全て終えたら、「go ランキング」をクリックしてランキング発表画面にいく
- 後は流れランキングを発表していく
- （ランキング発表の途中でミスったら、URLを直接叩けば任意の箇所から進めます。）

## 開発の仕方

## build

webpackで差分変更をwatchした状態でビルドする。

`npm run build`

## 開発用のモックサーバーを立てる

別Terminalでサーバーを立てることで、フロントのみで動作確認できます。
expressでwebsocketを噛ませています。

`npm run server`

localhost:3000で立ち上がります。

## テスト

karmaでChrome上で動かします。

単一ファイルのテスト

`npm run test:ut ./src/console/buttons/__test__/Reducer.spec.ts`

全部のテスト

`npm run test:all`
