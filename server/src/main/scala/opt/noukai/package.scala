package opt

package object noukai {
  implicit final class AnyTap[T](val v: T) extends AnyVal {
    def pipe[A](f: T => A): A = f(v)
    def |>[A](f: T => A): A = pipe(f)

    def tap[A](f: T => A): T = { f(v); v }
    def <|[A](f: T => A): T = tap(f)
  }
}
