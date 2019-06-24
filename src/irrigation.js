const {taggedSum} = require('daggy');
const {map, equals, of} = require('fantasy-land');

const Irrigation = taggedSum('Irrigation', {
  Some: ['items'],
  None: [],
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
      Some: (items_) => items.reduce((acc, {duration: duration_, y:y_}) => {
        const find = items.filter(({duration, y}) => duration_ === duration && y === y_);
        if(!find.length) {
          acc = false;
        }
        return acc;
      }, true),

      Nil: () => false,
      None :() => false,
      Cons: () => false
    }),
    Cons: (head, tail) => that.cata({
      Cons: (head_, tail_) => head.a === head_.a && head.b === head_.b ? tail.equals(tail_)
                                                  : head.a === head_.a && head.b === head_.b,
      Nil: () => false,
      None :() => false,
      Some: () => false
    }),
    Nil: () => true,
    None: () => true,
  });
}
Irrigation.prototype[map] = Irrigation.prototype.map = function (f) {
  return this.cata({
    Some: (items) => Irrigation.Some(items.map(item => f(Object.assign({}, item)) )),
    None: () => this,
    Nil: () => this,
    Cons: (head, tail) => Irrigation.Cons(
      f(Object.assign({}, head)), tail.map(f)
    )
  })
}

Irrigation.prototype.toArray = function () {
  return this.cata({
    Cons: (x, acc) => [
      x, ... acc.toArray()
    ],
    Some: (duration, y ) => [duration, y],
    None: () => [],
    Nil: () => [],
  })
}
module.exports = Irrigation