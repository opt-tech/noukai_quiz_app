package opt.noukai.messages

sealed abstract class SendMessage { def toJsonString: String }
case class BroadcastProblem(id: Int) extends SendMessage {
  def toJsonString = s"""{ "quizNum": $id }"""
}
case class AnsweringProblem(id: Int, correctAnswer: Int, answer: Int = 0) extends SendMessage {
  def putAnswer(ans: Int): AnsweringProblem = this.copy(answer = ans)
  def toJsonString = s"""{ "isCorrect": ${correctAnswer == answer} }""" // 未回答の場合、ansには-1が入っているので絶対に間違いになる。
}
case object Ping extends SendMessage {
  def toJsonString = """ "p" """
}
case class SomeoneAnswered(num: Int) extends SendMessage {
  def toJsonString: String = s"""{"answeredNum": $num}"""
}
