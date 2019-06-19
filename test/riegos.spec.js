const Riegos = require ('./../src/riegos');
const Riego = require ('./../src/riego');

const {expect} = require('chai');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');

const startDate = new Date();
const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 6, startDate.getDate());
const arbRiego = jsc.record({
  date: jsc.datetime(startDate, endDate),
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
const d = new Date(new Date(startDate.getFullYear(), startDate.getMonth() + 3, startDate.getDate()))

const { distributivity, identity: identityFilterable, annihilation } = laws.Filterable(Z.equals, Riegos);
const {identity, composition} = laws.Functor(Z.equals, Riegos);
console.log(laws.Functor(Z.equals, Riegos))
const testIdentity = identity(blessRiegos());
const testComposition = composition(blessRiegos(13), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x=> {x.hour = x.hour +10; return x}}));
const testDistributivity  = distributivity(blessRiegos(2), jsc.bless({generator:() =>  x => x.date > d}), jsc.bless({generator: ()=> x=> x.duration > 10}));
const testAnnihilation = annihilation(blessRiegos(13), blessRiegos(13));
const testIdentityFilterable = identityFilterable(blessRiegos(10));

describe('Riegos  => ',  () => {
  it('testIdentity', testIdentity);
  it('testComposition', testComposition);
  it('testAnnihilation', testAnnihilation);
  it('testDistributivity', testDistributivity);
  it('testIdentityFilterable', testIdentityFilterable);
});