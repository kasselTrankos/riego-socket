/**
 * need to re-read this 
 * http://www.tomharding.me/2017/04/09/fantas-eel-and-specification-3.5/
 */
const {taggedSum} = require('daggy');
const {filter, equals, empty, map, of} = require('fantasy-land');
const Riegos = taggedSum('Riegos', {
  Cons: ['head', 'tail'],
  Nil: [],
});
Riegos[of] = value => Riegos.from(value);
Riegos.from = function (xs) {
  return xs.reduceRight(
    (acc, x) => Riegos.Cons(x, acc),
    Riegos.Nil
  )
}
Riegos.prototype[equals] = Riegos.prototype.equals = function (that) {
  return this.cata({
    Cons: (head, tail) => that.cata({
      Cons: (head_, tail_) =>
        head.equals(head_) ? tail.equals(tail_)
                           : head.equals(head_),
      Nil: () => false
    }),
    Nil: () => true
  })
}
Riegos.prototype[map] = Riegos.prototype.map = function (f) {
  return this.cata({
    Cons: (head, tail) => Riegos.Cons(
      f(head), tail.map(f)
    ),
    Nil: () => Riegos.Nil
  })
}
Riegos.prototype[filter] = Riegos.prototype.filter = function (f) {
  return this.cata({
    Cons: (head, tail) => {
      return !f(head) ? tail.filter(f) 
                      : Riegos.Cons(head, tail.filter(f))
    },
    Nil: () => Riegos.Nil
  })
}

// And a conversion back for convenience!
Riegos.prototype.toArray = function () {
  return this.cata({
    Cons: (x, acc) => [
      x, ...acc.toArray()
    ],
    Nil: () => []
  })
}

module.exports = Riegos;



