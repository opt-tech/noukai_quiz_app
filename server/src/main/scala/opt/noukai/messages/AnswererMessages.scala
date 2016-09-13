package opt.noukai.messages

import akka.actor.ActorRef
import opt.noukai.actors.AnswererActor.AnswererInfo
import opt.noukai.entities.Identify

case class NewAnswerer(id: Identify, subscriber: ActorRef)
case class AnswererLeft(id: Identify)
case class InitInfo(answererInfo: AnswererInfo, currentProblem: Int)
