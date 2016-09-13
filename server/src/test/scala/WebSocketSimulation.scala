import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.util.Random

class WebSocketSimulation extends Simulation {

  val random = new Random()

  val httpConf = http
    .baseURL("http://localhost:3000")
    .wsBaseURL("ws://localhost:3000")

  val scenario1 = scenario("WebSocket")
    //とりあえず適当なユーザーでログインする（URLとして不正な文字列でも変換してくれるっぽい）
    .exec(session => session.set("name", s"user_${random.nextString(3)}"))
    .exec(session => session.set("deps", s"dept_${random.nextInt}部"))
    .exec(ws("Connect WS").open("/quiz?name=${name}&dept=${deps}"))
    //ログイン後なので念のためちょっと待つ
    .pause(1)
    //wsでメッセージ送る。今回は返り値は気にしない
    .exec(ws("action 1").sendText("""{"action": true}"""))
    .exec(ws("action 2").sendText("""{"action": true}"""))
    .exec(ws("question1")
      .sendText("""{"questionId": 1, "answer": 1}""")
    )
    .exec(ws("action 3").sendText("""{"action": true}"""))
    .exec(ws("question2")
       .sendText("""{"questionId": 2, "answer": 3}""")
    )
    .exec(ws("action 4").sendText("""{"action": true}"""))
    .exec(ws("action 5").sendText("""{"action": true}"""))
    //コネクション閉じる。忘れるとどうなるんだろ？
    .exec(ws("Close WS").close)

  setUp(
    //scenario1を1000回（ユーザー）で繰り返します。
    scenario1.inject(atOnceUsers(1000))
  ).protocols(httpConf)
}
