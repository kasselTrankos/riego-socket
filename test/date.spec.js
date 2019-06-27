const DateI = require ('./../src/date');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');


const blessDateI =  jsc.bless({
  generator: ()=> {
    const now = new Date();
    const format = value => value <= 9 ? `0${value}` : value;
    const year = now.getFullYear();
    const month = jsc.integer(1, 12).generator.map(format)();
    const day = jsc.integer(1, 31).generator.map(format)();
    
    return `${year}-${month}-${day}`;
  }
});

console.log(blessDateI.generator());

describe('RiegoArb => ',  () => {
  
});