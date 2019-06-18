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

const { distributivity, annihilation } = laws.Filterable(Z.equals, Riegos);
const {identity} = laws.Functor(Z.equals, Riegos);
// console.log(laws.Filterable(Z.equals, Riegos))
const testIdentity = identity(blessRiegos());
const testDistributivity = distributivity(blessRiegos(13), jsc.bless({generator:() =>  x => x.date > d}), jsc.bless({generator: ()=> x=> x.duration > 10}));
const testAnnihilation = annihilation(blessRiegos(13), blessRiegos(13));

describe('Riegos  => ',  () => {
  it('testIdentity', testIdentity);
  it('testAnnihilation', testAnnihilation);
  it('testDistributivity', testDistributivity);
  it('testComposition', ()=> {
    const map = f => U => U.map(f);
    const compose = (f, g) => x => f(g(x))
    const G = blessRiegos(20).generator()
    const fa = x => {x.duration = x.duration *45; return x;};
    const fb = x => {x.hour = x.hour *45; return x;};
    
    expect(Z.Functor.test(G)).to.be.true;
    expect(Z.equals(map(compose(fb, fa))(G), compose(map(fa), map(fb))(G)))
    
  });
  it('testFilter', ()=> {
    const G = blessRiegos(300).generator();
    const d = new Date(new Date(startDate.getFullYear(), startDate.getMonth() + 3, startDate.getDate()))
    const J = G.filter(x=> x.date > d);
    const ALL = J.toArray().every(x=> x.date > d);
    const ANY = G.toArray().every(x=> x.date > d);
    expect(ALL).to.be.true;
    expect(ANY).to.be.false;
  });
});