import sbtassembly.MergeStrategy

name := "motto_quiz_motto"

version := "1.0"

scalaVersion := "2.11.8"

val akkaVersion = "2.4.7"
val circeVersion = "0.4.1"

enablePlugins(GatlingPlugin)

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-http-core",
  "com.typesafe.akka" %% "akka-http-experimental",
  "com.typesafe.akka" %% "akka-testkit"
).map(_ % akkaVersion) ++ Seq(
  "com.typesafe.akka" %% "akka-stream-testkit-experimental" % "2.0.4",
  "com.typesafe.akka" %% "akka-http-testkit-experimental" % "2.0.4",
  "io.gatling.highcharts" % "gatling-charts-highcharts" % "2.2.2" % "test",
  "io.gatling"            % "gatling-test-framework"    % "2.2.2" % "test",
  "org.scalatest" %% "scalatest" % "3.0.0-M15"
) ++ Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)

assemblyMergeStrategy in assembly := {
  case PathList("javax", "servlet", xs @ _*)         => MergeStrategy.first
  case PathList(ps @ _*) if ps.last endsWith ".properties" => MergeStrategy.first
  case PathList(ps @ _*) if ps.last endsWith ".xml" => MergeStrategy.first
  case PathList(ps @ _*) if ps.last endsWith ".types" => MergeStrategy.first
  case PathList(ps @ _*) if ps.last endsWith ".class" => MergeStrategy.first
  case "application.conf"                            => MergeStrategy.concat
  case "unwanted.txt"                                => MergeStrategy.discard
  case x =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}
