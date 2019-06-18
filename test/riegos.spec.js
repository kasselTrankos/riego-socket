const Riegos = require ('./../src/riegos');
const Riego = require ('./../src/riego');
const {concat} = require('ramda');
const FL = require('fantasy-land');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const arbRiego = jsc.record({
  date: jsc.datetime(new Date('2015-11-10'), new Date()),
  hour: jsc.integer(0, 24),
  minute: jsc.integer(0, 60),
  duration: jsc.integer(0, 60),
  active: jsc.bool,
});
const blessRiegos = (amount = 4) => jsc.bless({
  generator: ()=> {
    const riegos = Array.from({length: amount}, ()=> {
      const riego = arbRiego.generator()
      return Riego(riego.date, riego.duration, riego.hour, riego.minute, true);
    }); 
    return Riegos.from(riegos);
  }
});
const {identity, composition} = laws.Functor(x=> true, Riegos);
const testIdentity = identity(blessRiegos());

const testComposition = composition(blessRiegos(), blessRiegos(), blessRiegos());
describe('Riegos  => ',  () => {
  // it('testComposition', testComposition);
  it('testIdentity', testIdentity);

});