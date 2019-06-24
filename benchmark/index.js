const Irrigation = require ('../src/irrigation');
var Benchmark = require('benchmark');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');

const blessSome = (length=3) => jsc.bless({
  generator: ()=> {

    const elms = Array.from({length}, ()=> 
      ({duration: jsc.integer(0, 60).generator(), y: jsc.integer(0, 60).generator()}));
    return Irrigation.Some(elms);
  }
});
const blessCons = (length=3) => jsc.bless({
  generator: ()=> {
    const elms = Array.from({length}, ()=> ({a: jsc.integer(0, 60).generator(), b: jsc.integer(0, 60).generator()}));
    return Irrigation.from(elms);
  }
});

const {identity, composition} = laws.Functor(Z.equals, Irrigation);
const testSomeComposition = composition(blessSome(4), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x => {x.y = x.y +10; return x}}));

const suite = new Benchmark.Suite;
suite.add('testSomeComposition#test', testSomeComposition)
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });