const Irrigation = require ('./../src/irrigation');
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
const testSomeIdentity = identity(blessSome());
const testConsIdentity = identity(blessCons(9));
const testConsComposition = composition(blessCons(4), jsc.bless({generator:() =>  x => {x.a =  x.a * 3; return x}}), jsc.bless({generator: ()=> x => {x.b = x.b +10; return x}}));
const testSomeComposition = composition(blessSome(4), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x => {x.y = x.y +10; return x}}));


describe('Irrigation => ',  () => {
  it('testSomeIdentity', testSomeIdentity);
  it('testConsIdentity', testConsIdentity);
  it('testConsComposition', testConsComposition);
  it('testSomeComposition', testSomeComposition);
});

const Suite = new Benchmark.Suite;
Suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
}).on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });