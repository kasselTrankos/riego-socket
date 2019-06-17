const Riego = require ('./../src/Riego');
const {concat} = require('ramda');
const FL = require('fantasy-land');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const allwaysTrue = jsc.bool.generator.map(bool => true)
const arbRiego = jsc.record({
  date: jsc.datetime,
  hour: jsc.integer(0, 24),
  minute: jsc.integer(0, 60),
  duration: jsc.integer(0, 60),
  active: jsc.bool,
});
const {associativity} = laws.Semigroup(Z.equals, Riego);
const {leftIdentity, rightIdentity} = laws.Monoid((concated, _this) => {console.log('soy concated', concated, 'hay this?', _this); return true}, Riego);
const testAssociativity = associativity (arbRiego, arbRiego, arbRiego);
const testRightIdentity = rightIdentity (arbRiego);
const testLeftIdentity = leftIdentity (arbRiego);

console.log(FL);
describe('RiegoArb => ',  () => {
 it('testAssociativity', testAssociativity);
 it('custom ', ()=> {
    const A = Riego[FL.empty]();
    const B = Riego(new Date(), 12, 10, 11, true);
    const C = B[FL.concat](A);
    const F = A[FL.concat](B);
    const D = concat(A, B);
    c = curry2 (Z.concat);
    const G = c(A)(B);
    console.log(A[FL.concat], FL.concat);
    // console.log('000', Z.equals(G, B), G, B);
    // console.log(A, 'B:', B, 'C: ', C);
 }) 
 it('testRightIdentity', testRightIdentity);
//  it('testLeftIdentity', testLeftIdentity);
});