package opt.noukai.actors

import akka.actor.{Actor, ActorRef}
import java.time.{Duration, LocalDateTime}
import opt.noukai.entities.Identify
import opt.noukai.messages._
import scala.concurrent.ExecutionContext

class AnswererActor extends Actor {

  import AnswererActor._

  implicit val ec: ExecutionContext = context.system.dispatcher
  import scala.concurrent.duration.DurationInt
  context.system.scheduler.schedule(5 seconds, 5 seconds, self, Ping)

  var answerInfo: AnswererInfo = AnswererInfo.default
  var startTime: LocalDateTime = LocalDateTime.now
  var answers: Map[Int, (Int, Duration)] = Map.empty
  var actionCounter: Long = 0

  def receive = {
    // 初期化
    // 再接続の際に、subscriberを掛け替えるのにも呼ばれる
    case InitInfo(info, currentProblem) =>
      answerInfo = info
      // Actorの再起動の事を考えて、キャッシュから情報取得するならここ
      if(currentProblem != 0) {
        // ここで現在の問題に切り替える処理
        answerInfo.ref.foreach(_ ! BroadcastProblem(currentProblem))
      }
    // 回答者の回線が切れた場合。データは保持、接続先は消しておく。
    case _: AnswererLeft =>
      answerInfo = answerInfo.copy(ref = None)
    // 問題切り替え
    case p@BroadcastProblem(n) =>
      startTime = LocalDateTime.now
      answerInfo.ref.foreach(_ ! p)
    case s: SomeoneAnswered =>
      answerInfo.ref.foreach(_ ! s)
    // 回答
    case a@AnswerReach(_, id, ans) =>
      answers += (id -> (ans, Duration.between(startTime, LocalDateTime.now)))
      // 永続化とかするならここ
    // 回答発表
    case a@AnsweringProblem(id, _, _) =>
      val (ans, _) = answers.getOrElse(id, (-1, null))
      answerInfo.ref.foreach(_ ! a.putAnswer(ans))
    // アクションボタン
    case _: ActionButtonPushed => actionCounter += 1
    // 回答結果確認
    case RequestAnswers =>
      sender ! AnswersInfo(answerInfo.identify, answers, actionCounter)
    case Ping => answerInfo.ref.foreach(_ ! Ping)
    case e => println(s"Undefined Message: $e") // DEBUG
  }
}

object AnswererActor {

  case class AnswererInfo(identify: Identify, ref: Option[ActorRef])
  object AnswererInfo {
    lazy val default = apply(Identify("", ""), None)
  }

  case class AnswersInfo(id: Identify, answers: Map[Int, (Int, Duration)], actionCounter: Long)

}
