import {taggedSum} from 'daggy';
const Maybe = taggedSum('Maybe', {
    Nothing: [],
    Just: ['x']
});


Maybe.prototype.map = function (f) {
  return this.cata({
    Just: x => f(x),
    Nothing: () => Maybe.Nothing
  });
}

Maybe.map = Maybe.prototype.map;

Maybe.prototype.alt = function (that) {
  return this.cata({
    Just: () => this,
    Nothing: () => that,
  });
}

Maybe.alt = Maybe.prototype.alt;

Maybe.prototype.of = function(x) {
  return this.cata({
      Just: _ => this,
      Nothing: () => x
  });
}

Maybe.of = Maybe.prototype.of;

module.exports = Maybe;