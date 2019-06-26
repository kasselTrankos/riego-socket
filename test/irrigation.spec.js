const Irrigation = require ('./../src/irrigation');
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
const testConsIdentity = identity(blessCons(9));
const {associativity} = laws.Semigroup(Z.equals, Irrigation);

const testConsComposition = composition(blessCons(4), jsc.bless({generator:() =>  x => {x.a =  x.a * 3; return x}}), jsc.bless({generator: ()=> x => {x.b = x.b +10; return x}}));
const ordTestTransitivity = laws.Ord.transitivity(blessCons(), blessCons(), blessCons());
const testAssociativity = associativity (blessCons(4), blessCons(4), blessCons(4));

const A = Irrigation.from([ {a:180, b: 12}, {a: 4, b:0}, {a:11, b:2}, {a:134, b:109}, {a:190, b: 112},{a: 212, b:1}, {a: 1, b:12}, {a: 1901, b:2}]);
const B = Irrigation.from([ {a:120, b: 12}, {a: 554, b:0}]);
// const C = A.sort();
// console.log(B.toArray())
// console.log('0000909090',A.concat(B).toArray());
describe('Irrigation => ',  () => {
  it('testConsIdentity', testConsIdentity);
  it('testConsComposition', testConsComposition);
  it('ordTestTransitivity', ordTestTransitivity);
  it('testAssociativity', testAssociativity);

});

