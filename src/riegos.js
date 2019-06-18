const {taggedSum} = require('daggy');
const {equals, empty, map, of} = require('fantasy-land');
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
  const isEqual = _this => _that => _this[equal](_that);
  const _this = this.toArray();
  const _that = that.toArray();
  const _equals = _that.map(el => _this.some(_el => _el[equals](el)));
  const areEquals =  _equals.reduce((acc, val)=> { 
    if(!val) acc = false; 
    return val;}, 
    true);
  return areEquals;
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



