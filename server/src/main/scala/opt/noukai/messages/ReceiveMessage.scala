package opt.noukai.messages

import io.circe.{Json, jawn}
import opt.noukai.entities.Identify

sealed abstract class ReceiveMessage
case class AnswerReach(identify: Identify, id: Int, answer: Int) extends ReceiveMessage
case class ActionButtonPushed(identify: Identify) extends ReceiveMessage

object ReceiveMessage {
  def fromJsonString(identify: Identify)(jstr: String): Option[ReceiveMessage] =
    jawn.decode[Json](jstr).toOption.flatMap { json =>
      val cur = json.cursor
      (for {
        _ <- (for {
          _ <- cur.get[Boolean]("action")
        } yield
          ActionButtonPushed(identify)).swap
        e <- (for {
          id <- cur.get[Int]("questionId")
          ans <- cur.get[Int]("answer")
        } yield
          AnswerReach(identify, id, ans)).swap
      } yield
        e).swap.toOption
    }
}
