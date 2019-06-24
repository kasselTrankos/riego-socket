const Irrigation = require ('./../src/irrigation');
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
const blessCons = (length=3) => jsc.bless({
  generator: ()=> {
    const elms = Array.from({length}, ()=> ({a: jsc.integer(0, 60).generator(), b: jsc.integer(0, 60).generator()}));
    return Irrigation.from(elms);
  }
});
const {identity, composition} = laws.Functor(Z.equals, Irrigation);
const testSomeIdentity = identity(blessSome());
const testSomeEs6Identity = identity(blessSomeEs6());
const testConsIdentity = identity(blessCons(9));

const testConsComposition = composition(blessCons(4), jsc.bless({generator:() =>  x => {x.a =  x.a * 3; return x}}), jsc.bless({generator: ()=> x => {x.b = x.b +10; return x}}));
const testSomeComposition = composition(blessSome(4), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x => {x.y = x.y +10; return x}}));


describe('Irrigation => ',  () => {
  it('testSomeIdentity', testSomeIdentity);
  it('testSomeEs6Identity', testSomeEs6Identity);
  it('testConsIdentity', testConsIdentity);
  it('testConsComposition', testConsComposition);
  it('testSomeComposition', testSomeComposition);
});

