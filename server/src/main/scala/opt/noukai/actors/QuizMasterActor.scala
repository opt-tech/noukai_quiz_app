package opt.noukai.actors

import akka.actor._
import akka.pattern.{ask, pipe}
import cats.std.all._
import cats.syntax.all._
import opt.noukai.actors.AnswererActor._
import opt.noukai.entities.Identify
import opt.noukai.messages._
import opt.noukai.AnyTap
import scala.concurrent.ExecutionContext

class QuizMasterActor extends Actor {

  import scala.concurrent.duration.DurationInt
  implicit val timeout: akka.util.Timeout = 60 second // 可変にしたい

  implicit val ec: ExecutionContext = context.system.dispatcher

  var answerers: Map[Identify, ActorRef] = Map.empty
  var currentProblem: Int = 0
  var answeredNumber: Int = 0

  def receive = {
    // 新規参加者
    case NewAnswerer(id, subscriber) =>
      val info = InitInfo(AnswererInfo(id, Some(subscriber)), currentProblem)
      answerers.get(id).fold {
        // 新規作成する場合
        context.actorOf(Props(classOf[AnswererActor])) |> { answerer =>
          answerers += (id -> answerer)
          answerer ! info
        }
      } { answerer =>
        // 既に存在していて、切断していた場合
        answerer ! info
      }
    // 参加者切断
    case m@AnswererLeft(id) =>
      answerers.get(id).foreach(_ ! m) // 回線が切れても、情報は保持し続ける。
    // 回答到着
    case a@AnswerReach(id, _, _) =>
      answeredNumber += 1
      answerers.get(id).foreach(_ ! a)
      answerers.values.foreach(_ ! SomeoneAnswered(answeredNumber))
    // アクションボタンが押された
    case a@ActionButtonPushed(id) =>
      answerers.get(id).foreach(_ ! a)
    // 次の問題配信
    case p@BroadcastProblem(n) =>
      currentProblem = n
      answeredNumber = 0
      answerers.values.foreach(_ ! p)
    // 回答配信
    case a: AnsweringProblem =>
      currentProblem = 0 // 回答配信　〜　次の問題　の間に来た参加者には、「お待ち下さい」画面を見せる為
      answerers.values.foreach(_ ! a)
    // 全参加者の結果問い合わせ
    case RequestAnswers =>
      answerers.values.toList.map { ref =>
        (ref ? RequestAnswers).mapTo[AnswersInfo]
      }.sequence.pipeTo(sender)
    // 現在の参加者数問い合わせ
    case RequestUserSize =>
      sender ! ResultUserSize(answerers.size)
    case Ping => answerers.values.foreach(_ ! Ping)
    case e => println(s"Undefined Message: $e") // DEBUG
  }
}
