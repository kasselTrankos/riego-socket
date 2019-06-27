const {tagged} = require('daggy');
const { contramap } = require('fantasy-land');

const Equivalence = tagged('Equivalence', ['f']);

Equivalence.prototype[contramap] = Equivalence.prototype.contramap =
  function (g) {
    return Equivalence(
      (x, y) => this.f(g(x), g(y))
    )
  }

module.exports = Equivalence;
