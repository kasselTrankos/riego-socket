const {taggedSum} = require('daggy');
const {map, equals, lte, concat} = require('fantasy-land');
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

Irrigation.prototype[lte] = Irrigation.prototype.lte = function (that) {
  return this.head.a <= that.a;
}
Irrigation.prototype[concat] = Irrigation.prototype.concat = function (that) {
  return this.cata({
    Cons:(head, tail) => {

      if(tail.is){
        return Irrigation.Cons(that.head, that.tail);
      }
      return Irrigation.Cons(head, tail.concat(that));
    },
    Nil:() => this 
  });
}


Irrigation.prototype[equals] = Irrigation.prototype.equals = function (that) {
  return this.cata({
    Cons: (head, tail) => that.cata({
      Cons: (head_, tail_) => head.a === head_.a && head.b === head_.b ? tail.equals(tail_)
                                                  : head.a === head_.a && head.b === head_.b,
      Nil: () => false,
    }),
    Nil: () => true,
  });
}
Irrigation.prototype.swap = function () {
  return this.cata({
    Cons: (head, tail) => {
      const {head_, tail_} =  tail.cata({
        Cons: (head_, tail_) => {
          return {head_, tail_};
        },
        Nil: () => this,
      });
      if(!tail.is && tail.lte(head)) {
        tail = tail_;
        return Irrigation.Cons(head_, Irrigation.Cons(head, tail.swap()))
      }
      return Irrigation.Cons(head, tail.swap());
    },
    Nil:() => this,
  });
}
let cons;
Irrigation.prototype.sort = function () {
  return this.cata({
    Cons: (head, tail) => {
      if(!cons) cons = this
      cons = cons.swap();
      tail.sort();
      return cons;
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

Irrigation.prototype.toArray = function () {
  return this.cata({
    Cons: (x, acc) => [
      x, ... acc.toArray()
    ],
    Nil: () => [],
  })
}
module.exports = Irrigation