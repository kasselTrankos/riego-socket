const {madeKalendar} = require ('./../kalendar');
const Irrigation = require ('./../src/irrigation');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');
const moment = require('moment-timezone');
const {expect} = require('chai');

const blessKalendar = jsc.bless({
  generator: () => {
    const format = value => value <= 9 ? `0${value}` : value;
    const start = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const end = moment().add(2, 'days').format('YYYY-MM-DD');
    return {
      start, 
      end, 
      hour: jsc.integer(0, 24).generator.map(format)(),
      minute: jsc.integer(0, 60).generator.map(format)(),
      duration: jsc.integer(1, 60).generator(),
    };
  }
});


describe('Kalendar => ',  () => {
  it('madeKalendar', async () => {
    const A = blessKalendar.generator();
    const {message, status} = await madeKalendar(A);
    expect(status).to.be.true;
  });
  it('madeKalendar -> no duplicates', ()=> {

  });

});

