const {taggedSum} = require('daggy');
const {compose, equals, empty, map, of} = require('fantasy-land');
const Riego  = require('./riego');
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
  const _this = this.toArray();
  const _that = that.toArray();
  const isEqual = _that.reduce((acc, el) => {
    const _isEqual = _this.some(_el => _el[equals](el));
    if(!_isEqual){
      acc = false;
    }
    return _isEqual;
  }, true);

  return isEqual;
}
Riegos.prototype[map] = Riegos.prototype.map = function (f) {
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
      return !f(head) ? tail.filter(f) : Riegos.Cons(head, tail.filter(f))
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



