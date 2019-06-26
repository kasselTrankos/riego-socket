const Irrigation = require ('../src/irrigation');
var Benchmark = require('benchmark');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');

const blessCons = (length=3) => jsc.bless({
  generator: ()=> {
    const elms = Array.from({length}, ()=> ({a: jsc.integer(0, 60).generator(), b: jsc.integer(0, 60).generator()}));
    return Irrigation.from(elms);
  }
});

const {identity, composition} = laws.Functor(Z.equals, Irrigation);
const testConsIdentityCons= identity(blessCons(1400));

const suite = new Benchmark.Suite;
suite.add('Test order  using bubble sort #test',  () => blessCons(70).generator().sort())
suite.add('Test order  native sort #test',  () => {
  const sort = (elmA, elmB)=> {
    if (elmA.a > elmB.a) return 1;
    if (elmA.a < elmB.a) return -1;
  return
  }
  blessCons(70).generator().toArray().sort();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });