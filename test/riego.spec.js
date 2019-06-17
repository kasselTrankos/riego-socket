const Riego = require ('./../src/Riego');
const {concat} = require('fantasy-land');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const RiegoArb = jsc.json.smap(Riego, riego => riego.value, show);
const arbRiego = jsc.record({
  date: jsc.datetime,
  hour: jsc.nat(24),
  minute: jsc.nat(60),
  duration: jsc.nat(60),
  active: jsc.bool,
});
const {associativity} = laws.Semigroup(Z.equals, Riego);
const testAssociativity = associativity (arbRiego, arbRiego, arbRiego);
describe('RiegoArb => ',  () => {
 it('testAssociativity', testAssociativity);
});