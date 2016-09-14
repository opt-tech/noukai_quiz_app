package opt.noukai

import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, Materializer}
import scala.concurrent.ExecutionContext
import scala.io.StdIn

object Main {

  def main(args: Array[String]): Unit = args match {
    case Array(host, port, path) => serverStart(host, port.toInt)
    case _ => serverStart()
  }

  def serverStart(host: String = "localhost", port: Int = 3000, path: String = "./../client/questions.json"): Unit = {
    implicit val system: ActorSystem = ActorSystem("noukai-app")
    implicit val materializer: Materializer = ActorMaterializer()
    implicit val ec: ExecutionContext = system.dispatcher

    try {
      val server = new Server(host, port, path)
      println(s"Server online at http://$host:$port/\nPress RETURN to stop...")

      StdIn.readLine()

      server.stop().onComplete { _ => system.terminate() }
    } catch {
      case e: Exception =>
        system.terminate()
        throw e
    }

  }
}
