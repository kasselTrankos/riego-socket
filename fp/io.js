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


function Task(computation, _return) {
  this.fork = computation;
  this._return = _return || function() {};
}
Task.prototype.chain = function _chain(f) {
  var fork = this.fork;
  var _return = this._return;

  return new Task(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return f(b).fork(reject, resolve);
    });
  }, _return);
};

Task.prototype.of = function _of(b) {
  return new Task((_, resolve) => {
    return resolve(b);
  });
};
Task.of = Task.prototype.of;

Task.prototype.map = function _map(f) {
  var fork = this.fork;
  var _return = this._return;

  return new Task(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return resolve(f(b));
    });
  }, _return);
};


module.exports = {IO, Task};