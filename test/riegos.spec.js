const Riegos = require ('./../src/riegos');
const Riego = require ('./../src/riego');

const {expect} = require('chai');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
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

const {identity} = laws.Functor(Z.equals, Riegos);
const testIdentity = identity(blessRiegos());

describe('Riegos  => ',  () => {
  it('testIdentity', testIdentity);
  it('testComposition', ()=> {
    const map = f => U => U.map(f);
    const compose = (f, g) => x => f(g(x))
    const G = blessRiegos().generator()
    const fa = x => {x.duration = x.duration *45; return x;};
    const fb = x => {x.hour = x.hour *45; return x;};
    
    expect(Z.Functor.test(G)).to.be.true;
    expect(Z.equals(map(compose(fb, fa))(G), compose(map(fa), map(fb))(G)))
    
  })
  
});