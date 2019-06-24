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
const blessSomeEs6 = (length=3) => jsc.bless({
  generator: ()=> {
    const elms = Array.from({length}, ()=> 
      ({duration: jsc.integer(0, 60).generator(), y: jsc.integer(0, 60).generator()}));
    return Irrigation.SomeEs6(elms);
  }
});

const {identity, composition} = laws.Functor(Z.equals, Irrigation);
const testSomeComposition = composition(blessSome(4), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x => {x.y = x.y +10; return x}}));
const testSomeCompositionEs6 = composition(blessSomeEs6(4), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x => {x.y = x.y +10; return x}}));

const suite = new Benchmark.Suite;
suite.add('testSomeComposition#test', testSomeComposition)
suite.add('testSomeCompositionEs6#test', testSomeCompositionEs6)
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });