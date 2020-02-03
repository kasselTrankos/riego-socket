function IO(f) {
  this._f = f;
}

// map :: Functor f => f a ~> (a -> b) -> b
IO.prototype.map = function(f) {
  return IO.of(f(this._f))
}

// ap :: Apply f => f a ~> f (a->b) -> f b

IO.prototype.ap = function(b) {
  return IO.of(b.map(this._f))
}

// of :: Applicative f => a -> f a
IO.of = function(f) {
  return new IO(f);
}

module.exports = IO;