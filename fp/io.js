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
  this.cleanup = _return || function() {};
}
Task.prototype.ap = function _ap(that) {
  var forkThis = this.fork;
  var forkThat = that.fork;
  var cleanupThis = this.cleanup;
  var cleanupThat = that.cleanup;

  function cleanupBoth(state) {
    cleanupThis(state[0]);
    cleanupThat(state[1]);
  }
  return new Task(function(reject, resolve) {
    var func, funcLoaded = false;
    var val, valLoaded = false;
    var rejected = false;
    var allState;

    var thisState = forkThis(guardReject, guardResolve(function(x) {
      funcLoaded = true;
      func = x;
    }));

    var thatState = forkThat(guardReject, guardResolve(function(x) {
      valLoaded = true;
      val = x;
    }));

    function guardResolve(setter) {
      return function(x) {
        if (rejected) {
          return;
        }

        setter(x);
        if (funcLoaded && valLoaded) {
          delayed(function(){ cleanupBoth(allState) });
          return resolve(func(val));
        } else {
          return x;
        }
      }
    }

    function guardReject(x) {
      if (!rejected) {
        rejected = true;
        return reject(x);
      }
    }

    return allState = [thisState, thatState];
  }, cleanupBoth);
};
Task.prototype.chain = function _chain(f) {
  var fork = this.fork;
  var _return = this.cleanup;

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