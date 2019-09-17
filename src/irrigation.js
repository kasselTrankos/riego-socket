const {taggedSum} = require('daggy');
const {map, equals, lte, concat, filter, empty} = require('fantasy-land');
const {tz} = require('./../utils/date.utils');
const Irrigation = taggedSum('Irrigation', {
  Cons: ['head', 'tail'],
  Nil: []
});
Irrigation.from = function (xs) {
  return xs.reduceRight(
    (acc, x) => Irrigation.Cons(x, acc),
    Irrigation.Nil
  )
}

Irrigation[empty] = Irrigation.empty = function () {
  return Irrigation.from([]);
}

Irrigation.prototype[lte] = Irrigation.prototype.lte = function (that) {
  return +tz(new Date(this.head.date)) < +tz(new Date(that.date));
}

Irrigation.prototype[concat] = Irrigation.prototype.concat = function (that) {
  return this.cata({
    Cons:(head, tail) => {
      return tail.is && that.head
        ? Irrigation.Cons(head, Irrigation.Cons(that.head, that.tail))
        : Irrigation.Cons(head, !that.is ? tail.concat(that) : tail);
    },
    Nil:() => this 
  });
}


Irrigation.prototype[equals] = Irrigation.prototype.equals = function (that) {
  return this.cata({
    Cons: (head, tail) => that.cata({
      Cons: (head_, tail_) => +tz(new Date(head.date)) === +tz(new Date(head_.date))
                              ? tail.equals(tail_)
                              : +tz(new Date(head.date)) === +tz(new Date(head_.date)),
      Nil: () => false,
    }),
    Nil: () => true,
  });
}

Irrigation.prototype.swap = function () {
  return this.cata({
    Cons: (head, tail) => {
      const {head_, tail_} =  tail.cata({
        Cons: (head_, tail_) => ({head_, tail_}),
        Nil: () => this,
      });
      if(!tail.is && tail.lte(head)) {
        tail = tail_;
        return Irrigation.Cons(Object.assign({}, head_), 
          Irrigation.Cons(Object.assign({}, head), tail).swap())
      }
      return Irrigation.Cons(Object.assign({}, head), tail.swap());
    },
    Nil:() => this,
  });
}
let sortedIrrigation;
Irrigation.prototype.sort = function (_cons = this) {
  let cons = _cons || this;
  return this.cata({
    Cons: (head, tail) => {
      sortedIrrigation = cons = cons.swap();
      tail.sort(cons);
      return sortedIrrigation;
    },
    Nil: () => this,
  });
}

Irrigation.prototype[map] = Irrigation.prototype.map = function (f) {
  return this.cata({
    Cons: (head, tail) => Irrigation.Cons(
      f(Object.assign({}, head)), tail.map(f)
    ),
    Nil: () => this,
  })
}

Irrigation.prototype[filter] = Irrigation.prototype.filter = function (f) {
  return this.cata({
    Cons: (head, tail) => {
      return !f(head) ? tail.filter(f) 
                      : Irrigation.Cons(head, tail.filter(f))
    },
    Nil: () => Irrigation.Nil
  })
}


Irrigation.prototype.contains = function (f) {
  return this.cata({
    Cons: (head, tail) => {
      if(f(head)) return true;
      Irrigation.Cons(head, tail.contains(f));
      return false;
    },
    Nil: () => [],
  })
}

Irrigation.prototype.toArray = function () {
  return this.cata({
    Cons: (x, acc) => [
      x, ... acc.toArray()
    ],
    Nil: () => [],
  })
}

module.exports = Irrigation