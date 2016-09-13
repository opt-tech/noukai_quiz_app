
## これは何？

納会アプリのサーバサイドです。
akka-httpで実装されています。

## 必要なもの

- Java8
- sbt

## 使い方

 - フロントをビルドする

フロントエンドのREADMEをご確認下さい。

 - jarに固める

```
$ sbt assembly
```

 - jarを叩く

```
java -jar /path/to/jar 0.0.0.0 3000
```

引数として「ホスト」と「ポート番号」を与える事ができます。
ない場合、 `localhost:3000` として起動します。

 - gatlingのテストをする。

```
sbt gatling:test
```

testパッケージのSimulationが流れます。
（サーバーが立っていることが前提です。）