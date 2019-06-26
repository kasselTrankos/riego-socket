const {taggedSum} = require('daggy');
const {map, equals, of} = require('fantasy-land');
const Irrigation = taggedSum('Irrigation', {
  Some: ['items'],
  Cons: ['head', 'tail'],
  Nil: []
});
Irrigation.from = function (xs) {
  return xs.reduceRight(
    (acc, x) => Irrigation.Cons(x, acc),
    Irrigation.Nil
  )
}
Irrigation.prototype[equals] = Irrigation.prototype.equals = function (that) {
  return this.cata({
    Some: (items) => that.cata({
      Some: (items_) => {
        let _exists = false;
        for (var i = 0; i < items.length; i ++){
          const {duration, y} = items[i];
          _exists = false;
          for (var t = 0; t < items_.length; t ++) {
            const {duration: duration_, y:y_} = items_[t];
            if(duration === duration_ && y === y_){
              _exists = true;
              break;
            }
          }
          if(!_exists) break; 
        }
        return _exists;
      },
      Cons: () => false,
      Nil: () => false,
    }),
    Cons: (head, tail) => that.cata({
      Cons: (head_, tail_) => head.a === head_.a && head.b === head_.b ? tail.equals(tail_)
                                                  : head.a === head_.a && head.b === head_.b,
      Some: () => false,
      Nil: () => false,
    }),
    Nil: () => true,
  });
}
Irrigation.prototype.swap = function () {
  return this.cata({
    Cons: (head, tail) => {

      const {head_, tail_} =  tail.cata({
        Some: (items) => false,
        Cons: (head_, tail_) => {
          return {head_, tail_};
        },
        Nil: () => this,
      });
      if(!tail.is && head_.a < head.a) {
        tail = tail_;
        return Irrigation.Cons(head_, Irrigation.Cons(head, tail.swap()))
      }
      return Irrigation.Cons(head, tail.swap());
    },
    Some: (items) => this,
    Nil:() => this,
  });
}
let cons;
Irrigation.prototype.sort = function (init = true) {
  
  if(init) {
    cons = this
  } 
  return this.cata({
    Some: (items) => false,
    Cons: (head, tail) => {
      const s = cons.swap();
      cons = s
      tail.sort(false);
      return cons;
    },
    Nil: () => this,
  });
}
Irrigation.prototype[map] = Irrigation.prototype.map = function (f) {
  return this.cata({
    Some: (items) => Irrigation.Some(items.map(item => f(Object.assign({}, item)) )),
    Cons: (head, tail) => Irrigation.Cons(
      f(Object.assign({}, head)), tail.map(f)
    ),
    Nil: () => this,
  })
}

Irrigation.prototype.toArray = function () {
  return this.cata({
    Cons: (x, acc) => [
      x, ... acc.toArray()
    ],
    Some: (duration, y ) => [duration, y],
    Nil: () => [],
  })
}
module.exports = Irrigation