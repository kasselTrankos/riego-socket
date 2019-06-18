const Riego = require ('./../src/riego');
const {concat} = require('ramda');
const FL = require('fantasy-land');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const allwaysTrue = jsc.bool.generator.map(bool => true)
const arbRiego = jsc.record({
  date: jsc.datetime(new Date('2015-11-10'), new Date()),
  hour: jsc.integer(0, 24),
  minute: jsc.integer(0, 60),
  duration: jsc.integer(0, 60),
  active: jsc.bool,
});
const blessRiego = jsc.bless({
  generator: ()=> {
    const riego = arbRiego.generator();
    return Riego(riego.date, riego.duration, riego.hour, riego.minute, true);
  }
});
const {associativity} = laws.Semigroup(Z.equals, Riego);
console.log(laws.Ord);
const testReflexivity = laws.Setoid.reflexivity(blessRiego);
const testTotality = laws.Ord.totality(blessRiego, blessRiego);
const testAntisymmetry = laws.Ord.antisymmetry(blessRiego, blessRiego);
const ordTestTransitivity = laws.Ord.transitivity(blessRiego, blessRiego, blessRiego);

const testSymmetry = laws.Setoid.symmetry(blessRiego, blessRiego);
const testTransitivity = laws.Setoid.transitivity(blessRiego, blessRiego, blessRiego);

const {leftIdentity, rightIdentity} = laws.Monoid(Z.equals, Riego);
const {leftInverse, rightInverse} = laws.Group(Z.equals, Riego);
const testAssociativity = associativity (blessRiego, blessRiego, blessRiego);
const testRightIdentity = rightIdentity (blessRiego);
const testLeftIdentity = leftIdentity (blessRiego);
const testLeftInverse = leftInverse (blessRiego);
const testRightInverse = rightInverse (blessRiego);

describe('RiegoArb => ',  () => {
 it('testTotality', testTotality);
 it('testAntisymmetry', testAntisymmetry);
 it('ordTestTransitivity', ordTestTransitivity);
 it('testAssociativity', testAssociativity);
 it('testLeftIdentity', testLeftIdentity);
 it('testRightIdentity', testRightIdentity);
 it('testLeftInverse', testLeftInverse);
 it('testRightInverse', testRightInverse);
 it('testReflexivity', testReflexivity);
 it('testSymmetry', testSymmetry);
 it('testTransitivity', testTransitivity);
});