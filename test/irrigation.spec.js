const Irrigation = require ('@functional-lib/irrigation');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');
const {expect} = require('chai');
const {tz} = require('./../utils/date.utils');

const blessCons = (length=3) => jsc.bless({
  generator: ()=> {
    const now =  new Date();
    const from = new Date(now.setDate(now.getDate()-jsc.integer(0, 100).generator()))
    const to = new Date(now.setDate(now.getDate()+jsc.integer(0, 100).generator()))
    const elms = Array.from({length}, ()=> (
      {
        date: jsc.datetime(from, to).generator(), 
        b: jsc.integer(0, 60).generator(),
      }));
    return Irrigation.from(elms);
  }
});

const {identity, composition} = laws.Functor(Z.equals, Irrigation);
const testConsIdentity = identity(blessCons(9));
const {rightIdentity, leftIdentity} = laws.Monoid(Z.equals, Irrigation);

const testConsComposition = composition(blessCons(4), jsc.bless({generator:() =>  x => {x.a =  x.a * 3; return x}}), jsc.bless({generator: ()=> x => {x.b = x.b +10; return x}}));
const ordTestTransitivity = laws.Ord.transitivity(blessCons(900), blessCons(900), blessCons(900));
const testRightIdentity = rightIdentity (blessCons(14));
const testleftIdentity = leftIdentity (blessCons(14));


describe('Irrigation => ',  () => {
  it('testConsIdentity', testConsIdentity);
  it('testConsComposition', testConsComposition);
  it('ordTestTransitivity', ordTestTransitivity);
  it('testRightIdentity', testRightIdentity);
  it('testleftIdentity', testleftIdentity);

  it('Sort correct', () => {
    const A = blessCons(146).generator().sort().toArray();
    let correct = true;
    for(let i =0 ; i< A.length; i++){
      if(i +1 < A.length && tz(A[i].date)> tz(A[i+1].date)) {
        correct = false;
        break;
      }
    }
    expect(correct).to.be.true;
  });
  it('contains', () => {
    const A = blessCons(146).generator();
    const {head} = A;
    const containsHeadDate = el => +el.date === +head.date;
    const containsByA = el => el.a ===9;
    const B = Irrigation.from([{a:1}, {a:2}, {a:3}, {a:6}]);
    
    expect(A.contains(containsHeadDate)).to.be.true; 
    expect(B.contains(containsByA)).to.be.false; 
  }); 

});

