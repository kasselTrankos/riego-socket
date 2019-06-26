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
let a = 0;
let t = 0;
let cons;
Irrigation.prototype.swap = function(head_, tail_) {
  return tail_.cata({
    Some: (items) => false,
    Cons: (_head, rest) => {
      // console.log(head_.a, head.a, head_.a > head.a, '0000000\n');
      if(head_.a > _head.a){
        // head.mierda = {a1: head_.a, a2: head.a};

        // console.log('0', head, 'p', head_);
        const tmp = _head;
        _head = head_;
        head_ = tmp;
        _head.moved = a;
        head_.moved = a;
        // console.log('1' ,head, 'p', head_);

      }
      // console.log(_head, '::::::', head_);
      return {left: _head, right: head_, rest};
    },
    Nil: () => this,
  });
}
Irrigation.prototype.sorting = function () {
  return this.cata({
    Cons: (head, tail) => {
      // console.log('sorting, head', head, 'cons');
      const {left, right, rest} = this.swap(head, tail);
      // tail.sorting()
      // if(!tail.is) {
        console.log('left;', left, 'right', right);
        return Irrigation.Cons(right, Irrigation.Cons(left, tail.sorting()));
        console.log(gg.toArray, tail.is);

      // }
      // return Irrigation.Cons(head_, tail.sorting());
      // tail.sorting();
    },
    Some: (items) => this,
    Nil:() => this,
  });
}
Irrigation.prototype.sort = function () {
  if(a=== 0) {
    cons = this
  } 
  return this.cata({
    Some: (items) => false,
    Cons: (head, tail) => {
      // console.log('sort is: ', head,' this');
      const s = cons.sorting();
      console.log('ppppppppppppp',s.toArray())
      ++a;
      return Irrigation.Cons(head, tail.sort());
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