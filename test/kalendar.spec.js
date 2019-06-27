const {madeKalendar} = require ('./../kalendar');
const Irrigation = require ('./../src/irrigation');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');
const moment = require('moment-timezone');
const {expect} = require('chai');

const blessKalendar = jsc.bless({
  generator: ()=> {
    const now = new Date();
    const format = value => value <= 9 ? `0${value}` : value;
    const year = now.getFullYear();

    return {
      start: `${year}-${jsc.integer(1, 5).generator.map(format)()}-${jsc.integer(1, 31).generator.map(format)()}`, 
      end: `${year}-${jsc.integer(6, 12).generator.map(format)()}-${jsc.integer(1, 31).generator.map(format)()}`, 
      hour: jsc.integer(0, 24).generator.map(format)(),
      minute: jsc.integer(0, 60).generator.map(format)(),
      duration: jsc.integer(1, 60).generator(),
    };
  }
});


describe('Kalendar => ',  () => {
  it('madeKalendar', () => {
    const A = blessKalendar.generator();
    console.log(A);

    madeKalendar(A);
  })

});

