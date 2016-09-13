package opt.noukai

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse}
import akka.http.scaladsl.server.Directives
import akka.stream.Materializer
import akka.stream.scaladsl.Flow
import io.circe.generic.auto._
import io.circe.syntax._
import opt.noukai.messages._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

trait NoukaiServer extends Directives {

  implicit val system: ActorSystem

  val questionsPath: String

  val noukai = NoukaiQuiz(system, questionsPath)

  def toComplete(entity: HttpEntity.Strict) = entity |> { e => HttpResponse(entity = e) } |> (complete(_))
  def onError(e: Throwable) = HttpEntity(ContentTypes.`application/json`, s"""{"status": 500, "message": "${e.getMessage}"}""") |> toComplete

  val route =
    get {
      // dist系はdistディレクトリに。Reactが利用する。
      pathPrefix("dist") {
        getFromDirectory("""./../client/dist""")
      } ~
      // 静的ファイル
      pathPrefix("public") {
        getFromDirectory("""./../client/public""")
      } ~
      pathPrefix("api") {
        path("rankList") {
          onComplete(noukai.getRanks(50)) {
            case Success(list) =>
              HttpEntity(ContentTypes.`application/json`, s"""[${list.map(_.asJson.toString).mkString(", ") }]""") |>
              toComplete
            case Failure(e) => onError(e)
          }
        } ~
        path("mostClicker") {
          onComplete(noukai.getClicker) {
            case Success(clicker) =>
              HttpEntity(ContentTypes.`application/json`, clicker.asJson.toString) |>
                toComplete
            case Failure(e) => onError(e)
          }
        } ~
        path("getUserSize") {
          onComplete(noukai.getUserSize) {
            case Success(num) =>
              HttpEntity(ContentTypes.`application/json`, s"""{ "size": $num }""") |> toComplete
            case Failure(e) => onError(e)
          }
        } ~
          path("questions") {
            getFromFile(questionsPath)
          }
      } ~
      // WebSocket
      path("quiz") {
        (for {
          dept: String <- parameter('dept)
          name: String <- parameter('name)
        } yield
          handleWebSocketMessages(noukaiFlow(dept, name))
        ).apply(identity)
      } ~
      // その他のリクエストは全てindex.htmlにリダイレクト
      path(Remaining) { _ =>
        getFromFile("""./../client/index.html""")
      }
    } ~
    post {
      pathPrefix("api") {
        path("quizs" / IntNumber) { n =>
          noukai.broadcastProblem(n)
          HttpEntity(ContentTypes.`application/json`, s"""{"num":$n}""") |> toComplete
        } ~
        path("answers" / IntNumber) { n =>
          noukai.answeringProblem(n)
          HttpEntity(ContentTypes.`application/json`, s"""{"num":$n}""") |> toComplete
        }
      }
    }

  def noukaiFlow(dept: String, name: String): Flow[Message, Message, Any] =
    Flow[Message]
      .collect {
        case TextMessage.Strict(msg) => msg
      }
      .via(noukai.quizFlow(dept, name))
      .map {
        case msg: SendMessage =>
          msg.toJsonString |> TextMessage.Strict
        case e =>
          println(e)
          Map("message" -> "an error.").asJson.toString |> TextMessage.Strict
      }
}

class Server(interface: String, port: Int, val questionsPath: String)(
  implicit val system: ActorSystem,
  implicit val materializer: Materializer,
  implicit val ec: ExecutionContext
) extends NoukaiServer {

  val bindingFuture = Http().bindAndHandle(route, interface, port)

  def stop(): Future[Unit] = {
    bindingFuture.flatMap(_.unbind())
  }
}
