const DateI = require ('./../src/date');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const moment = require('moment-timezone');


const blessDateI =  jsc.bless({
  generator: ()=> {
    const now = new Date();
    const format = value => value <= 9 ? `0${value}` : value;
    const year = now.getFullYear();
    const month = jsc.integer(1, 12).generator.map(format)();
    const day = jsc.integer(1, 31).generator.map(format)();
    console.log(`${year}-${month}-${day}`)
    return  DateI(`${year}-${month}-${day}`);
  }
});

const {identity, composition} = laws.Functor(Z.equals, DateI);

const testConsComposition = composition(blessDateI, jsc.bless({generator: ()=> x => moment(x)}), jsc.bless({generator: ()=> x=>x.format('YYYY')}));
console.log(blessDateI.generator().map(moment).map(x=>x.format('YYYY')));

describe('RiegoArb => ',  () => {
  it('testConsComposition', testConsComposition)
});