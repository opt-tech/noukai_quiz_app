package opt.noukai

import akka.actor._
import akka.pattern.ask
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.{Flow, Sink, Source}
import actors._
import actors.AnswererActor._
import actors.CorrectAnswers._
import cats.data.Xor
import cats.std.all._
import cats.syntax.all._
import entities.Identify
import io.circe.{Json, jawn}
import messages._

import scala.concurrent.{ExecutionContext, Future}

trait NoukaiQuiz {
  import NoukaiQuiz._

  def quizFlow(dept: String, name: String): Flow[String, SendMessage, Any]

  def broadcastProblem(id: Int): Unit
  def answeringProblem(id: Int): Unit

  def getRanks(max: Int): Future[Seq[Score]]
  def getClicker: Future[Clicker]
  def getUserSize: Future[Int]
}

object NoukaiQuiz {

  import scala.concurrent.duration.DurationInt
  implicit val timeout: akka.util.Timeout = 60 second // 可変にしたい

  case class Score(rank: Int, name: String, correctNum: Int, time: Double)
  case class Clicker(num: Long, name: String)

  def apply(system: ActorSystem, questionsPath: String): NoukaiQuiz = {

    implicit val ec: ExecutionContext = system.dispatcher

    val correctAnswersMap = jawn.decode[List[Json]](scala.io.Source.fromFile(questionsPath, "utf-8").mkString) match {
      case Xor.Right(questionsJson) => questionsJson.map { json =>
        val cur = json.cursor
        (for {
          id <- cur.get[Int]("id")
          answer <- cur.get[Int]("answer")
        } yield {
          id -> answer
        }).fold(f => throw f, identity)
      }
      case Xor.Left(e) => throw e
    }
    val correctAnswers = system.actorOf(Props(classOf[CorrectAnswers], correctAnswersMap.toMap))
    val quizMaster = system.actorOf(Props(classOf[QuizMasterActor]).withDispatcher("akka.actor.quiz-master-dispatcher"))

    new NoukaiQuiz {
      override def quizFlow(dept: String, name: String): Flow[String, SendMessage, Any] = {

        // 入って行く値はString
        val sink = Flow[String]
          .map(ReceiveMessage.fromJsonString(Identify(dept, name)))
          .collect { case Some(m) => m }
          .to(Sink.actorRef[ReceiveMessage](quizMaster, AnswererLeft(Identify(dept, name)))) // Sink.actorRef(ref, onCompleteMessage) というメソッド

        // 出て行く時はSendMessage
        val source = Source
          .actorRef[SendMessage](1023, OverflowStrategy.fail)
          .mapMaterializedValue(quizMaster ! NewAnswerer(Identify(dept, name), _))

        Flow.fromSinkAndSource(sink, source)
      }

      override def broadcastProblem(id: Int) = quizMaster ! BroadcastProblem(id)

      override def answeringProblem(id: Int) = (correctAnswers ? QueryCorrect(Seq(id))).foreach {
        case ResultCorrect(Seq(correct)) => quizMaster ! AnsweringProblem(id, correct)
        case _ => Unit
      }

      private[this] def makeSummary = (quizMaster ? RequestAnswers).mapTo[Seq[AnswersInfo]]

      override def getRanks(max: Int = 50): Future[Seq[Score]] = for {
        list <- makeSummary
        validityRanking: Seq[(Identify, (Int, Double))] <- list.map { case AnswersInfo(id, ans, _) =>
          val (pnums, rets) = ans.toList.sorted.unzip
          val (anss, durs) = rets.unzip
          (correctAnswers ? QueryAnswers(pnums, anss)).map { case ResultAnswers(rwList) =>
            id -> (
              rwList.count(identity),
              (durs.map { dur => dur.getSeconds + dur.getNano / 1000000 / 1000.0 }.sum * 1000).toInt / 1000.0
            )
          }
        }.toList.sequence.map(_.sortWith { case((_, (r1, t1)), (_, (r2, t2))) =>
            if(r1 == r2) t1 < t2 else r1 > r2
        })
      }
        yield
          validityRanking.take(max).zipWithIndex.map { case ((Identify(dept, name), (corrects, dur)), i) =>
            Score(i+1, s"$name（$dept）", corrects, dur)
          } |> { list =>
            val size = list.length
            if(size >= max )
              list
            else
              list ++ (size + 1 to max).map { i => Score(i, "-", 0, 9999.999) }
          }

      override def getClicker: Future[Clicker] = for {
        list <- makeSummary
        actionRanking = list.map { case AnswersInfo(id, _, count) =>
          id -> count
        }.sortBy(_._2).reverse
      }
        yield
          actionRanking.map { case (Identify(dept, name), num) => Clicker(num, s"$name（$dept）")}.head

      override def getUserSize: Future[Int] = (quizMaster ? RequestUserSize).mapTo[Int]
    }
  }
}
