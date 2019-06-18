const {taggedSum} = require('daggy');
const {empty, map, of} = require('fantasy-land');
const Riego  = require('./riego');
const Riegos = taggedSum('Riegos', {
  Cons: ['head', 'tail'],
  Nil: [],
});
// Riegos[of] = value => Riegos(value);
Riegos.from = function (xs) {
  return xs.reduceRight(
    (acc, x) => Riegos.Cons(x, acc),
    Riegos.Nil
  )
}

Riegos.prototype.map = function (f) {
  return this.cata({
    Cons: (head, tail) => Riegos.Cons(
      f(head), tail.map(f)
    ),
    Nil: () => Riegos.Nil
  })
}
Riegos.prototype.filter = function (f) {
  return this.cata({
    Cons: (head, tail) => {
      const _head = f(head) ? head : Riegos.Nil
      return _head === Riegos.Nil ?
        tail.filter(f) : Riegos.Cons(_head, tail.filter(f))
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



