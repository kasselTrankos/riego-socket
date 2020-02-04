function Task(computation, cleanup) {
  this.fork = computation;
  this.cleanup = cleanup || function() {};
}
// ap :: Apply f => f a ~> f(a->b) -> f b;
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

// chain :: Chain m => m a ~> (a-> m b) -> m b
Task.prototype.chain = function _chain(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return f(b).fork(reject, resolve);
    });
  }, cleanup);
};

// of :: Applicative f => a -> f a
Task.prototype.of = function _of(b) {
  return new Task((_, resolve) => {
    return resolve(b);
  });
};
Task.of = Task.prototype.of;

// map :: Functor f => f a ~> (a -> b) -> f b
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

module.exports = Task;